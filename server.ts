import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import type { AdmissionApplication, ContactMessage, AdmissionStats, AgeGroup } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser with 50MB limit to handle base64 uploaded document images (Birth certificates & VNeID photos)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Persistent JSON storage path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'admissions-db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): { applications: AdmissionApplication[]; contactMessages: ContactMessage[] } {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      return {
        applications: Array.isArray(data.applications) ? data.applications : [],
        contactMessages: Array.isArray(data.contactMessages) ? data.contactMessages : [],
      };
    }
  } catch (err) {
    console.error('Error loading database file:', err);
  }
  return { applications: [], contactMessages: [] };
}

function saveDatabase() {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify({ applications, contactMessages }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Initial state loaded from persistent storage
const db = loadDatabase();
let applications: AdmissionApplication[] = db.applications;
let contactMessages: ContactMessage[] = db.contactMessages;

// Helper to remove accents for Vietnamese fuzzy searching
function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

// Quotas configuration for the school
const GROUP_QUOTAS: Record<AgeGroup, number> = {
  nursery_18_24: 30,
  nursery_25_36: 45,
  kindergarten_3_4: 70,
  kindergarten_4_5: 80,
  kindergarten_5_6: 90,
};

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==================== API ROUTES ====================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Admissions statistics
app.get('/api/admissions/stats', (req, res) => {
  const stats: AdmissionStats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    approved: applications.filter(a => a.status === 'approved').length,
    needSupplement: applications.filter(a => a.status === 'need_supplement').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    byGroup: {
      nursery_18_24: {
        count: applications.filter(a => a.targetGroup === 'nursery_18_24').length,
        quota: GROUP_QUOTAS.nursery_18_24,
      },
      nursery_25_36: {
        count: applications.filter(a => a.targetGroup === 'nursery_25_36').length,
        quota: GROUP_QUOTAS.nursery_25_36,
      },
      kindergarten_3_4: {
        count: applications.filter(a => a.targetGroup === 'kindergarten_3_4').length,
        quota: GROUP_QUOTAS.kindergarten_3_4,
      },
      kindergarten_4_5: {
        count: applications.filter(a => a.targetGroup === 'kindergarten_4_5').length,
        quota: GROUP_QUOTAS.kindergarten_4_5,
      },
      kindergarten_5_6: {
        count: applications.filter(a => a.targetGroup === 'kindergarten_5_6').length,
        quota: GROUP_QUOTAS.kindergarten_5_6,
      },
    },
  };
  res.json(stats);
});

// 3. List applications with filters (For School Admin)
app.get('/api/admissions', (req, res) => {
  const { status, targetGroup, search } = req.query;
  let filtered = [...applications];

  if (status && status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }

  if (targetGroup && targetGroup !== 'all') {
    filtered = filtered.filter(a => a.targetGroup === targetGroup);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      a =>
        a.id.toLowerCase().includes(q) ||
        a.studentName.toLowerCase().includes(q) ||
        (a.personalIdNumber && a.personalIdNumber.includes(q)) ||
        (a.fatherPhone && a.fatherPhone.includes(q)) ||
        (a.motherPhone && a.motherPhone.includes(q)) ||
        (a.contactPhone && a.contactPhone.includes(q)) ||
        (a.fatherIdCard && a.fatherIdCard.includes(q)) ||
        (a.motherIdCard && a.motherIdCard.includes(q))
    );
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(filtered);
});

// 4. Lookup application for parents (by ID, Student Name, Student Personal ID 12 digits, Parent CCCD, or Phone)
app.get('/api/admissions/lookup/:query', (req, res) => {
  const rawQuery = (req.params.query || '').trim();
  if (!rawQuery) {
    return res.status(400).json({ message: 'Vui lòng nhập thông tin cần tra cứu.' });
  }

  const query = rawQuery.toLowerCase();
  const noAccentQuery = removeVietnameseAccents(rawQuery);
  const digitsOnlyQuery = rawQuery.replace(/\D/g, '');

  const found = applications.filter(a => {
    // 1. Match application ID
    if (a.id.toLowerCase() === query || a.id.toLowerCase().includes(query)) return true;

    // 2. Match student personal ID 12 digits
    if (a.personalIdNumber) {
      const cleanPersonalId = a.personalIdNumber.replace(/\D/g, '');
      if (cleanPersonalId && digitsOnlyQuery && (cleanPersonalId === digitsOnlyQuery || cleanPersonalId.includes(digitsOnlyQuery))) {
        return true;
      }
      if (a.personalIdNumber.toLowerCase().includes(query)) return true;
    }

    // 3. Match student name (with & without accents)
    if (a.studentName) {
      const studentNameLower = a.studentName.toLowerCase();
      const studentNameNoAccent = removeVietnameseAccents(a.studentName);
      if (studentNameLower.includes(query) || (noAccentQuery && studentNameNoAccent.includes(noAccentQuery))) {
        return true;
      }
    }

    // 4. Match parent CCCD / ID Card
    if (digitsOnlyQuery && digitsOnlyQuery.length >= 6) {
      if (a.motherIdCard && a.motherIdCard.replace(/\D/g, '').includes(digitsOnlyQuery)) return true;
      if (a.fatherIdCard && a.fatherIdCard.replace(/\D/g, '').includes(digitsOnlyQuery)) return true;
    }

    // 5. Match phone numbers (contact, mother, father)
    if (digitsOnlyQuery && digitsOnlyQuery.length >= 6) {
      const cleanContact = (a.contactPhone || '').replace(/\D/g, '');
      const cleanMother = (a.motherPhone || '').replace(/\D/g, '');
      const cleanFather = (a.fatherPhone || '').replace(/\D/g, '');
      if (cleanContact.includes(digitsOnlyQuery) || cleanMother.includes(digitsOnlyQuery) || cleanFather.includes(digitsOnlyQuery)) {
        return true;
      }
    }

    // 6. Match parent names
    if (noAccentQuery && noAccentQuery.length >= 3) {
      if (a.motherName && removeVietnameseAccents(a.motherName).includes(noAccentQuery)) return true;
      if (a.fatherName && removeVietnameseAccents(a.fatherName).includes(noAccentQuery)) return true;
    }

    return false;
  });

  if (found.length === 0) {
    return res.status(404).json({ 
      message: `Không tìm thấy hồ sơ tuyển sinh nào khớp với thông tin "${rawQuery}". Quý phụ huynh vui lòng kiểm tra lại Mã hồ sơ, Mã định danh 12 số hoặc Họ tên bé.` 
    });
  }

  res.json(found);
});

// 5. Submit admission application (Parent registration)
app.post('/api/admissions', (req, res) => {
  try {
    const data = req.body;

    // Validate required fields as per official form
    if (!data.studentName || !data.studentName.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập họ và tên học sinh' });
    }
    if (!data.birthDate) {
      return res.status(400).json({ error: 'Vui lòng nhập ngày tháng năm sinh của học sinh' });
    }
    if (!data.personalIdNumber || !data.personalIdNumber.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập số định danh cá nhân học sinh' });
    }
    if (!data.contactPhone || !data.contactPhone.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập số điện thoại liên hệ' });
    }

    // Auto calculate target age group based on birth date if not specified
    let targetGroup: AgeGroup = data.targetGroup || 'kindergarten_3_4';
    if (!data.targetGroup && data.birthDate) {
      const birthYear = new Date(data.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      if (age <= 1) {
        targetGroup = 'nursery_18_24';
      } else if (age === 2) {
        targetGroup = 'nursery_25_36';
      } else if (age === 3) {
        targetGroup = 'kindergarten_3_4';
      } else if (age === 4) {
        targetGroup = 'kindergarten_4_5';
      } else {
        targetGroup = 'kindergarten_5_6';
      }
    }

    const randomIdSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `TSMN-2026-${randomIdSuffix}`;

    // Build complete address strings
    const permanentAddress = [
      data.permanentHouseNumber,
      data.permanentHamlet,
      data.permanentWard,
      data.permanentProvince
    ].filter(Boolean).join(', ') || data.permanentAddress || '';

    const currentAddress = [
      data.currentHouseNumber,
      data.currentHamlet,
      data.currentWard,
      data.currentProvince
    ].filter(Boolean).join(', ') || data.currentAddress || permanentAddress;

    const newApplication: AdmissionApplication = {
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      statusNote: 'Hồ sơ đã gửi thành công lên hệ thống, đang chờ Ban Tuyển sinh tiếp nhận & đối chiếu.',
      
      // 1. Thông tin học sinh
      studentName: (data.studentName || '').trim(),
      gender: data.gender || 'Nam',
      ethnicity: (data.ethnicity || 'Kinh').trim(),
      birthDate: data.birthDate,
      birthPlace: (data.birthPlace || 'TP. Hà Nội').trim(),
      detailedBirthPlace: (data.detailedBirthPlace || '').trim(),
      policyCategory: (data.policyCategory || 'Không có').trim(),
      disabilityStatus: (data.disabilityStatus || 'Không').trim(),
      hometown: (data.hometown || '').trim(),
      
      // Nơi thường trú
      permanentProvince: (data.permanentProvince || 'TP. Hà Nội').trim(),
      permanentWard: (data.permanentWard || 'Xã Yên Bài').trim(),
      permanentHamlet: (data.permanentHamlet || '').trim(),
      permanentHouseNumber: (data.permanentHouseNumber || '').trim(),
      permanentAddress: permanentAddress.trim(),
      
      // Nơi ở hiện tại
      currentProvince: (data.currentProvince || data.permanentProvince || 'TP. Hà Nội').trim(),
      currentWard: (data.currentWard || data.permanentWard || 'Xã Yên Bài').trim(),
      currentHamlet: (data.currentHamlet || data.permanentHamlet || '').trim(),
      currentHouseNumber: (data.currentHouseNumber || data.permanentHouseNumber || '').trim(),
      currentAddress: currentAddress.trim(),
      
      // 2. Số định danh cá nhân
      personalIdNumber: (data.personalIdNumber || '').trim(),
      targetGroup,
      
      // 3. Họ tên cha
      fatherName: (data.fatherName || '').trim(),
      fatherBirthYear: (data.fatherBirthYear || '').trim(),
      fatherIdCard: (data.fatherIdCard || '').trim(),
      fatherPhone: (data.fatherPhone || '').trim(),
      fatherJob: (data.fatherJob || '').trim(),
      
      // 4. Họ tên mẹ
      motherName: (data.motherName || '').trim(),
      motherBirthYear: (data.motherBirthYear || '').trim(),
      motherIdCard: (data.motherIdCard || '').trim(),
      motherPhone: (data.motherPhone || '').trim(),
      motherJob: (data.motherJob || '').trim(),
      
      // 5. Người giám hộ (nếu có)
      guardianName: (data.guardianName || '').trim(),
      guardianBirthYear: (data.guardianBirthYear || '').trim(),
      guardianPhone: (data.guardianPhone || '').trim(),
      guardianJob: (data.guardianJob || '').trim(),
      
      // 6. Số điện thoại liên hệ
      contactPhone: (data.contactPhone || data.motherPhone || data.fatherPhone || '').trim(),
      email: (data.email || '').trim(),
      
      parentCommitment: data.parentCommitment ?? true,
      
      birthCertificateFile: data.birthCertificateFile,
      vneidProofFile: data.vneidProofFile,
      additionalNotes: (data.additionalNotes || '').trim(),
    };

    applications.unshift(newApplication);
    saveDatabase();
    res.status(201).json({ success: true, application: newApplication });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra trong quá trình lưu hồ sơ tuyển sinh.' });
  }
});

// 6. Update application status & notes (School Admin)
app.patch('/api/admissions/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, statusNote } = req.body;

  const appIndex = applications.findIndex(a => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Không tìm thấy hồ sơ tuyển sinh' });
  }

  if (status) applications[appIndex].status = status;
  if (statusNote !== undefined) applications[appIndex].statusNote = statusNote;

  saveDatabase();
  res.json({ success: true, application: applications[appIndex] });
});

// 7. Delete application (School Admin)
app.delete('/api/admissions/:id', (req, res) => {
  const { id } = req.params;
  const beforeCount = applications.length;
  applications = applications.filter(a => a.id !== id);

  if (applications.length === beforeCount) {
    return res.status(404).json({ error: 'Không tìm thấy hồ sơ để xóa' });
  }

  saveDatabase();
  res.json({ success: true, message: 'Đã xóa hồ sơ thành công' });
});

// 8. Contact messages
app.get('/api/contacts', (req, res) => {
  res.json(contactMessages);
});

app.post('/api/contacts', (req, res) => {
  const { senderName, phone, email, subject, content } = req.body;
  if (!senderName || !phone || !content) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ tên, số điện thoại và nội dung liên hệ.' });
  }

  const newMsg: ContactMessage = {
    id: `MSG-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    senderName: senderName.trim(),
    phone: phone.trim(),
    email: (email || '').trim(),
    subject: (subject || 'Ý kiến & Thắc mắc tuyển sinh mầm non').trim(),
    content: content.trim(),
    isRead: false,
  };

  contactMessages.unshift(newMsg);
  saveDatabase();
  res.status(201).json({ success: true, message: newMsg });
});

app.patch('/api/contacts/:id/read', (req, res) => {
  const { id } = req.params;
  const msg = contactMessages.find(m => m.id === id);
  if (!msg) return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });

  msg.isRead = true;
  if (req.body.replyNote) msg.replyNote = req.body.replyNote;
  saveDatabase();
  res.json({ success: true, message: msg });
});

// 9. AI Preschool Admissions Assistant (Gemini 3.7 Flash)
app.post('/api/ai-chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Vui lòng gửi câu hỏi cần trợ lý AI giải đáp.' });
  }

  const ai = getGeminiClient();

  const systemInstruction = `Bạn là "Trợ Lý Ảo Tuyển Sinh Mầm Non Thông Minh" (AI Preschool Admissions Assistant) của Trường Mầm Non Yên Bài / Hệ Thống Tuyển Sinh Mầm Non Trực Tuyến.
Nhiệm vụ của bạn là tư vấn, giải đáp 24/7 một cách thân thiện, chuẩn mực, ân cần, chính xác và chuyên nghiệp cho quý phụ huynh về:
1. Quy trình và thủ tục tuyển sinh mầm non trực tuyến (các bước khai phiếu tuyển sinh, chuẩn bị hồ sơ).
2. Quy định độ tuổi vào các khối lớp:
   - Nhà trẻ (18 - 24 tháng): Trẻ sinh năm 2025
   - Nhà trẻ (24 - 36 tháng): Trẻ sinh năm 2024
   - Mẫu giáo bé (3 - 4 tuổi): Trẻ sinh năm 2023
   - Mẫu giáo nhỡ (4 - 5 tuổi): Trẻ sinh năm 2022
   - Mẫu giáo lớn (5 - 6 tuổi, phổ cập mầm non 5 tuổi): Trẻ sinh năm 2021
3. Giấy tờ cần đính kèm theo quy định mới:
   - Bản chụp/scan Giấy khai sinh hợp lệ của trẻ
   - Thông tin nơi cư trú/thường trú từ ứng dụng VNeID (VNeID mức độ 2 hoặc Giấy xác nhận thông tin về cư trú CT07)
   - Số định danh cá nhân 12 chữ số của trẻ (tra cứu trên VNeID hoặc giấy khai sinh bản mới)
   - Căn cước công dân của cha mẹ
4. Chế độ chăm sóc nuôi dưỡng, bán trú, thực đơn dinh dưỡng chuẩn VietGAP, đội ngũ giáo viên sư phạm mầm non có chứng chỉ, cơ sở vật chất, an toàn vệ sinh thực phẩm.
5. Học phí và các khoản thu thỏa thuận theo quy định của Sở Giáo dục & Đào tạo, chính sách miễn giảm học phí cho con em diện chính sách, hộ nghèo.

Địa chỉ trường: Số 164, thôn Bài, xã Yên Bài, TP. Hà Nội. Hotline: 097 8237887. Email: mnyenbai-bv@hanoiedu.vn.
Hãy trả lời bằng tiếng Việt lịch sự, định dạng Markdown rõ ràng (sử dụng gạch đầu dòng, in đậm các ý chính), ngắn gọn và ấm áp như một cô giáo mầm non mến trẻ.`;

  if (!ai) {
    // Fallback response if GEMINI_API_KEY is not yet attached
    const fallbackAnswer = generateSmartFallbackReply(message);
    return res.json({ reply: fallbackAnswer });
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { sender: string; text: string }) => ({
          role: h.sender === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        }))
      : [];

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const reply = response.text || 'Xin chào quý phụ huynh! Tôi đã nhận được câu hỏi. Quý phụ huynh vui lòng kiểm tra lại kết nối hoặc gửi lại câu hỏi để tôi hỗ trợ chu đáo nhất.';
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    // Graceful fallback
    const fallbackAnswer = generateSmartFallbackReply(message);
    res.json({ reply: fallbackAnswer });
  }
});

function generateSmartFallbackReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('vneid') || q.includes('cư trú') || q.includes('hộ khẩu')) {
    return `**Về việc đính kèm minh chứng nơi thường trú trên VNeID:**\n\n- Quý phụ huynh đăng nhập vào ứng dụng **VNeID mức độ 2** trên điện thoại.\n- Chọn mục **Ví giấy tờ** -> Chọn **Thông tin cư trú** (hoặc Thông tin thành viên trong hộ gia đình).\n- Chụp ảnh màn hình rõ nét hiển thị đầy đủ thông tin nơi thường trú của bé và cha mẹ, sau đó tải lên ở **Bước 2** của Phiếu đăng ký nhập học.\n- Nếu chưa kích hoạt VNeID mức 2, phụ huynh có thể tải ảnh chụp Giấy xác nhận thông tin về cư trú (mẫu CT07) do Công an xã/phường cấp.`;
  }
  if (q.includes('tuổi') || q.includes('độ tuổi') || q.includes('sinh năm')) {
    return `**Quy định độ tuổi tuyển sinh năm học 2026 - 2027:**\n\n- **Nhà trẻ (18 - 24 tháng):** Trẻ sinh năm 2025\n- **Nhà trẻ (24 - 36 tháng):** Trẻ sinh năm 2024\n- **Mẫu giáo Bé (3 - 4 tuổi):** Trẻ sinh năm 2023\n- **Mẫu giáo Nhỡ (4 - 5 tuổi):** Trẻ sinh năm 2022\n- **Mẫu giáo Lớn (5 - 6 tuổi):** Trẻ sinh năm 2021 (Ưu tiên tiếp nhận 100% trẻ 5 tuổi trên địa bàn).`;
  }
  if (q.includes('hồ sơ') || q.includes('giấy tờ') || q.includes('khai sinh')) {
    return `**Hồ sơ đăng ký nhập học cho con gồm có:**\n\n1. **Phiếu đăng ký nhập học trực tuyến** (Khai đầy đủ thông tin của trẻ và cha mẹ trên cổng tuyển sinh).\n2. **Bản sao/Ảnh chụp Giấy khai sinh** hợp lệ của trẻ.\n3. **Minh chứng nơi thường trú:** Ảnh chụp màn hình thông tin cư trú trên ứng dụng **VNeID** hoặc Giấy xác nhận CT07.\n4. Số định danh cá nhân 12 chữ số của trẻ (có ghi trên giấy khai sinh mẫu mới hoặc tra cứu trên VNeID).`;
  }
  if (q.includes('học phí') || q.includes('tiền') || q.includes('bán trú') || q.includes('chi phí')) {
    return `**Thông tin học phí và chế độ bán trú mầm non:**\n\n- **Học phí:** Thực hiện theo Nghị quyết của HĐND và quy định của Sở GD&ĐT đối với trường mầm non công lập (miễn giảm 100% học phí cho trẻ 5 tuổi và các diện chính sách theo Nghị định 81/CP).\n- **Tiền ăn bán trú:** Gồm bữa chính trưa + bữa phụ chiều được tính toán khoa học, đảm bảo đủ calo và dinh dưỡng theo tháp dinh dưỡng Viện Dinh Dưỡng Quốc Gia.\n- **Nguồn thực phẩm:** 100% ký hợp đồng với đơn vị cung ứng uy tín đạt chuẩn VietGAP, lưu nghiệm thức ăn 24h nghiêm ngặt.`;
  }
  return `Chào quý phụ huynh! Trợ lý ảo AI Tuyển sinh mầm non rất vui được hỗ trợ quý phụ huynh.\n\nQuý phụ huynh có thể bấm vào mục **"Dành cho phụ huynh"** trên thanh menu để bắt đầu điền **Phiếu đăng ký nhập học trực tuyến cho con**, hoặc gửi câu hỏi chi tiết về độ tuổi, thủ tục VNeID, hồ sơ nhập học để được tư vấn tức thì!`;
}

// ==================== VITE MIDDLEWARE / SPA ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hệ thống Tuyển sinh Mầm non đang chạy trên http://0.0.0.0:${PORT}`);
  });
}

startServer();
