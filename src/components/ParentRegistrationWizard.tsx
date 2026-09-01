import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  CreditCard, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Info, 
  AlertCircle, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Eye, 
  Trash2,
  Lock,
  Heart,
  Bot,
  FileSearch,
  Home as HomeIcon,
  HelpCircle
} from 'lucide-react';
import type { AdmissionApplication, AgeGroup } from '../types';
import { AGE_GROUP_LABELS, ETHNICITY_LIST, SCHOOL_INFO } from '../data/schoolInfo';
import chibiTeacherImg from '../assets/images/chibi_teacher_welcoming_kids_1788181324686.jpg';

interface ParentRegistrationWizardProps {
  onSuccessRegistration?: (app: AdmissionApplication) => void;
  onSuccessSubmission?: (app: AdmissionApplication) => void;
  onNavigateToLookup?: () => void;
  onAskAI?: () => void;
}

const POLICY_CATEGORIES = [
  'Không có',
  'Con thương binh, liệt sĩ',
  'Con bệnh binh, người có công',
  'Hộ nghèo',
  'Hộ cận nghèo',
  'Dân tộc thiểu số',
  'Con cán bộ, giáo viên, nhân viên',
  'Khác (kèm giấy xác nhận)'
];

export const ParentRegistrationWizard: React.FC<ParentRegistrationWizardProps> = ({
  onSuccessRegistration,
  onSuccessSubmission,
  onNavigateToLookup,
  onAskAI,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [createdApp, setCreatedApp] = useState<AdmissionApplication | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Full Form Data according to PDF Registration Form
  const [formData, setFormData] = useState({
    // 1. Thông tin học sinh
    studentName: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    ethnicity: 'Kinh',
    birthDate: '',
    birthPlace: 'Hà Nội',
    detailedBirthPlace: '',
    policyCategory: 'Không có',
    disabilityStatus: 'Không',
    disabilityDetail: '',
    hometown: 'Xã Yên Bài, Hà Nội',

    // Nơi thường trú
    permanentProvince: 'Hà Nội',
    permanentWard: 'Xã Yên Bài',
    permanentHamlet: 'Thôn Bài',
    permanentHouseNumber: '',
    permanentAddress: '',

    // Nơi ở hiện tại
    currentProvince: 'Hà Nội',
    currentWard: 'Xã Yên Bài',
    currentHamlet: 'Thôn Bài',
    currentHouseNumber: '',
    currentAddress: '',

    // 2. Số định danh cá nhân & Khối lớp
    personalIdNumber: '',
    targetGroup: 'kindergarten_3_4' as AgeGroup,

    // 3. Thông tin Cha
    fatherName: '',
    fatherBirthYear: '',
    fatherIdCard: '',
    fatherPhone: '',
    fatherJob: '',

    // 4. Thông tin Mẹ
    motherName: '',
    motherBirthYear: '',
    motherIdCard: '',
    motherPhone: '',
    motherJob: '',

    // 5. Thông tin Người giám hộ (nếu có)
    guardianName: '',
    guardianBirthYear: '',
    guardianPhone: '',
    guardianJob: '',

    // 6. Thông tin liên hệ
    contactPhone: '',
    email: '',

    // Cam kết phụ huynh
    parentCommitment: true,

    // Tệp đính kèm
    birthCertificateFile: undefined as { name: string; type: string; size: number; url: string } | undefined,
    vneidProofFile: undefined as { name: string; type: string; size: number; url: string } | undefined,

    // Ghi chú thêm
    additionalNotes: '',
  });

  // Calculate age group recommendation automatically based on birth date
  const handleBirthDateChange = (val: string) => {
    let newTargetGroup = formData.targetGroup;
    if (val) {
      const birthYear = new Date(val).getFullYear();
      if (birthYear === 2025) newTargetGroup = 'nursery_18_24';
      else if (birthYear === 2024) newTargetGroup = 'nursery_25_36';
      else if (birthYear === 2023) newTargetGroup = 'kindergarten_3_4';
      else if (birthYear === 2022) newTargetGroup = 'kindergarten_4_5';
      else if (birthYear === 2021) newTargetGroup = 'kindergarten_5_6';
    }

    setFormData(prev => ({
      ...prev,
      birthDate: val,
      targetGroup: newTargetGroup,
    }));
  };

  // Copy Permanent Address to Current Address
  const handleCopyPermanentToCurrent = () => {
    setFormData(prev => ({
      ...prev,
      currentProvince: prev.permanentProvince,
      currentWard: prev.permanentWard,
      currentHamlet: prev.permanentHamlet,
      currentHouseNumber: prev.permanentHouseNumber,
    }));
  };

  // Sample data filler helper
  const handleFillSample = () => {
    setFormData({
      studentName: 'NGUYỄN MINH ANH',
      gender: 'Nữ',
      ethnicity: 'Kinh',
      birthDate: '2023-08-15',
      birthPlace: 'Hà Nội',
      detailedBirthPlace: 'Bệnh viện Đa khoa Huyện Ba Vì, Hà Nội',
      policyCategory: 'Không có',
      disabilityStatus: 'Không',
      disabilityDetail: '',
      hometown: 'Thôn Bài, Xã Yên Bài, TP. Hà Nội',

      permanentProvince: 'Hà Nội',
      permanentWard: 'Xã Yên Bài',
      permanentHamlet: 'Thôn Bài',
      permanentHouseNumber: 'Số 68',
      permanentAddress: 'Số 68, Thôn Bài, Xã Yên Bài, TP. Hà Nội',

      currentProvince: 'Hà Nội',
      currentWard: 'Xã Yên Bài',
      currentHamlet: 'Thôn Bài',
      currentHouseNumber: 'Số 68',
      currentAddress: 'Số 68, Thôn Bài, Xã Yên Bài, TP. Hà Nội',

      personalIdNumber: '001223018899',
      targetGroup: 'kindergarten_3_4',

      fatherName: 'Nguyễn Văn Hùng',
      fatherBirthYear: '1990',
      fatherIdCard: '001090001234',
      fatherPhone: '0978237887',
      fatherJob: 'Kỹ sư nông nghiệp',

      motherName: 'Trần Thị Mai',
      motherBirthYear: '1993',
      motherIdCard: '001193005678',
      motherPhone: '0987654321',
      motherJob: 'Giáo viên',

      guardianName: '',
      guardianBirthYear: '',
      guardianPhone: '',
      guardianJob: '',

      contactPhone: '0978237887',
      email: 'phuhuynh.yenbai@gmail.com',

      parentCommitment: true,

      birthCertificateFile: {
        name: 'giay_khai_sinh_minh_anh.jpg',
        type: 'image/jpeg',
        size: 380000,
        url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      },
      vneidProofFile: {
        name: 'vneid_cu_tru_yen_bai.jpg',
        type: 'image/jpeg',
        size: 410000,
        url: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80',
      },

      additionalNotes: 'Bé khỏe mạnh, hòa đồng, tự lập trong giờ ăn và sinh hoạt cá nhân.',
    });
    setValidationErrors({});
  };

  // Validate Step 1
  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    // 1. Học sinh
    if (!formData.studentName.trim()) errors.studentName = 'Vui lòng nhập họ và tên của trẻ';
    if (!formData.birthDate) errors.birthDate = 'Vui lòng chọn ngày sinh của trẻ';
    if (!formData.birthPlace.trim()) errors.birthPlace = 'Vui lòng nhập nơi sinh (Tỉnh/TP)';
    if (!formData.detailedBirthPlace.trim()) errors.detailedBirthPlace = 'Vui lòng nhập nơi sinh chi tiết (Bệnh viện/Trạm y tế)';
    if (!formData.hometown.trim()) errors.hometown = 'Vui lòng nhập quê quán';

    // Thường trú
    if (!formData.permanentProvince.trim()) errors.permanentProvince = 'Vui lòng nhập Tỉnh/Thành phố thường trú';
    if (!formData.permanentWard.trim()) errors.permanentWard = 'Vui lòng nhập Xã/Phường thường trú';
    if (!formData.permanentHamlet.trim()) errors.permanentHamlet = 'Vui lòng nhập Thôn/Tổ thường trú';

    // Nơi ở hiện nay
    if (!formData.currentProvince.trim()) errors.currentProvince = 'Vui lòng nhập Tỉnh/Thành phố nơi ở hiện tại';
    if (!formData.currentWard.trim()) errors.currentWard = 'Vui lòng nhập Xã/Phường nơi ở hiện tại';
    if (!formData.currentHamlet.trim()) errors.currentHamlet = 'Vui lòng nhập Thôn/Tổ nơi ở hiện tại';

    // 2. Số định danh cá nhân
    if (!formData.personalIdNumber.trim()) {
      errors.personalIdNumber = 'Vui lòng nhập số định danh cá nhân 12 số của trẻ';
    } else if (formData.personalIdNumber.length !== 12 || !/^\d+$/.test(formData.personalIdNumber)) {
      errors.personalIdNumber = 'Số định danh cá nhân phải đủ 12 chữ số';
    }

    // 3 & 4. Thông tin Cha/Mẹ
    if (!formData.motherName.trim() && !formData.fatherName.trim()) {
      errors.motherName = 'Vui lòng điền thông tin của ít nhất Cha hoặc Mẹ';
    }

    if (formData.fatherPhone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.fatherPhone.replace(/\s/g, ''))) {
      errors.fatherPhone = 'Số điện thoại của Cha không hợp lệ (10 chữ số)';
    }

    if (formData.motherPhone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.motherPhone.replace(/\s/g, ''))) {
      errors.motherPhone = 'Số điện thoại của Mẹ không hợp lệ (10 chữ số)';
    }

    // 6. Số điện thoại liên hệ
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = 'Vui lòng nhập số điện thoại liên hệ chính';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
      errors.contactPhone = 'Số điện thoại liên hệ không hợp lệ (10 chữ số)';
    }

    // Cam kết
    if (!formData.parentCommitment) {
      errors.parentCommitment = 'Phụ huynh vui lòng tích chọn cam kết tính chính xác của thông tin.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstErrorKey = Object.keys(validationErrors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(`field-${firstErrorKey}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle File Upload to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'birthCertificate' | 'vneid') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng tệp tải lên tối đa là 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: reader.result as string,
      };

      if (target === 'birthCertificate') {
        setFormData(prev => ({ ...prev, birthCertificateFile: fileData }));
      } else {
        setFormData(prev => ({ ...prev, vneidProofFile: fileData }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit form to backend
  const handleSubmitApplication = async () => {
    if (!formData.parentCommitment) {
      alert('Vui lòng tích chọn cam kết tính chính xác của các thông tin đã khai.');
      return;
    }

    // Compose formatted full addresses
    const formattedPermanent = [formData.permanentHouseNumber, formData.permanentHamlet, formData.permanentWard, formData.permanentProvince]
      .filter(Boolean)
      .join(', ');

    const formattedCurrent = [formData.currentHouseNumber, formData.currentHamlet, formData.currentWard, formData.currentProvince]
      .filter(Boolean)
      .join(', ');

    const payload = {
      ...formData,
      permanentAddress: formattedPermanent || formData.permanentAddress,
      currentAddress: formattedCurrent || formData.currentAddress,
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedApp(data.application);
        
        // Cache application to local storage for quick access in lookup tab
        try {
          const rawSaved = localStorage.getItem('yenbai_saved_admissions');
          const savedList = rawSaved ? JSON.parse(rawSaved) : [];
          const updated = [data.application, ...savedList.filter((x: any) => x.id !== data.application.id)].slice(0, 15);
          localStorage.setItem('yenbai_saved_admissions', JSON.stringify(updated));
        } catch (e) {
          console.warn('Cannot write to localStorage:', e);
        }

        if (onSuccessRegistration) onSuccessRegistration(data.application);
        if (onSuccessSubmission) onSuccessSubmission(data.application);
        setStep(3);

        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      } else {
        alert(data.error || 'Có lỗi xảy ra khi nộp hồ sơ. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ tuyển sinh. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Wizard Header Banner with Chibi Teacher & Mountains */}
      <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-200/50 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Chibi Teacher Avatar/Banner Thumbnail */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/80 shadow-lg bg-white/10 shrink-0">
              <img 
                src={chibiTeacherImg} 
                alt="Cô giáo đón các bé tại Trường Mầm non Yên Bài" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {SCHOOL_INFO.schoolName} - Năm học 2026 - 2027
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Đăng Ký Tuyển Sinh Mầm Non
              </h2>
              <p className="text-rose-100 text-xs sm:text-sm mt-1 max-w-xl">
                Phụ huynh vui lòng điền đầy đủ và chính xác thông tin của học sinh và cha mẹ theo mẫu quy chuẩn của Sở GD&ĐT Hà Nội.
              </p>
            </div>
          </div>

          {step === 1 && (
            <button
              id="fill-sample-data-btn"
              type="button"
              onClick={handleFillSample}
              className="self-start md:self-center px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Điền mẫu thử nghiệm nhanh</span>
            </button>
          )}
        </div>

        {/* Step Indicator Bar */}
        <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-3 gap-2 sm:gap-4">
          <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${step >= 1 ? 'bg-white/20 backdrop-blur-sm' : 'opacity-60'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-white text-rose-600' : 'bg-white/30 text-white'}`}>
              1
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Bước 1</div>
              <div className="text-[11px] text-rose-100 truncate">Thông tin Đăng ký tuyển sinh</div>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${step >= 2 ? 'bg-white/20 backdrop-blur-sm' : 'opacity-60'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-white text-rose-600' : 'bg-white/30 text-white'}`}>
              2
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Bước 2</div>
              <div className="text-[11px] text-rose-100 truncate">Đính kèm Khai Sinh & VNeID</div>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${step >= 3 ? 'bg-white/20 backdrop-blur-sm' : 'opacity-60'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-white text-rose-600' : 'bg-white/30 text-white'}`}>
              3
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">Bước 3</div>
              <div className="text-[11px] text-rose-100 truncate">Tiếp nhận & Xuất phiếu</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== STEP 1: FORM ĐĂNG KÝ TUYỂN SINH ===================== */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-8 animate-in fade-in duration-200">
          
          {/* ================= 1. THÔNG TIN HỌC SINH ================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">1. Họ tên học sinh</h3>
                <p className="text-xs text-slate-500">Thông tin cơ bản của trẻ theo Giấy khai sinh và Cơ sở dữ liệu Quốc gia về dân cư</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Họ và tên */}
              <div id="field-studentName" className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Họ và tên của trẻ <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-student-name"
                  type="text"
                  required
                  placeholder="VÍ DỤ: NGUYỄN MINH ANH"
                  value={formData.studentName}
                  onChange={e => setFormData({ ...formData, studentName: e.target.value.toUpperCase() })}
                  className={`w-full px-4 py-3 rounded-xl border font-bold text-slate-800 focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.studentName 
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/30' 
                      : 'border-slate-200 focus:border-rose-500 focus:ring-rose-200'
                  }`}
                />
                {validationErrors.studentName && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.studentName}
                  </p>
                )}
              </div>

              {/* Giới tính */}
              <div id="field-gender">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giới tính <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="btn-gender-male"
                    onClick={() => setFormData({ ...formData, gender: 'Nam' })}
                    className={`py-3 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-1.5 ${
                      formData.gender === 'Nam'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    👦 Nam
                  </button>
                  <button
                    type="button"
                    id="btn-gender-female"
                    onClick={() => setFormData({ ...formData, gender: 'Nữ' })}
                    className={`py-3 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-1.5 ${
                      formData.gender === 'Nữ'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    👧 Nữ
                  </button>
                </div>
              </div>

              {/* Dân tộc */}
              <div id="field-ethnicity">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dân tộc <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-ethnicity"
                  value={formData.ethnicity}
                  onChange={e => setFormData({ ...formData, ethnicity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all bg-white"
                >
                  {ETHNICITY_LIST.map(eth => (
                    <option key={eth} value={eth}>{eth}</option>
                  ))}
                </select>
              </div>

              {/* Ngày sinh */}
              <div id="field-birthDate" className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-birth-date"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={e => handleBirthDateChange(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border font-medium text-slate-800 focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.birthDate 
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/30' 
                      : 'border-slate-200 focus:border-rose-500 focus:ring-rose-200'
                  }`}
                />
                {validationErrors.birthDate && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.birthDate}
                  </p>
                )}
              </div>

              {/* Nơi sinh (Tỉnh/Thành phố) */}
              <div id="field-birthPlace" className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nơi sinh (Tỉnh/Thành phố) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-birth-place"
                  type="text"
                  required
                  placeholder="Ví dụ: TP. Hà Nội"
                  value={formData.birthPlace}
                  onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </div>

              {/* Nơi sinh chi tiết */}
              <div id="field-detailedBirthPlace" className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nơi sinh chi tiết <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-detailed-birth-place"
                  type="text"
                  required
                  placeholder="Ví dụ: Bệnh viện Phụ Sản Hà Nội / Trạm Y tế xã Yên Bài"
                  value={formData.detailedBirthPlace}
                  onChange={e => setFormData({ ...formData, detailedBirthPlace: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border font-medium text-slate-800 focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.detailedBirthPlace 
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/30' 
                      : 'border-slate-200 focus:border-rose-500 focus:ring-rose-200'
                  }`}
                />
                {validationErrors.detailedBirthPlace && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.detailedBirthPlace}
                  </p>
                )}
              </div>

              {/* Đối tượng chính sách */}
              <div id="field-policyCategory" className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Đối tượng chính sách
                </label>
                <select
                  id="select-policy-category"
                  value={formData.policyCategory}
                  onChange={e => setFormData({ ...formData, policyCategory: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all bg-white"
                >
                  {POLICY_CATEGORIES.map(pol => (
                    <option key={pol} value={pol}>{pol}</option>
                  ))}
                </select>
              </div>

              {/* Học sinh khuyết tật */}
              <div id="field-disabilityStatus" className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Học sinh khuyết tật
                </label>
                <div className="flex items-center gap-4 py-2.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="disability"
                      value="Không"
                      checked={formData.disabilityStatus === 'Không'}
                      onChange={() => setFormData({ ...formData, disabilityStatus: 'Không', disabilityDetail: '' })}
                      className="text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Không</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="disability"
                      value="Có"
                      checked={formData.disabilityStatus === 'Có'}
                      onChange={() => setFormData({ ...formData, disabilityStatus: 'Có' })}
                      className="text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Có</span>
                  </label>

                  {formData.disabilityStatus === 'Có' && (
                    <input
                      type="text"
                      placeholder="Ghi rõ loại khuyết tật nếu có..."
                      value={formData.disabilityDetail}
                      onChange={e => setFormData({ ...formData, disabilityDetail: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-medium"
                    />
                  )}
                </div>
              </div>

              {/* Quê quán */}
              <div id="field-hometown" className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quê quán <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-hometown"
                  type="text"
                  required
                  placeholder="Ví dụ: Xã Yên Bài, Huyện Ba Vì, TP. Hà Nội"
                  value={formData.hometown}
                  onChange={e => setFormData({ ...formData, hometown: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border font-medium text-slate-800 focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.hometown 
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/30' 
                      : 'border-slate-200 focus:border-rose-500 focus:ring-rose-200'
                  }`}
                />
                {validationErrors.hometown && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.hometown}
                  </p>
                )}
              </div>

              {/* Nơi thường trú (4 trường con) */}
              <div className="md:col-span-4 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 mt-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Nơi thường trú:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Tỉnh/Thành phố <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Hà Nội"
                      value={formData.permanentProvince}
                      onChange={e => setFormData({ ...formData, permanentProvince: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Xã (Phường) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Xã Yên Bài"
                      value={formData.permanentWard}
                      onChange={e => setFormData({ ...formData, permanentWard: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Thôn (Tổ) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Thôn Bài"
                      value={formData.permanentHamlet}
                      onChange={e => setFormData({ ...formData, permanentHamlet: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Số nhà</label>
                    <input
                      type="text"
                      placeholder="Số 164"
                      value={formData.permanentHouseNumber}
                      onChange={e => setFormData({ ...formData, permanentHouseNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Nơi ở hiện tại (4 trường con) */}
              <div className="md:col-span-4 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <HomeIcon className="w-4 h-4 text-amber-600" />
                    <span>Nơi ở hiện tại:</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyPermanentToCurrent}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-xs hover:bg-rose-50 transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Giống nơi thường trú</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Tỉnh/Thành phố <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Hà Nội"
                      value={formData.currentProvince}
                      onChange={e => setFormData({ ...formData, currentProvince: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Xã (Phường) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Xã Yên Bài"
                      value={formData.currentWard}
                      onChange={e => setFormData({ ...formData, currentWard: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Thôn (Tổ) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Thôn Bài"
                      value={formData.currentHamlet}
                      onChange={e => setFormData({ ...formData, currentHamlet: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Số nhà</label>
                    <input
                      type="text"
                      placeholder="Số 164"
                      value={formData.currentHouseNumber}
                      onChange={e => setFormData({ ...formData, currentHouseNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ================= 2. SỐ ĐỊNH DANH CÁ NHÂN & KHỐI LỚP ================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">2. Số định danh cá nhân học sinh & Khối lớp</h3>
                <p className="text-xs text-slate-500">Mã định danh 12 số trên Giấy khai sinh hoặc ứng dụng VNeID và phân lớp dự tuyển</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Số định danh cá nhân 12 số */}
              <div id="field-personalIdNumber">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số định danh cá nhân của trẻ (12 chữ số) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-personal-id"
                    type="text"
                    required
                    maxLength={12}
                    placeholder="Nhập đủ 12 số định danh cá nhân"
                    value={formData.personalIdNumber}
                    onChange={e => setFormData({ ...formData, personalIdNumber: e.target.value.replace(/\D/g, '') })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 tracking-widest transition-all ${
                      validationErrors.personalIdNumber 
                        ? 'border-rose-300 ring-rose-200 bg-rose-50/30' 
                        : 'border-slate-200 focus:border-rose-500 focus:ring-rose-200'
                    }`}
                  />
                  <CreditCard className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  💡 Tra cứu trên Giấy khai sinh mẫu mới (mục Số định danh) hoặc trên VNeID mục Thông tin cư trú của cha/mẹ.
                </p>
                {validationErrors.personalIdNumber && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.personalIdNumber}
                  </p>
                )}
              </div>

              {/* Khối lớp / Độ tuổi */}
              <div id="field-targetGroup">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Khối lớp đăng ký dự tuyển <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-target-group"
                  value={formData.targetGroup}
                  onChange={e => setFormData({ ...formData, targetGroup: e.target.value as AgeGroup })}
                  className="w-full px-4 py-3 rounded-xl border border-rose-200 font-bold text-rose-700 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all bg-rose-50/60"
                >
                  {Object.entries(AGE_GROUP_LABELS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label} — {item.birthYearDesc}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* ================= 3. THÔNG TIN CHA ================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                👨
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">3. Họ tên cha</h3>
                <p className="text-xs text-slate-500">Thông tin lý lịch, căn cước công dân và liên lạc của cha</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Họ tên cha</label>
                <input
                  id="input-father-name"
                  type="text"
                  placeholder="Họ và tên của cha"
                  value={formData.fatherName}
                  onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Năm sinh</label>
                <input
                  id="input-father-birth-year"
                  type="text"
                  maxLength={4}
                  placeholder="Ví dụ: 1990"
                  value={formData.fatherBirthYear}
                  onChange={e => setFormData({ ...formData, fatherBirthYear: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số CCCD</label>
                <input
                  id="input-father-id-card"
                  type="text"
                  maxLength={12}
                  placeholder="12 số CCCD gắn chip"
                  value={formData.fatherIdCard}
                  onChange={e => setFormData({ ...formData, fatherIdCard: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-medium text-slate-800"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
                <input
                  id="input-father-phone"
                  type="tel"
                  placeholder="Ví dụ: 0978237887"
                  value={formData.fatherPhone}
                  onChange={e => setFormData({ ...formData, fatherPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nghề nghiệp</label>
                <input
                  id="input-father-job"
                  type="text"
                  placeholder="Nghề nghiệp của cha"
                  value={formData.fatherJob}
                  onChange={e => setFormData({ ...formData, fatherJob: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* ================= 4. THÔNG TIN MẸ ================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                👩
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">4. Họ tên mẹ</h3>
                <p className="text-xs text-slate-500">Thông tin lý lịch, căn cước công dân và liên lạc của mẹ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Họ tên mẹ</label>
                <input
                  id="input-mother-name"
                  type="text"
                  placeholder="Họ và tên của mẹ"
                  value={formData.motherName}
                  onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Năm sinh</label>
                <input
                  id="input-mother-birth-year"
                  type="text"
                  maxLength={4}
                  placeholder="Ví dụ: 1993"
                  value={formData.motherBirthYear}
                  onChange={e => setFormData({ ...formData, motherBirthYear: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số CCCD</label>
                <input
                  id="input-mother-id-card"
                  type="text"
                  maxLength={12}
                  placeholder="12 số CCCD gắn chip"
                  value={formData.motherIdCard}
                  onChange={e => setFormData({ ...formData, motherIdCard: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-medium text-slate-800"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
                <input
                  id="input-mother-phone"
                  type="tel"
                  placeholder="Ví dụ: 0987654321"
                  value={formData.motherPhone}
                  onChange={e => setFormData({ ...formData, motherPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nghề nghiệp</label>
                <input
                  id="input-mother-job"
                  type="text"
                  placeholder="Nghề nghiệp của mẹ"
                  value={formData.motherJob}
                  onChange={e => setFormData({ ...formData, motherJob: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* ================= 5. THÔNG TIN NGƯỜI GIÁM HỘ (NẾU CÓ) ================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                🤝
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">5. Họ tên người giám hộ (nếu có)</h3>
                <p className="text-xs text-slate-500">Áp dụng trong trường hợp trẻ ở với người giám hộ hợp pháp khác</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Họ tên người giám hộ</label>
                <input
                  id="input-guardian-name"
                  type="text"
                  placeholder="Họ tên người giám hộ"
                  value={formData.guardianName}
                  onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Năm sinh</label>
                <input
                  id="input-guardian-birth-year"
                  type="text"
                  maxLength={4}
                  placeholder="Ví dụ: 1985"
                  value={formData.guardianBirthYear}
                  onChange={e => setFormData({ ...formData, guardianBirthYear: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
                <input
                  id="input-guardian-phone"
                  type="tel"
                  placeholder="Số điện thoại"
                  value={formData.guardianPhone}
                  onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nghề nghiệp</label>
                <input
                  id="input-guardian-job"
                  type="text"
                  placeholder="Nghề nghiệp"
                  value={formData.guardianJob}
                  onChange={e => setFormData({ ...formData, guardianJob: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* ================= 6. THÔNG TIN LIÊN HỆ & CAM KẾT ================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">6. Thông tin liên hệ & Cam kết của Phụ huynh</h3>
                <p className="text-xs text-slate-500">Số điện thoại nhận thông báo trúng tuyển và cam kết pháp lý</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div id="field-contactPhone">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại liên hệ chính <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-contact-phone"
                  type="tel"
                  required
                  placeholder="Ví dụ: 0978237887"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border font-bold text-slate-800 focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.contactPhone 
                      ? 'border-rose-300 ring-rose-200 bg-rose-50/30' 
                      : 'border-slate-200 focus:border-rose-500 focus:ring-rose-200'
                  }`}
                />
                {validationErrors.contactPhone && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.contactPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email nhận thông báo (tùy chọn)
                </label>
                <input
                  id="input-contact-email"
                  type="email"
                  placeholder="Ví dụ: phuhuynh@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ghi chú thêm về sức khỏe / thói quen của bé (nếu có)
                </label>
                <input
                  id="input-additional-notes"
                  type="text"
                  placeholder="Dị ứng thực phẩm, năng khiếu, lưu ý chăm sóc đặc biệt..."
                  value={formData.additionalNotes}
                  onChange={e => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Phụ huynh học sinh cam kết */}
            <div id="field-parentCommitment" className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  id="checkbox-parent-commitment"
                  type="checkbox"
                  checked={formData.parentCommitment}
                  onChange={e => setFormData({ ...formData, parentCommitment: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-rose-300"
                />
                <div className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                  <strong className="text-rose-700">Cam kết của Phụ huynh học sinh: </strong>
                  Phụ huynh học sinh cam kết những thông tin của học sinh là đúng sự thật; nếu không đúng phụ huynh học sinh hoàn toàn chịu trách nhiệm về kết quả của học sinh.
                </div>
              </label>
              {validationErrors.parentCommitment && (
                <p className="text-xs text-rose-600 mt-2 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.parentCommitment}
                </p>
              )}
            </div>

          </div>

          {/* Action Button: Go to Step 2 */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Các trường có dấu sao là bắt buộc theo mẫu tuyển sinh của Sở GD&ĐT.
            </div>
            <button
              id="btn-goto-step-2"
              type="button"
              onClick={handleNextStep}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Tiếp Tục Sang Bước 2 (Đính Kèm Giấy Tờ VNeID)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* ===================== STEP 2: ĐÍNH KÈM GIẤY KHAI SINH & VNEID ===================== */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Đính Kèm Giấy Khai Sinh & Minh Chứng Cư Trú VNeID
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nộp ảnh chụp hoặc bản scan điện tử hỗ trợ Hội đồng tuyển sinh thẩm định hồ sơ nhanh chóng
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 1. Giấy khai sinh */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-2">
                    <FileText className="w-4 h-4" />
                    <span>1. Ảnh chụp / Scan Giấy khai sinh của trẻ</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Chụp rõ nét đầy đủ 4 góc, rõ thông tin họ tên, ngày sinh, số định danh cá nhân và nơi sinh.
                  </p>

                  {formData.birthCertificateFile ? (
                    <div className="bg-white rounded-xl p-4 border border-rose-200 relative group mb-4">
                      <div className="h-44 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                        {formData.birthCertificateFile.type.startsWith('image/') ? (
                          <img
                            src={formData.birthCertificateFile.url}
                            alt="Giấy khai sinh"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-500">
                            <FileText className="w-10 h-10 text-rose-500" />
                            <span className="text-xs font-semibold">{formData.birthCertificateFile.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                          {formData.birthCertificateFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, birthCertificateFile: undefined }))}
                          className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 p-1 hover:bg-rose-50 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa ảnh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-rose-400 bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-rose-50/20 group">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Nhấp để tải lên ảnh Giấy khai sinh</span>
                      <span className="text-[11px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, PDF (Tối đa 10MB)</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={e => handleFileUpload(e, 'birthCertificate')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 2. Minh chứng cư trú VNeID */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>2. Ảnh chụp Thông tin cư trú trên ứng dụng VNeID</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Ảnh chụp màn hình mục &quot;Ví giấy tờ&quot; &rarr; &quot;Thông tin cư trú&quot; trên VNeID của bố hoặc mẹ (hoặc bản xác nhận cư trú CT07/CT08).
                  </p>

                  {formData.vneidProofFile ? (
                    <div className="bg-white rounded-xl p-4 border border-purple-200 relative group mb-4">
                      <div className="h-44 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                        {formData.vneidProofFile.type.startsWith('image/') ? (
                          <img
                            src={formData.vneidProofFile.url}
                            alt="Minh chứng cư trú VNeID"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-500">
                            <FileText className="w-10 h-10 text-purple-600" />
                            <span className="text-xs font-semibold">{formData.vneidProofFile.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                          {formData.vneidProofFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, vneidProofFile: undefined }))}
                          className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 p-1 hover:bg-rose-50 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa ảnh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-purple-400 bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-purple-50/20 group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Nhấp để tải ảnh Cư trú VNeID</span>
                      <span className="text-[11px] text-slate-400 mt-1">Hỗ trợ ảnh chụp màn hình VNeID mức 2</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={e => handleFileUpload(e, 'vneid')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

            </div>

            {/* Review Summary */}
            <div className="mt-8 p-5 bg-amber-50/60 rounded-2xl border border-amber-200">
              <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Xác nhận thông tin đăng ký dự tuyển:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                <div>• Học sinh: <strong className="text-slate-900">{formData.studentName}</strong></div>
                <div>• Ngày sinh: <strong>{formData.birthDate}</strong></div>
                <div>• Khối lớp: <strong className="text-rose-600">{AGE_GROUP_LABELS[formData.targetGroup]?.label}</strong></div>
                <div>• Mã định danh: <strong className="font-mono text-slate-900">{formData.personalIdNumber}</strong></div>
                <div className="sm:col-span-2">• Thường trú: <strong>{[formData.permanentHouseNumber, formData.permanentHamlet, formData.permanentWard, formData.permanentProvince].filter(Boolean).join(', ')}</strong></div>
                <div className="sm:col-span-2">• SĐT Liên hệ: <strong className="text-rose-600">{formData.contactPhone}</strong></div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              id="btn-back-to-step-1"
              type="button"
              onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Sửa Thông Tin</span>
            </button>

            <button
              id="btn-submit-application"
              type="button"
              disabled={submitting}
              onClick={handleSubmitApplication}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi hồ sơ tuyển sinh...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Xác Nhận Nộp Đơn Đăng Ký Tuyển Sinh</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* ===================== STEP 3: HOÀN TẤT & XUẤT PHIẾU ===================== */}
      {step === 3 && createdApp && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl text-center space-y-8 animate-in zoom-in-95 duration-200">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Tiếp Nhận Thành Công
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Hồ Sơ Đăng Ký Tuyển Sinh Đã Được Gửi!
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Hệ thống đã lưu thông tin đăng ký của cháu <strong>{createdApp.studentName}</strong> vào Hội đồng Tuyển sinh {SCHOOL_INFO.schoolName}.
            </p>
          </div>

          {/* Application Code Card */}
          <div className="max-w-md mx-auto bg-slate-50 border-2 border-dashed border-rose-300 rounded-2xl p-6 relative">
            <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
              Mã Hồ Sơ Tuyển Sinh Của Trẻ
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-rose-600 tracking-wider">
              {createdApp.id}
            </div>

            <button
              type="button"
              onClick={() => handleCopyId(createdApp.id)}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              {copiedId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã sao chép mã!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép mã hồ sơ</span>
                </>
              )}
            </button>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              id="btn-print-admission-form"
              type="button"
              onClick={() => {
                if (onSuccessRegistration) onSuccessRegistration(createdApp);
              }}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu Đăng Ký Nhập Học</span>
            </button>

            {onNavigateToLookup && (
              <button
                type="button"
                onClick={onNavigateToLookup}
                className="px-6 py-3.5 bg-white text-slate-700 hover:bg-slate-50 font-bold rounded-2xl border border-slate-200 shadow-xs transition-all flex items-center gap-2"
              >
                <FileSearch className="w-4 h-4 text-amber-600" />
                <span>Tra Cứu Trạng Thái Xét Duyệt</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setFormData({
                  studentName: '',
                  gender: 'Nam',
                  ethnicity: 'Kinh',
                  birthDate: '',
                  birthPlace: 'Hà Nội',
                  detailedBirthPlace: '',
                  policyCategory: 'Không có',
                  disabilityStatus: 'Không',
                  disabilityDetail: '',
                  hometown: 'Xã Yên Bài, Hà Nội',
                  permanentProvince: 'Hà Nội',
                  permanentWard: 'Xã Yên Bài',
                  permanentHamlet: 'Thôn Bài',
                  permanentHouseNumber: '',
                  permanentAddress: '',
                  currentProvince: 'Hà Nội',
                  currentWard: 'Xã Yên Bài',
                  currentHamlet: 'Thôn Bài',
                  currentHouseNumber: '',
                  currentAddress: '',
                  personalIdNumber: '',
                  targetGroup: 'kindergarten_3_4',
                  fatherName: '',
                  fatherBirthYear: '',
                  fatherIdCard: '',
                  fatherPhone: '',
                  fatherJob: '',
                  motherName: '',
                  motherBirthYear: '',
                  motherIdCard: '',
                  motherPhone: '',
                  motherJob: '',
                  guardianName: '',
                  guardianBirthYear: '',
                  guardianPhone: '',
                  guardianJob: '',
                  contactPhone: '',
                  email: '',
                  parentCommitment: true,
                  birthCertificateFile: undefined,
                  vneidProofFile: undefined,
                  additionalNotes: '',
                });
              }}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all"
            >
              Đăng ký cho học sinh khác
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
