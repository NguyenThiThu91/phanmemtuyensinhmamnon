import React, { useState, useEffect } from 'react';
import { 
  FileSearch, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Printer, 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  ExternalLink,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  History
} from 'lucide-react';
import type { AdmissionApplication } from '../types';
import { AGE_GROUP_LABELS, SCHOOL_INFO } from '../data/schoolInfo';

interface ApplicationLookupViewProps {
  initialQuery?: string;
  onPrintApplication: (app: AdmissionApplication) => void;
  onAskAI: () => void;
}

export const ApplicationLookupView: React.FC<ApplicationLookupViewProps> = ({
  initialQuery = '',
  onPrintApplication,
  onAskAI,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AdmissionApplication[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [savedLocalApps, setSavedLocalApps] = useState<AdmissionApplication[]>([]);

  // Load recently saved applications from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('yenbai_saved_admissions');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedLocalApps(parsed);
        }
      }
    } catch (e) {
      console.warn('Cannot parse local saved admissions:', e);
    }
  }, []);

  const handleSearch = async (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : searchQuery).trim();
    if (!q) {
      setErrorMsg('Vui lòng nhập Mã hồ sơ, Mã định danh cá nhân 12 số của trẻ, hoặc Họ tên bé.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setResults(null);

    try {
      const res = await fetch(`/api/admissions/lookup/${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        const err = await res.json();
        // Check if there is a local fallback
        const localMatch = savedLocalApps.filter(a => 
          a.id.toLowerCase().includes(q.toLowerCase()) || 
          (a.personalIdNumber && a.personalIdNumber.includes(q)) ||
          (a.studentName && a.studentName.toLowerCase().includes(q.toLowerCase()))
        );

        if (localMatch.length > 0) {
          setResults(localMatch);
        } else {
          setErrorMsg(err.message || 'Không tìm thấy hồ sơ phù hợp với thông tin đã nhập.');
        }
      }
    } catch (err) {
      // Local fallback on network disconnect
      const localMatch = savedLocalApps.filter(a => 
        a.id.toLowerCase().includes(q.toLowerCase()) || 
        (a.personalIdNumber && a.personalIdNumber.includes(q)) ||
        (a.studentName && a.studentName.toLowerCase().includes(q.toLowerCase()))
      );

      if (localMatch.length > 0) {
        setResults(localMatch);
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ tuyển sinh. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getStatusBadge = (status: AdmissionApplication['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã Trúng Tuyển / Duyệt Nhập Học
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Đang Thẩm Định Hồ Sơ & Cư Trú
          </span>
        );
      case 'need_supplement':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Cần Bổ Sung Giấy Tờ / Ảnh VNeID
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Không Đủ Điều Kiện / Tuyến Khác
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Đã Tiếp Nhận - Đang Chờ Duyệt
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Cổng Tra Cứu Tuyển Sinh Trực Tuyến
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Tra Cứu Hồ Sơ Tuyển Sinh Mầm Non
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Phụ huynh có thể tra cứu bằng <strong>Mã hồ sơ (TSMN-2026-XXXX)</strong>, <strong>Mã định danh 12 số của trẻ</strong>, <strong>Họ tên bé</strong>, hoặc <strong>Số điện thoại liên hệ</strong>.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="lookup-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Nhập Mã hồ sơ, Mã định danh 12 số, Họ tên bé (vd: Lê Bảo An), hoặc SĐT..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400 shadow-md"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              id="lookup-submit-btn"
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FileSearch className="w-4 h-4" />
                  <span>Tra Cứu</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Instruction Note */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>💡 Gợi ý: Tra cứu nhanh theo bất kỳ thông tin nào bạn nhớ (Mã hồ sơ, Họ tên bé, CCCD hoặc SĐT).</span>
        </div>
      </div>

      {/* Recent submissions on this device */}
      {savedLocalApps.length > 0 && !results && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <History className="w-4 h-4 text-rose-500" />
            <span>Hồ sơ đã nộp gần đây trên thiết bị này:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedLocalApps.map(app => (
              <div 
                key={app.id} 
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-rose-300 transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      {app.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {app.studentName}
                  </div>
                  <div className="text-xs text-slate-500">
                    Mã định danh: <span className="font-mono">{app.personalIdNumber || '---'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery(app.id);
                    handleSearch(app.id);
                  }}
                  className="px-3.5 py-2 bg-white group-hover:bg-rose-600 group-hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 group-hover:border-rose-600 shadow-xs transition-all flex items-center gap-1 shrink-0"
                >
                  <span>Xem hồ sơ</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error / Not Found Message */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 animate-in fade-in duration-200">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h4 className="font-bold text-base">{errorMsg}</h4>
          <p className="text-xs text-rose-600 mt-1">
            Vui lòng kiểm tra lại tính chính xác hoặc liên hệ hotline nhà trường: <strong>{SCHOOL_INFO.hotline}</strong> để được hỗ trợ.
          </p>
        </div>
      )}

      {/* Results List */}
      {results && results.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-sm font-bold text-slate-700 flex items-center justify-between">
            <span>Tìm thấy {results.length} hồ sơ tuyển sinh phù hợp:</span>
            <button
              type="button"
              onClick={() => handleSearch(searchQuery)}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tải lại trạng thái</span>
            </button>
          </div>

          {results.map((app) => (
            <div 
              key={app.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6"
            >
              {/* Card Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                      {app.id}
                    </span>
                    <button
                      onClick={() => handleCopy(app.id)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Sao chép mã"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">
                    {app.studentName}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Ngày nộp hồ sơ: {new Date(app.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  {getStatusBadge(app.status)}
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
                    {AGE_GROUP_LABELS[app.targetGroup]?.label}
                  </span>
                </div>
              </div>

              {/* Status Note from School */}
              {app.statusNote && (
                <div className={`p-4 rounded-2xl text-xs sm:text-sm border flex items-start gap-3 ${
                  app.status === 'approved' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : app.status === 'need_supplement'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold mb-0.5">Thông báo từ Ban Tuyển Sinh:</div>
                    <div>{app.statusNote}</div>
                  </div>
                </div>
              )}

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/60 rounded-2xl p-5 border border-slate-100">
                
                {/* Student Info */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5 text-rose-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>Thông Tin Học Sinh</span>
                  </div>
                  <div>• Ngày sinh: <strong>{app.birthDate}</strong> (Giới tính: <strong>{app.gender}</strong>)</div>
                  <div>• Dân tộc: <strong>{app.ethnicity}</strong></div>
                  <div>• Mã định danh cá nhân: <strong className="font-mono text-slate-800">{app.personalIdNumber}</strong></div>
                  <div>• Nơi sinh: <strong>{app.birthPlace}</strong> {app.detailedBirthPlace && `(${app.detailedBirthPlace})`}</div>
                  <div>• Quê quán: <strong>{app.hometown || 'Chưa cập nhật'}</strong></div>
                  <div>• Nơi thường trú: <strong>{app.permanentAddress}</strong></div>
                  <div>• Chỗ ở hiện nay: <strong>{app.currentAddress}</strong></div>
                </div>

                {/* Parent Info */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5 text-amber-600 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Thông Tin Cha Mẹ & Liên Hệ</span>
                  </div>
                  <div>• Họ tên cha: <strong>{app.fatherName || 'Chưa cập nhật'}</strong> {app.fatherJob && `- Nghề nghiệp: ${app.fatherJob}`}</div>
                  <div>• SĐT Cha: <strong>{app.fatherPhone || '---'}</strong></div>
                  <div>• Họ tên mẹ: <strong>{app.motherName || 'Chưa cập nhật'}</strong> {app.motherBirthYear && `(${app.motherBirthYear})`} {app.motherJob && `- Nghề nghiệp: ${app.motherJob}`}</div>
                  <div>• SĐT Mẹ: <strong>{app.motherPhone || '---'}</strong></div>
                  <div>• CCCD của Mẹ: <strong className="font-mono">{app.motherIdCard || '---'}</strong></div>
                  <div>• SĐT liên hệ chính: <strong className="text-rose-600 font-bold">{app.contactPhone}</strong></div>
                  {app.additionalNotes && <div>• Ghi chú của phụ huynh: <em>{app.additionalNotes}</em></div>}
                </div>

              </div>

              {/* Attached documents preview */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-700 mb-3">
                  📎 Giấy tờ minh chứng đính kèm:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Birth Certificate */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-rose-500" />
                      <div>
                        <div className="font-bold text-slate-700">Giấy khai sinh</div>
                        <div className="text-[11px] text-slate-400">
                          {app.birthCertificateFile ? app.birthCertificateFile.name : 'Chưa đính kèm tệp'}
                        </div>
                      </div>
                    </div>
                    {app.birthCertificateFile?.url && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(app.birthCertificateFile!.url)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Xem ảnh
                      </button>
                    )}
                  </div>

                  {/* VNeID Proof */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-bold text-slate-700">Minh chứng cư trú VNeID</div>
                        <div className="text-[11px] text-slate-400">
                          {app.vneidProofFile ? app.vneidProofFile.name : 'Chưa đính kèm tệp'}
                        </div>
                      </div>
                    </div>
                    {app.vneidProofFile?.url && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(app.vneidProofFile!.url)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Xem ảnh
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onAskAI}
                  className="text-xs text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1.5 p-2 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>Hỏi Trợ lý AI về thủ tục bổ sung hồ sơ</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPrintApplication(app)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Phiếu Đăng Ký Tuyển Sinh</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-4 relative shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase">Xem Trước Tài Liệu Minh Chứng</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-2xl p-2">
              <img src={previewImage} alt="Preview" className="max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
