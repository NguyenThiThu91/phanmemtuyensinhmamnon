import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolInfo';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    phone: '',
    email: '',
    subject: '',
    content: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName.trim() || !formData.phone.trim() || !formData.content.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung cần liên hệ.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setFormData({
          senderName: '',
          phone: '',
          email: '',
          subject: '',
          content: '',
        });
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Có lỗi xảy ra khi gửi thư liên hệ.');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-amber-200">
            Thông Tin Liên Hệ & Hòm Thư Điện Tử
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
            Liên Hệ Ban Tuyển Sinh Nhà Trường
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Mọi ý kiến đóng góp, thắc mắc về hồ sơ tuyển sinh, chỉ tiêu, tuyến tuyển sinh hoặc chế độ chăm sóc mầm non, quý phụ huynh có thể liên hệ trực tiếp qua số điện thoại hoặc gửi thư điện tử bên dưới.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Official School Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-rose-600" />
              <span>{SCHOOL_INFO.schoolName}</span>
            </h3>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Số điện thoại Hotline</div>
                <a href={`tel:${SCHOOL_INFO.hotline}`} className="text-base font-extrabold text-rose-600 hover:underline">
                  {SCHOOL_INFO.hotline}
                </a>
                <div className="text-xs text-slate-500 mt-0.5">
                  Di động: <strong>{SCHOOL_INFO.hotlineAlt}</strong>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Hòm thư điện tử (Email)</div>
                <a href={`mailto:${SCHOOL_INFO.email}`} className="text-sm font-bold text-slate-800 hover:text-rose-600 break-all">
                  {SCHOOL_INFO.email}
                </a>
                <div className="text-xs text-slate-400 mt-0.5">
                  Tiếp nhận phản hồi 24/7
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Địa chỉ trường</div>
                <div className="text-xs font-semibold text-slate-800 leading-snug">
                  {SCHOOL_INFO.address}
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Thời gian làm việc</div>
                <div className="text-xs text-slate-700 leading-snug">
                  {SCHOOL_INFO.workingHours}
                </div>
              </div>
            </div>

            {/* Leadership */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div>• <strong>Hiệu trưởng:</strong> {SCHOOL_INFO.principal}</div>
              <div>• <strong>Phụ trách tuyển sinh:</strong> {SCHOOL_INFO.admissionLead}</div>
            </div>

          </div>

        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                Hòm Thư Điện Tử Trực Tuyến
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Gửi Thư Ý Kiến & Thắc Mắc Đến Nhà Trường
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ban Giám hiệu sẽ phản hồi sớm nhất qua số điện thoại hoặc email quý phụ huynh cung cấp.
              </p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-3 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base">Thư Của Quý Phụ Huynh Đã Được Gửi!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Ban Tuyển sinh Trường Mầm Non Hoa Sen đã tiếp nhận nội dung và sẽ liên hệ hỗ trợ quý phụ huynh trong thời gian sớm nhất.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccessMsg(false)}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-all"
                >
                  Gửi thư khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Họ và tên phụ huynh <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-sender-name"
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn Minh"
                      value={formData.senderName}
                      onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="Ví dụ: 0987123456"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Hòm thư điện tử (Email)
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="phuhuynh@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Chủ đề liên hệ
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="Hỏi về độ tuổi / Thủ tục VNeID..."
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nội dung thắc mắc / Ý kiến đóng góp <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-content"
                    rows={4}
                    required
                    placeholder="Quý phụ huynh vui lòng nêu chi tiết nội dung cần nhà trường giải đáp..."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                  ></textarea>
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Thư Đến Ban Giám Hiệu</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
