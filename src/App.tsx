import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ParentRegistrationWizard } from './components/ParentRegistrationWizard';
import { ApplicationLookupView } from './components/ApplicationLookupView';
import { AdminPortalView } from './components/AdminPortalView';
import { ContactView } from './components/ContactView';
import { AIChatbotView } from './components/AIChatbotView';
import { PrintableAdmissionForm } from './components/PrintableAdmissionForm';
import { SCHOOL_INFO } from './data/schoolInfo';
import type { AdmissionApplication, AdmissionStats } from './types';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Bot, 
  GraduationCap, 
  ArrowUp,
  FileSearch,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [stats, setStats] = useState<AdmissionStats | null>(null);
  const [lookupInitialQuery, setLookupInitialQuery] = useState('');
  const [printingApplication, setPrintingApplication] = useState<AdmissionApplication | null>(null);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);

  // Fetch admission stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admissions/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentTab]);

  const handleNavigate = (tab: 'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickLookup = (query: string) => {
    setLookupInitialQuery(query);
    setCurrentTab('lookup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-700">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={() => setIsAdminLoggedIn(false)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            stats={stats}
            onNavigate={handleNavigate}
            onQuickLookup={handleQuickLookup}
          />
        )}

        {currentTab === 'parent_register' && (
          <ParentRegistrationWizard
            onSuccessRegistration={(app) => {
              fetchStats();
              setPrintingApplication(app);
            }}
            onAskAI={() => handleNavigate('ai_assistant')}
          />
        )}

        {currentTab === 'lookup' && (
          <ApplicationLookupView
            initialQuery={lookupInitialQuery}
            onPrintApplication={(app) => setPrintingApplication(app)}
            onAskAI={() => handleNavigate('ai_assistant')}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView />
        )}

        {currentTab === 'ai_assistant' && (
          <AIChatbotView
            onNavigateToRegister={() => handleNavigate('parent_register')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPortalView
            isAdminLoggedIn={isAdminLoggedIn}
            onLogin={() => setIsAdminLoggedIn(true)}
            onLogout={() => setIsAdminLoggedIn(false)}
            onPrintApplication={(app) => setPrintingApplication(app)}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Floating Quick Action Button for AI (when not in AI tab) */}
      {currentTab !== 'ai_assistant' && (
        <button
          id="floating-ai-button"
          onClick={() => handleNavigate('ai_assistant')}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-110 active:scale-95 group border-2 border-white/50 print:hidden"
          title="Hỏi Trợ lý ảo AI Tuyển sinh 24/7"
        >
          <Bot className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-xs font-extrabold pr-1">
            Trợ Lý AI Tuyển Sinh
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
        </button>
      )}

      {/* Print Document Modal */}
      {printingApplication && (
        <PrintableAdmissionForm
          application={printingApplication}
          onClose={() => setPrintingApplication(null)}
        />
      )}

      {/* Comprehensive Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: School Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base leading-tight whitespace-nowrap">
                    {SCHOOL_INFO.schoolName}
                  </div>
                  <div className="text-[11px] text-amber-400 font-semibold">
                    Cổng Tuyển Sinh Mầm Non Điện Tử
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống tuyển sinh trực tuyến chuẩn Bộ Giáo dục & Đào tạo, tích hợp định danh điện tử VNeID và cơ sở dữ liệu quốc gia về dân cư.
              </p>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảo mật thông tin định danh trẻ em 100%</span>
              </div>
            </div>

            {/* Col 2: Fast Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                Dành Cho Phụ Huynh
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => handleNavigate('parent_register')} className="hover:text-rose-400 transition-colors">
                    • Đăng ký nhập học cho con (2 bước)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('lookup')} className="hover:text-rose-400 transition-colors">
                    • Tra cứu hồ sơ tuyển sinh bằng Mã định danh
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('ai_assistant')} className="hover:text-rose-400 transition-colors">
                    • Trợ lý AI hướng dẫn VNeID & độ tuổi
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('contact')} className="hover:text-rose-400 transition-colors">
                    • Hòm thư góp ý & Liên hệ Ban Giám hiệu
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: School Contact details */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                Thông Tin Liên Hệ
              </div>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{SCHOOL_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                  <a href={`tel:${SCHOOL_INFO.hotline}`} className="hover:text-white font-bold">
                    Hotline: {SCHOOL_INFO.hotline}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                  <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-white">
                    {SCHOOL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Col 4: Admin Portal */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                Dành Cho Nhà Trường
              </div>
              <p className="text-xs text-slate-400">
                Ban Giám hiệu và Hội đồng tuyển sinh truy cập cổng quản trị để phê duyệt hồ sơ và xuất danh sách:
              </p>
              <button
                id="footer-admin-portal-btn"
                onClick={() => handleNavigate('admin')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isAdminLoggedIn ? 'Bảng Quản Trị Tuyển Sinh' : 'Đăng Nhập Quản Trị'}</span>
              </button>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 {SCHOOL_INFO.schoolName}. Phần mềm Tuyển sinh Mầm non Trực tuyến.
            </div>
            <div className="flex items-center gap-4">
              <span>Chuẩn hóa dữ liệu theo Đề án 06 / VNeID</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
