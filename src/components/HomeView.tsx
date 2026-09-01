import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  FileSearch, 
  Bot, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Heart, 
  Utensils, 
  Award, 
  Smile, 
  BookOpen,
  MapPin,
  ChevronRight,
  Search
} from 'lucide-react';
import { AGE_GROUP_LABELS, SCHOOL_INFO } from '../data/schoolInfo';
import type { AdmissionStats } from '../types';
import heroGraphicImg from '../assets/images/teacher_kids_clear_faces_1788184423326.jpg';

interface HomeViewProps {
  stats: AdmissionStats | null;
  onNavigate: (tab: 'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin') => void;
  onQuickLookup: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ stats, onNavigate, onQuickLookup }) => {
  const [quickQuery, setQuickQuery] = useState('');

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      onQuickLookup(quickQuery.trim());
      onNavigate('lookup');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section: Crystal Clear Layout displaying the Teacher, Kids, Modern 2-story School & Actions */}
      <section className="bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 rounded-3xl shadow-2xl p-4 sm:p-7 lg:p-9 text-white relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          
          {/* Left Column: Heading, Info & Quick Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            
            {/* Year Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-amber-200 border border-white/25 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="whitespace-nowrap">Năm học 2026 - 2027</span>
            </div>

            {/* School Name on Single Line */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                Cổng Tuyển Sinh Mầm Non
              </h1>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-200 drop-shadow-sm whitespace-nowrap">
                {SCHOOL_INFO.schoolName}
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-rose-50 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
              Hệ thống đăng ký trực tuyến chính thức của nhà trường ({SCHOOL_INFO.address}). Tạo điều kiện thuận tiện, minh bạch và nhanh chóng nhất cho phụ huynh.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <button
                id="hero-register-btn"
                onClick={() => onNavigate('parent_register')}
                className="px-5 sm:px-6 py-3 bg-white text-rose-600 hover:bg-amber-50 font-extrabold rounded-2xl shadow-lg shadow-rose-950/20 transition-all flex items-center gap-2 text-xs sm:text-sm hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                <span>Đăng Ký Tuyển Sinh Cho Con</span>
              </button>

              <button
                id="hero-lookup-btn"
                onClick={() => onNavigate('lookup')}
                className="px-4 sm:px-5 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap"
              >
                <FileSearch className="w-4 h-4" />
                <span>Tra Cứu Hồ Sơ</span>
              </button>

              <button
                id="hero-ai-chat-btn"
                onClick={() => onNavigate('ai_assistant')}
                className="px-3.5 sm:px-4 py-3 bg-purple-950/40 hover:bg-purple-950/60 backdrop-blur-md border border-purple-300/40 text-amber-200 hover:text-white font-bold rounded-2xl transition-all flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>Hỏi AI 24/7</span>
              </button>
            </div>

            {/* Integrated Quick Lookup Card inside Left Column */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/30 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                <Search className="w-3.5 h-3.5" />
                <span>Tra Cứu Hồ Sơ Nhanh:</span>
              </div>

              <form onSubmit={handleLookupSubmit} className="flex gap-2">
                <input
                  id="home-quick-lookup-input"
                  type="text"
                  value={quickQuery}
                  onChange={e => setQuickQuery(e.target.value)}
                  placeholder="Mã hồ sơ, Mã định danh 12 số, hoặc Tên bé..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white text-slate-800 placeholder-slate-400 font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-300 shadow-inner"
                />
                <button
                  id="home-quick-lookup-submit"
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-1 shrink-0 hover:scale-105 active:scale-95"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  <span>Tìm</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: High-Quality Graphic Frame with 100% Unobstructed Faces of Teacher & Kids */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/70 bg-white group aspect-16/10 sm:aspect-16/10">
              <img 
                src={heroGraphicImg} 
                alt="Cô giáo mầm non nụ cười hiền hậu và các em bé trước ngôi trường 2 tầng hiện đại dưới chân núi Yên Bài" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Bottom Subtle Ribbon */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-3 sm:p-4 text-center">
                <span className="text-white text-[11px] sm:text-xs font-bold drop-shadow-md">
                  ✨ Chào đón các bé yêu đến với Trường Mầm non Yên Bài!
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Age Groups & Target Classes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Khối Lớp Tuyển Sinh 2026 - 2027
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
            Độ Tuổi & Năm Sinh Tuyển Sinh
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Phụ huynh đối chiếu năm sinh của trẻ để đăng ký đúng khối lớp tuyển sinh của nhà trường:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(AGE_GROUP_LABELS).map(([key, item]) => (
            <div 
              key={key}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                  {item.label}
                </div>
                <div className="text-base font-extrabold text-slate-800">
                  {item.ageRange}
                </div>
                <div className="mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-100">
                  {item.birthYearDesc}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('parent_register')}
                className="mt-4 w-full py-2 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
              >
                <span>Đăng ký lớp này</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Registration Process Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Quy Trình 4 Bước Đơn Giản
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
            Hướng Dẫn Phụ Huynh Đăng Ký Tuyển Sinh
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Chỉ mất khoảng 3 phút để hoàn thiện hồ sơ đăng ký nhập học trực tuyến cho con ngay tại nhà
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-rose-300 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-2">
              Khai Phiếu Nhập Học
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Điền họ tên, ngày sinh, nơi thường trú, số định danh cá nhân 12 số của trẻ và thông tin liên hệ của cha mẹ.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-purple-300 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-2">
              Đính Kèm VNeID & Khai Sinh
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tải ảnh chụp Giấy khai sinh và ảnh chụp màn hình thông tin nơi thường trú trên ứng dụng VNeID mức độ 2.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-emerald-300 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-2">
              Nhận Mã Hồ Sơ
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hệ thống cấp Mã hồ sơ tự động (TSMN-2026-XXXX). Phụ huynh có thể in phiếu đăng ký tuyển sinh trực tiếp.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative group hover:border-amber-300 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              4
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-2">
              Xét Duyệt & Nhập Học
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nhà trường đối chiếu dữ liệu, công bố kết quả trúng tuyển và hướng dẫn phụ huynh mang bé đến trường nhập học.
            </p>
          </div>

        </div>

        <div className="text-center mt-8">
          <button
            id="start-registration-process-btn"
            onClick={() => onNavigate('parent_register')}
            className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition-all inline-flex items-center gap-2 hover:scale-105"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Bắt Đầu Điền Phiếu Đăng Ký Tuyển Sinh Ngay</span>
          </button>
        </div>
      </section>

      {/* School Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Môi Trường Học Tập Lý Tưởng
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
            Tại Sao Ba Mẹ Yên Tâm Gửi Trẻ Tại Trường Mầm Non Yên Bài?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-2">Giáo Viên Yêu Trẻ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% giáo viên đạt chuẩn trình độ Đại học/Cao đẳng Sư phạm Mầm non, tận tâm, dịu dàng và giàu kinh nghiệm.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-2">Dinh Dưỡng Chuẩn VietGAP</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thực đơn phong phú thay đổi theo mùa, nguồn thực phẩm sạch truy xuất nguồn gốc, lưu nghiệm nghiêm ngặt 24h.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-2">Phát Triển Toàn Diện</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lồng ghép hoạt động Steam, làm quen tiếng Anh mầm non, múa hát, kỹ năng sống và phát triển thể chất.
            </p>
          </div>
        </div>
      </section>

      {/* School Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ban Giám Hiệu & Bộ Phận Tuyển Sinh</span>
            <h3 className="text-2xl font-bold">Cần Tư Vấn Trực Tiếp & Giải Đáp Thắc Mắc?</h3>
            <p className="text-slate-400 text-sm max-w-xl">
              Phụ huynh có thể liên hệ số điện thoại hotline hoặc gửi thư điện tử đến trường để được hỗ trợ thủ tục hồ sơ.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">📞 Hotline: <strong>{SCHOOL_INFO.hotline}</strong></span>
              <span className="flex items-center gap-1.5">✉️ Email: <strong>{SCHOOL_INFO.email}</strong></span>
              <span className="flex items-center gap-1.5">📍 Địa chỉ: <strong>{SCHOOL_INFO.address}</strong></span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all shrink-0 flex items-center gap-2 hover:scale-105"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Mục Liên Hệ & Gửi Thư</span>
          </button>
        </div>
      </section>

    </div>
  );
};
