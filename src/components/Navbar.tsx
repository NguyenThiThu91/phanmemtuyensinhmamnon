import React, { useState } from 'react';
import { 
  GraduationCap, 
  Home, 
  UserCheck, 
  PhoneCall, 
  Bot, 
  ShieldCheck, 
  Menu, 
  X, 
  FileSearch, 
  FileSpreadsheet,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolInfo';

interface NavbarProps {
  currentTab: 'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin';
  onSelectTab?: (tab: 'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin') => void;
  setCurrentTab?: (tab: 'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin') => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  setCurrentTab,
  isAdminLoggedIn,
  onAdminLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);

  const handleNav = (tab: 'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin') => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else if (setCurrentTab) {
      setCurrentTab(tab);
    }
    setMobileMenuOpen(false);
    setParentDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold text-[11px] tracking-wide uppercase">
              Thông Báo Tuyển Sinh 2026 - 2027
            </span>
            <span className="hidden sm:inline">
              Cổng tuyển sinh trực tuyến {SCHOOL_INFO.schoolName} chính thức tiếp nhận hồ sơ!
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>📞 Hotline: <strong>{SCHOOL_INFO.hotline}</strong></span>
            <span className="hidden md:inline">✉️ {SCHOOL_INFO.email}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Name */}
          <div 
            id="brand-logo-btn"
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-400 p-0.5 shadow-md shadow-rose-200 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  Tuyển Sinh Mầm Non
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  Trực tuyến
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight group-hover:text-rose-600 transition-colors whitespace-nowrap">
                {SCHOOL_INFO.schoolName}
              </h1>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-home-btn"
              onClick={() => handleNav('home')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-rose-50 text-rose-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>

            {/* Dropdown: Dành cho Phụ Huynh */}
            <div className="relative">
              <button
                id="nav-parents-dropdown-btn"
                onClick={() => setParentDropdownOpen(!parentDropdownOpen)}
                onMouseEnter={() => setParentDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'parent_register' || currentTab === 'lookup'
                    ? 'bg-rose-50 text-rose-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-rose-500" />
                <span>Dành Cho Phụ Huynh</span>
                <span className="text-xs ml-0.5">▾</span>
              </button>

              {parentDropdownOpen && (
                <div 
                  onMouseLeave={() => setParentDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <button
                    id="nav-register-btn"
                    onClick={() => handleNav('parent_register')}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 flex items-start gap-3 text-slate-700 hover:text-rose-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Đăng ký tuyển sinh</div>
                      <div className="text-xs text-slate-400">Phiếu tuyển sinh & đính kèm VNeID</div>
                    </div>
                  </button>

                  <button
                    id="nav-lookup-btn"
                    onClick={() => handleNav('lookup')}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 flex items-start gap-3 text-slate-700 hover:text-rose-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileSearch className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Tra cứu hồ sơ đã nộp</div>
                      <div className="text-xs text-slate-400">Kiểm tra kết quả xét duyệt</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Trợ lý ảo AI */}
            <button
              id="nav-ai-assistant-btn"
              onClick={() => handleNav('ai_assistant')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'ai_assistant'
                  ? 'bg-purple-50 text-purple-600 font-semibold shadow-xs ring-1 ring-purple-200'
                  : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50/50'
              }`}
            >
              <div className="relative">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </div>
              <span>Trợ Lý Ảo AI</span>
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                24/7
              </span>
            </button>

            {/* Liên hệ nhà trường */}
            <button
              id="nav-contact-btn"
              onClick={() => handleNav('contact')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'contact'
                  ? 'bg-rose-50 text-rose-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Liên Hệ</span>
            </button>

            {/* Quản trị nhà trường */}
            <button
              id="nav-admin-btn"
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'admin'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isAdminLoggedIn ? 'Bảng Quản Trị' : 'Quản Trị Nhà Trường'}</span>
            </button>
          </nav>

          {/* Quick Action Button for Parent */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              id="header-cta-register-btn"
              onClick={() => handleNav('parent_register')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Đăng Ký Tuyển Sinh</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-2 shadow-xl">
          <button
            id="mobile-nav-home"
            onClick={() => handleNav('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              currentTab === 'home' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5 text-rose-500" />
            <span>Trang chủ</span>
          </button>

          <div className="border-t border-slate-100 my-1 pt-1">
            <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dành cho phụ huynh
            </div>
            
            <button
              id="mobile-nav-register"
              onClick={() => handleNav('parent_register')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                currentTab === 'parent_register' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-5 h-5 text-rose-500" />
              <div className="text-left">
                <div>Đăng ký tuyển sinh</div>
                <div className="text-xs text-slate-400">Phiếu tuyển sinh & đính kèm VNeID</div>
              </div>
            </button>

            <button
              id="mobile-nav-lookup"
              onClick={() => handleNav('lookup')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                currentTab === 'lookup' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileSearch className="w-5 h-5 text-amber-500" />
              <span>Tra cứu kết quả hồ sơ</span>
            </button>
          </div>

          <button
            id="mobile-nav-ai"
            onClick={() => handleNav('ai_assistant')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              currentTab === 'ai_assistant' ? 'bg-purple-50 text-purple-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-5 h-5 text-purple-600" />
            <div className="flex items-center gap-2">
              <span>Trợ lý ảo AI tư vấn</span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">24/7</span>
            </div>
          </button>

          <button
            id="mobile-nav-contact"
            onClick={() => handleNav('contact')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              currentTab === 'contact' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PhoneCall className="w-5 h-5 text-rose-500" />
            <span>Liên hệ nhà trường & Hòm thư</span>
          </button>

          <button
            id="mobile-nav-admin"
            onClick={() => handleNav('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              currentTab === 'admin' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>{isAdminLoggedIn ? 'Bảng Quản Trị Nhà Trường' : 'Đăng nhập Quản Trị Viên'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
