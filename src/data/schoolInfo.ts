import type { SchoolContactInfo } from '../types';

export const SCHOOL_INFO: SchoolContactInfo = {
  schoolName: 'TRƯỜNG MẦM NON YÊN BÀI',
  address: 'Số 164, thôn Bài, xã Yên Bài, TP. Hà Nội',
  hotline: '097 8237887',
  hotlineAlt: '097 8237887 (Ban Tuyển Sinh)',
  email: 'mnyenbai-bv@hanoiedu.vn',
  workingHours: 'Thứ Hai - Thứ Sáu: 7h30 - 17h00 | Thứ Bảy: 8h00 - 11h30',
  principal: 'Ban Giám Hiệu Trường Mầm Non Yên Bài',
  admissionLead: 'Bộ phận Tiếp nhận & Phê duyệt Hồ sơ Tuyển sinh',
};

export const AGE_GROUP_LABELS: Record<string, { label: string; ageRange: string; birthYearDesc: string; quota: number }> = {
  nursery_18_24: {
    label: 'Nhà trẻ (18 - 24 tháng)',
    ageRange: '18 - 24 tháng tuổi',
    birthYearDesc: 'Trẻ sinh năm 2025',
    quota: 30,
  },
  nursery_25_36: {
    label: 'Nhà trẻ (24 - 36 tháng)',
    ageRange: '24 - 36 tháng tuổi',
    birthYearDesc: 'Trẻ sinh năm 2024',
    quota: 45,
  },
  kindergarten_3_4: {
    label: 'Mẫu giáo Bé (3 - 4 tuổi)',
    ageRange: '3 - 4 tuổi',
    birthYearDesc: 'Trẻ sinh năm 2023',
    quota: 70,
  },
  kindergarten_4_5: {
    label: 'Mẫu giáo Nhỡ (4 - 5 tuổi)',
    ageRange: '4 - 5 tuổi',
    birthYearDesc: 'Trẻ sinh năm 2022',
    quota: 80,
  },
  kindergarten_5_6: {
    label: 'Mẫu giáo Lớn (5 - 6 tuổi)',
    ageRange: '5 - 6 tuổi (Phổ cập MN)',
    birthYearDesc: 'Trẻ sinh năm 2021 (Ưu tiên 100% trẻ 5T)',
    quota: 90,
  },
};

export const ETHNICITY_LIST = [
  'Kinh',
  'Tày',
  'Thái',
  'Mường',
  'H\'Mông',
  'Dao',
  'Nùng',
  'Khơ-me',
  'Hoa',
  'Gia-rai',
  'Ê-đê',
  'Ba-na',
  'Sán Chay',
  'Cơ-ho',
  'Chăm',
  'Sán Dìu',
  'Hrê',
  'Mnông',
  'Ra-glai',
  'Xơ-đăng',
  'Khác',
];
