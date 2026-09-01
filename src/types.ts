export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'need_supplement' | 'rejected';

export type AgeGroup = 'nursery_18_24' | 'nursery_25_36' | 'kindergarten_3_4' | 'kindergarten_4_5' | 'kindergarten_5_6';

export interface AdmissionApplication {
  id: string; // TSMN-2026-XXXX
  createdAt: string;
  status: ApplicationStatus;
  statusNote?: string;
  
  // 1. Thông tin học sinh
  studentName: string; // 1. Họ tên học sinh
  gender: 'Nam' | 'Nữ'; // Giới tính
  ethnicity: string; // Dân tộc
  birthDate: string; // Ngày sinh (YYYY-MM-DD)
  birthPlace: string; // Nơi sinh (Tỉnh/Thành phố)
  detailedBirthPlace: string; // Nơi sinh chi tiết (Bệnh viện / Trạm y tế / Thôn...)
  policyCategory?: string; // Đối tượng chính sách
  disabilityStatus?: string; // Học sinh khuyết tật (Không / Có)
  hometown: string; // Quê quán
  
  // Nơi thường trú
  permanentProvince: string; // + Tỉnh/Thành phố
  permanentWard: string; // + Xã (Phường)
  permanentHamlet: string; // + Thôn (Tổ)
  permanentHouseNumber: string; // + Số nhà
  permanentAddress: string; // Nơi thường trú đầy đủ
  
  // Nơi ở hiện tại
  currentProvince: string; // + Tỉnh/Thành phố
  currentWard: string; // + Xã (Phường)
  currentHamlet: string; // + Thôn (Tổ)
  currentHouseNumber: string; // + Số nhà
  currentAddress: string; // Nơi ở hiện tại đầy đủ
  
  // 2. Số định danh cá nhân học sinh
  personalIdNumber: string;
  
  // Phân lớp dự tuyển
  targetGroup: AgeGroup;
  
  // 3. Thông tin cha
  fatherName: string; // 3. Họ tên cha
  fatherBirthYear: string; // Năm sinh cha
  fatherIdCard: string; // Số CCCD cha
  fatherPhone: string; // Số điện thoại cha
  fatherJob: string; // Nghề nghiệp cha
  
  // 4. Thông tin mẹ
  motherName: string; // 4. Họ tên mẹ
  motherBirthYear: string; // Năm sinh mẹ
  motherIdCard: string; // Số CCCD mẹ
  motherPhone: string; // Số điện thoại mẹ
  motherJob: string; // Nghề nghiệp mẹ
  
  // 5. Thông tin người giám hộ (nếu có)
  guardianName?: string; // 5. Họ tên người giám hộ
  guardianBirthYear?: string; // Năm sinh
  guardianPhone?: string; // Số điện thoại
  guardianJob?: string; // Nghề nghiệp
  
  // 6. Thông tin liên hệ
  contactPhone: string; // 6. Số điện thoại liên hệ
  email?: string; // Email
  
  // Cam kết
  parentCommitment?: boolean; // Cam kết thông tin đúng sự thật
  
  // Tệp đính kèm (nếu có tải thêm)
  birthCertificateFile?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
  vneidProofFile?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
  
  additionalNotes?: string;
}

export interface SchoolContactInfo {
  schoolName: string;
  address: string;
  hotline: string;
  hotlineAlt: string;
  email: string;
  workingHours: string;
  principal: string;
  admissionLead: string;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  senderName: string;
  phone: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  replyNote?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AdmissionStats {
  total: number;
  pending: number;
  reviewing: number;
  approved: number;
  needSupplement: number;
  rejected: number;
  byGroup: Record<AgeGroup, { count: number; quota: number }>;
}
