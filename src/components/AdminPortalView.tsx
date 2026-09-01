import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Trash2, 
  Mail, 
  Eye, 
  Check, 
  Sparkles, 
  LogOut, 
  RefreshCw, 
  Phone, 
  MessageSquare,
  FileSpreadsheet,
  Home,
  ArrowLeft
} from 'lucide-react';
import type { AdmissionApplication, AdmissionStats, ApplicationStatus, AgeGroup, ContactMessage } from '../types';
import { AGE_GROUP_LABELS, SCHOOL_INFO } from '../data/schoolInfo';
import { exportApplicationsToExcel } from '../utils/excelExport';

interface AdminPortalViewProps {
  isAdminLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onPrintApplication: (app: AdmissionApplication) => void;
  onNavigate?: (tab: 'home' | 'parent_register' | 'lookup' | 'contact' | 'ai_assistant' | 'admin') => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  isAdminLoggedIn,
  onLogin,
  onLogout,
  onPrintApplication,
  onNavigate,
}) => {
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin view state
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'contacts' | 'stats'>('applications');
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<AdmissionStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Application for Detailed Modal
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('pending');
  const [editStatusNote, setEditStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, statsRes, contactRes] = await Promise.all([
        fetch(`/api/admissions?status=${statusFilter}&targetGroup=${groupFilter}&search=${encodeURIComponent(searchTerm)}`),
        fetch('/api/admissions/stats'),
        fetch('/api/contacts')
      ]);

      if (appRes.ok) setApplications(await appRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (contactRes.ok) setContacts(await contactRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchData();
    }
  }, [isAdminLoggedIn, statusFilter, groupFilter, searchTerm]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'admin' && password === '123456@') ||
      (username === 'admin' && password === 'admin')
    ) {
      onLogin();
      setLoginError('');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác. (Tên đăng nhập: admin / Mật khẩu: 123456@)');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('123456@');
    onLogin();
  };

  // Update Status
  const handleSaveStatus = async () => {
    if (!selectedApp) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admissions/${selectedApp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          statusNote: editStatusNote,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedApp(data.application);
        fetchData();
        alert('Đã cập nhật trạng thái hồ sơ thành công!');
      }
    } catch (err) {
      alert('Không thể lưu trạng thái. Vui lòng thử lại.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete Application
  const handleDeleteApp = async (id: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${id}? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedApp(null);
        fetchData();
      }
    } catch (err) {
      alert('Không thể xóa hồ sơ');
    }
  };

  // Export Full Styled Excel
  const handleExportFullExcel = () => {
    if (applications.length === 0) {
      alert('Không có dữ liệu hồ sơ để xuất.');
      return;
    }
    exportApplicationsToExcel(applications, `Danh_sach_tuyen_sinh_mam_non_${new Date().toISOString().slice(0, 10)}`);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Đã Trúng Tuyển</span>;
      case 'reviewing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Đang Thẩm Định</span>;
      case 'need_supplement':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Cần Bổ Sung</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Từ Chối</span>;
      case 'pending':
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">Chờ Tiếp Nhận</span>;
    }
  };

  // ----------------- LOGIN VIEW -----------------
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Đăng Nhập Quản Trị Nhà Trường
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dành riêng cho Ban Giám hiệu & Hội đồng Tuyển sinh {SCHOOL_INFO.schoolName}
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tài khoản quản trị
              </label>
              <input
                id="admin-username-input"
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mật khẩu
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                placeholder="123456@"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Đăng Nhập Quản Trị
            </button>
          </form>

          {/* Quick Demo Login Helper & Back to Home */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              id="admin-quick-demo-btn"
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Đăng nhập 1-chạm (admin / 123456@)</span>
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại Trang chủ tuyển sinh</span>
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ----------------- ADMIN DASHBOARD VIEW -----------------
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-0.5 rounded-full border border-amber-400/30">
              Quản Trị Nhà Trường
            </span>
            <span className="text-xs text-slate-400">Năm học 2026 - 2027</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Bảng Quản Lý Tuyển Sinh Mầm Non
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Xem danh sách học sinh đăng ký tuyển sinh, xét duyệt hồ sơ và kiểm tra giấy tờ VNeID.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {onNavigate && (
            <button
              id="admin-back-to-home-btn"
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
              title="Về giao diện Trang chủ"
            >
              <Home className="w-4 h-4 text-amber-300" />
              <span>Về Trang Chủ</span>
            </button>
          )}

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'applications'
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Hồ Sơ Đăng Ký Tuyển Sinh ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contacts')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'contacts'
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Hòm Thư Phụ Huynh ({contacts.length})</span>
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Tổng hồ sơ</div>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">{stats.total}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Chờ tiếp nhận</div>
            <div className="text-2xl font-extrabold text-slate-600 mt-1">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-blue-50/20 shadow-xs">
            <div className="text-xs text-blue-700 font-semibold">Đang thẩm định</div>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">{stats.reviewing}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-xs">
            <div className="text-xs text-emerald-700 font-semibold">Đã trúng tuyển</div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.approved}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/20 shadow-xs">
            <div className="text-xs text-amber-700 font-semibold">Cần bổ sung</div>
            <div className="text-2xl font-extrabold text-amber-700 mt-1">{stats.needSupplement}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-rose-200 bg-rose-50/20 shadow-xs">
            <div className="text-xs text-rose-700 font-semibold">Từ chối / Khác</div>
            <div className="text-2xl font-extrabold text-rose-700 mt-1">{stats.rejected}</div>
          </div>
        </div>
      )}

      {/* ======================= TAB 1: APPLICATIONS LIST ======================= */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          
          {/* Controls: Search, Filter, Export */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <input
                  id="admin-search-input"
                  type="text"
                  placeholder="Tìm tên, mã định danh, CCCD, SĐT..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Status Filter */}
              <select
                id="admin-status-filter"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ tiếp nhận</option>
                <option value="reviewing">Đang thẩm định</option>
                <option value="approved">Đã trúng tuyển</option>
                <option value="need_supplement">Cần bổ sung</option>
                <option value="rejected">Từ chối</option>
              </select>

              {/* Age Group Filter */}
              <select
                id="admin-group-filter"
                value={groupFilter}
                onChange={e => setGroupFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">Tất cả khối lớp</option>
                {Object.entries(AGE_GROUP_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            {/* Formatted Excel Export Button */}
            <button
              id="admin-export-excel-btn"
              onClick={handleExportFullExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs shrink-0 self-end md:self-auto hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Bảng Biểu Excel Đầy Đủ (.xls)</span>
            </button>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Mã hồ sơ</th>
                    <th className="py-3.5 px-4">Học sinh & Ngày sinh</th>
                    <th className="py-3.5 px-4">Khối lớp</th>
                    <th className="py-3.5 px-4">Mã định danh (12 số)</th>
                    <th className="py-3.5 px-4">Nơi thường trú</th>
                    <th className="py-3.5 px-4">Cha / Mẹ & SĐT</th>
                    <th className="py-3.5 px-4">Minh chứng</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        Chưa có hồ sơ đăng ký nào. Phụ huynh nộp hồ sơ ở mục &quot;Đăng ký tuyển sinh&quot; sẽ hiển thị tại đây.
                      </td>
                    </tr>
                  ) : (
                    applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {app.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{app.studentName}</div>
                          <div className="text-[11px] text-slate-500">
                            {app.birthDate} ({app.gender}) - DT: {app.ethnicity}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            {AGE_GROUP_LABELS[app.targetGroup]?.label || app.targetGroup}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {app.personalIdNumber}
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate" title={app.permanentAddress}>
                          {app.permanentAddress}
                        </td>
                        <td className="py-3 px-4">
                          {app.fatherName && <div>Cha: {app.fatherName} ({app.fatherPhone || '—'})</div>}
                          {app.motherName && <div className="text-[11px] text-slate-500">Mẹ: {app.motherName} ({app.motherPhone || '—'})</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {app.birthCertificateFile && (
                              <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold" title="Có giấy khai sinh">
                                Khai sinh
                              </span>
                            )}
                            {app.vneidProofFile && (
                              <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold" title="Có VNeID">
                                VNeID
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setEditStatus(app.status);
                                setEditStatusNote(app.statusNote || '');
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                              title="Xem & Xét duyệt"
                            >
                              <Eye className="w-3.5 h-3.5" /> Xem
                            </button>
                            <button
                              onClick={() => onPrintApplication(app)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                              title="In phiếu tuyển sinh"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================= TAB 2: CONTACT MESSAGES ======================= */}
      {activeSubTab === 'contacts' && (
        <div className="space-y-4">
          <div className="text-sm font-bold text-slate-800">
            Hòm thư & Ý kiến đóng góp của phụ huynh:
          </div>

          <div className="space-y-3">
            {contacts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                Chưa có thư liên hệ nào từ phụ huynh.
              </div>
            ) : (
              contacts.map(msg => (
                <div key={msg.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{msg.senderName}</span>
                      <span className="text-xs text-slate-500 ml-2">📞 {msg.phone}</span>
                      {msg.email && <span className="text-xs text-slate-500 ml-2">✉️ {msg.email}</span>}
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-rose-600">{msg.subject}</div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {msg.content}
                  </p>

                  {msg.replyNote && (
                    <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                      <strong>Phản hồi của trường:</strong> {msg.replyNote}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================= APPLICATION DETAIL & REVIEW MODAL ======================= */}
      {selectedApp && (
        <div 
          onClick={() => setSelectedApp(null)}
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                  {selectedApp.id}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedApp.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Information Sections */}
            <div className="space-y-4 text-xs text-slate-800">
              
              {/* 1. Học sinh */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
                <div className="font-bold text-rose-600 text-sm uppercase mb-2">1. Thông tin học sinh</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  <div>• Giới tính: <strong>{selectedApp.gender}</strong></div>
                  <div>• Ngày sinh: <strong>{selectedApp.birthDate}</strong></div>
                  <div>• Dân tộc: <strong>{selectedApp.ethnicity}</strong></div>
                  <div>• Nơi sinh: <strong>{selectedApp.birthPlace}</strong></div>
                  <div className="sm:col-span-2">• Nơi sinh chi tiết: <strong>{selectedApp.detailedBirthPlace}</strong></div>
                  <div>• Đối tượng chính sách: <strong>{selectedApp.policyCategory || 'Không có'}</strong></div>
                  <div>• Học sinh khuyết tật: <strong>{selectedApp.disabilityStatus || 'Không'} {selectedApp.disabilityDetail ? `(${selectedApp.disabilityDetail})` : ''}</strong></div>
                  <div className="sm:col-span-3">• Quê quán: <strong>{selectedApp.hometown}</strong></div>
                  <div className="sm:col-span-3">• Nơi thường trú: <strong>{selectedApp.permanentAddress}</strong></div>
                  <div className="sm:col-span-3">• Nơi ở hiện tại: <strong>{selectedApp.currentAddress}</strong></div>
                </div>
              </div>

              {/* 2. Định danh & Khối lớp */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
                <div className="font-bold text-indigo-700 text-sm uppercase mb-2">2. Định danh cá nhân & Khối lớp</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>• Số định danh cá nhân (12 số): <strong className="font-mono text-slate-900 text-sm font-bold">{selectedApp.personalIdNumber}</strong></div>
                  <div>• Khối lớp đăng ký: <strong className="text-rose-700 font-bold">{AGE_GROUP_LABELS[selectedApp.targetGroup]?.label}</strong></div>
                </div>
              </div>

              {/* 3 & 4. Cha, Mẹ & Giám hộ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cha */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-blue-700 text-sm uppercase">3. Họ tên cha</div>
                  <div>• Họ tên: <strong>{selectedApp.fatherName || 'Chưa cập nhật'}</strong></div>
                  <div>• Năm sinh: <strong>{selectedApp.fatherBirthYear || '—'}</strong></div>
                  <div>• Số CCCD: <strong className="font-mono">{selectedApp.fatherIdCard || '—'}</strong></div>
                  <div>• Số điện thoại: <strong>{selectedApp.fatherPhone || '—'}</strong></div>
                  <div>• Nghề nghiệp: <strong>{selectedApp.fatherJob || '—'}</strong></div>
                </div>

                {/* Mẹ */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-rose-700 text-sm uppercase">4. Họ tên mẹ</div>
                  <div>• Họ tên: <strong>{selectedApp.motherName || 'Chưa cập nhật'}</strong></div>
                  <div>• Năm sinh: <strong>{selectedApp.motherBirthYear || '—'}</strong></div>
                  <div>• Số CCCD: <strong className="font-mono">{selectedApp.motherIdCard || '—'}</strong></div>
                  <div>• Số điện thoại: <strong>{selectedApp.motherPhone || '—'}</strong></div>
                  <div>• Nghề nghiệp: <strong>{selectedApp.motherJob || '—'}</strong></div>
                </div>
              </div>

              {/* 5 & 6. Giám hộ, Liên hệ & Ghi chú */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                <div className="font-bold text-emerald-700 text-sm uppercase">6. Thông tin liên hệ & Giám hộ</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>• Số điện thoại liên hệ chính: <strong className="text-rose-600 text-sm">{selectedApp.contactPhone}</strong></div>
                  <div>• Email: <strong>{selectedApp.email || '—'}</strong></div>
                  {selectedApp.guardianName && (
                    <div className="sm:col-span-2">• Người giám hộ: <strong>{selectedApp.guardianName}</strong> (Năm sinh: {selectedApp.guardianBirthYear}, SĐT: {selectedApp.guardianPhone}, Nghề: {selectedApp.guardianJob})</div>
                  )}
                  {selectedApp.additionalNotes && (
                    <div className="sm:col-span-2">• Ghi chú gia đình: <em>{selectedApp.additionalNotes}</em></div>
                  )}
                </div>
              </div>

            </div>

            {/* Attached Proofs (Birth Certificate & VNeID) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800">
                📎 Tài liệu minh chứng đã tải lên:
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Birth cert */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                    <span>1. Giấy khai sinh của trẻ</span>
                    {selectedApp.birthCertificateFile?.url && (
                      <button
                        onClick={() => setPreviewImage(selectedApp.birthCertificateFile!.url)}
                        className="text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Phóng to
                      </button>
                    )}
                  </div>
                  {selectedApp.birthCertificateFile?.url ? (
                    <img
                      src={selectedApp.birthCertificateFile.url}
                      alt="Giấy khai sinh"
                      className="w-full h-44 object-contain bg-white rounded-xl border border-slate-200 cursor-pointer"
                      onClick={() => setPreviewImage(selectedApp.birthCertificateFile!.url)}
                    />
                  ) : (
                    <div className="h-32 flex items-center justify-center text-slate-400 text-xs bg-white rounded-xl">
                      Chưa có tệp đính kèm
                    </div>
                  )}
                </div>

                {/* VNeID cert */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-700">
                    <span>2. Minh chứng cư trú VNeID</span>
                    {selectedApp.vneidProofFile?.url && (
                      <button
                        onClick={() => setPreviewImage(selectedApp.vneidProofFile!.url)}
                        className="text-purple-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Phóng to
                      </button>
                    )}
                  </div>
                  {selectedApp.vneidProofFile?.url ? (
                    <img
                      src={selectedApp.vneidProofFile.url}
                      alt="Minh chứng cư trú VNeID"
                      className="w-full h-44 object-contain bg-white rounded-xl border border-slate-200 cursor-pointer"
                      onClick={() => setPreviewImage(selectedApp.vneidProofFile!.url)}
                    />
                  ) : (
                    <div className="h-32 flex items-center justify-center text-slate-400 text-xs bg-white rounded-xl">
                      Chưa có tệp đính kèm
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Review & Status Updater Controls */}
            <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                ⚖️ Quyết định xét duyệt của Ban Tuyển Sinh:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cập nhật trạng thái
                  </label>
                  <select
                    id="admin-modal-edit-status"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                  >
                    <option value="pending">Chờ tiếp nhận</option>
                    <option value="reviewing">Đang thẩm định hồ sơ</option>
                    <option value="approved">✅ Duyệt trúng tuyển / Nhập học</option>
                    <option value="need_supplement">⚠️ Yêu cầu bổ sung giấy tờ</option>
                    <option value="rejected">❌ Từ chối / Không đủ điều kiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ghi chú / Thông báo gửi phụ huynh
                  </label>
                  <input
                    id="admin-modal-edit-note"
                    type="text"
                    placeholder="Lý do bổ sung hoặc lời dặn nhập học..."
                    value={editStatusNote}
                    onChange={e => setEditStatusNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteApp(selectedApp.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Xóa hồ sơ này
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPrintApplication(selectedApp)}
                    className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-50"
                  >
                    <Printer className="w-4 h-4" />
                    <span>In Phiếu</span>
                  </button>

                  <button
                    id="admin-save-status-btn"
                    type="button"
                    disabled={updatingStatus}
                    onClick={handleSaveStatus}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu Cập Nhật</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-rose-600 text-white rounded-full font-bold flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
            <img src={previewImage} alt="Document" className="max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

    </div>
  );
};
