import React from 'react';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';
import type { AdmissionApplication } from '../types';
import { AGE_GROUP_LABELS, SCHOOL_INFO } from '../data/schoolInfo';

interface PrintableAdmissionFormProps {
  application: AdmissionApplication;
  onClose: () => void;
}

export const PrintableAdmissionForm: React.FC<PrintableAdmissionFormProps> = ({
  application,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
      
      {/* Control Bar (Hidden when printing) */}
      <div className="w-full max-w-3xl bg-slate-900 text-white rounded-2xl p-4 mb-4 flex items-center justify-between shadow-xl print:hidden">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Phiếu Đăng Ký Tuyển Sinh Điện Tử - {application.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu / Xuất PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Formal Paper Printable Sheet */}
      <div 
        id="printable-admission-sheet"
        className="w-full max-w-3xl bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-sm leading-relaxed"
      >
        
        {/* National Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="text-xs sm:text-sm font-bold tracking-wider uppercase">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          <div className="text-xs sm:text-sm font-bold underline decoration-1 underline-offset-4">
            Độc lập - Tự do - Hạnh phúc
          </div>
          <div className="text-slate-400 text-xs mt-1">-------------------o0o-------------------</div>
        </div>

        {/* School Name & Doc Title */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="text-xs uppercase font-bold text-slate-700">
            {SCHOOL_INFO.schoolName}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase text-slate-900 tracking-tight">
            ĐĂNG KÝ TUYỂN SINH MẦM NON
          </h1>
          <div className="text-xs italic text-slate-500">
            (Năm học 2026 - 2027)
          </div>
          <div className="inline-block border border-slate-300 px-3 py-1 rounded text-xs font-mono font-bold bg-slate-50 mt-1">
            Mã hồ sơ: {application.id}
          </div>
        </div>

        {/* Section 1: Thông tin học sinh */}
        <div className="space-y-2.5 mb-5 border-t border-slate-200 pt-3">
          <div className="font-bold text-xs uppercase text-rose-700">
            1. THÔNG TIN HỌC SINH
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="col-span-2">• Họ tên học sinh: <strong className="uppercase text-slate-900 font-bold">{application.studentName}</strong></div>
            <div>- Giới tính: <strong>{application.gender}</strong></div>
            <div>- Dân tộc: <strong>{application.ethnicity}</strong></div>
            <div>- Ngày sinh: <strong>{application.birthDate}</strong></div>
            <div>- Nơi sinh: <strong>{application.birthPlace}</strong></div>
            <div className="col-span-2">- Nơi sinh chi tiết: <strong>{application.detailedBirthPlace}</strong></div>
            <div>- Đối tượng chính sách: <strong>{application.policyCategory || 'Không có'}</strong></div>
            <div>- Học sinh khuyết tật: <strong>{application.disabilityStatus || 'Không'}</strong></div>
            <div className="col-span-2">- Quê quán: <strong>{application.hometown}</strong></div>
            
            <div className="col-span-2 mt-1">
              - <strong>Nơi thường trú:</strong>
              <div className="pl-4 grid grid-cols-2 gap-x-2">
                <span>+ Tỉnh/Thành phố: <strong>{application.permanentProvince || 'Hà Nội'}</strong></span>
                <span>+ Xã (Phường): <strong>{application.permanentWard || 'Xã Yên Bài'}</strong></span>
                <span>+ Thôn (Tổ): <strong>{application.permanentHamlet || 'Thôn Bài'}</strong></span>
                <span>+ Số nhà: <strong>{application.permanentHouseNumber || '—'}</strong></span>
              </div>
            </div>

            <div className="col-span-2 mt-1">
              - <strong>Nơi ở hiện tại:</strong>
              <div className="pl-4 grid grid-cols-2 gap-x-2">
                <span>+ Tỉnh/Thành phố: <strong>{application.currentProvince || 'Hà Nội'}</strong></span>
                <span>+ Xã (Phường): <strong>{application.currentWard || 'Xã Yên Bài'}</strong></span>
                <span>+ Thôn (Tổ): <strong>{application.currentHamlet || 'Thôn Bài'}</strong></span>
                <span>+ Số nhà: <strong>{application.currentHouseNumber || '—'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Số định danh cá nhân học sinh */}
        <div className="space-y-1.5 mb-5 border-t border-slate-200 pt-3">
          <div className="font-bold text-xs uppercase text-rose-700">
            2. SỐ ĐỊNH DANH CÁ NHÂN HỌC SINH & KHỐI LỚP DỰ TUYỂN
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>• Số định danh cá nhân: <strong className="font-mono text-slate-900 tracking-wider text-sm">{application.personalIdNumber}</strong></div>
            <div>• Khối lớp đăng ký: <strong className="text-rose-700">{AGE_GROUP_LABELS[application.targetGroup]?.label}</strong></div>
          </div>
        </div>

        {/* Section 3: Họ tên cha */}
        <div className="space-y-1.5 mb-5 border-t border-slate-200 pt-3">
          <div className="font-bold text-xs uppercase text-rose-700">
            3. HỌ TÊN CHA
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>• Họ tên cha: <strong>{application.fatherName || 'Không có'}</strong></div>
            <div>- Năm sinh: <strong>{application.fatherBirthYear || '—'}</strong></div>
            <div>- Số CCCD: <strong className="font-mono">{application.fatherIdCard || '—'}</strong></div>
            <div>- Số điện thoại: <strong>{application.fatherPhone || '—'}</strong></div>
            <div className="col-span-2">- Nghề nghiệp: <strong>{application.fatherJob || '—'}</strong></div>
          </div>
        </div>

        {/* Section 4: Họ tên mẹ */}
        <div className="space-y-1.5 mb-5 border-t border-slate-200 pt-3">
          <div className="font-bold text-xs uppercase text-rose-700">
            4. HỌ TÊN MẸ
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>• Họ tên mẹ: <strong className="text-slate-900">{application.motherName || 'Không có'}</strong></div>
            <div>- Năm sinh: <strong>{application.motherBirthYear || '—'}</strong></div>
            <div>- Số CCCD: <strong className="font-mono">{application.motherIdCard || '—'}</strong></div>
            <div>- Số điện thoại: <strong>{application.motherPhone || '—'}</strong></div>
            <div className="col-span-2">- Nghề nghiệp: <strong>{application.motherJob || '—'}</strong></div>
          </div>
        </div>

        {/* Section 5: Người giám hộ (nếu có) */}
        {application.guardianName && (
          <div className="space-y-1.5 mb-5 border-t border-slate-200 pt-3">
            <div className="font-bold text-xs uppercase text-rose-700">
              5. HỌ TÊN NGƯỜI GIÁM HỘ (NẾU CÓ)
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>• Họ tên người giám hộ: <strong>{application.guardianName}</strong></div>
              <div>- Năm sinh: <strong>{application.guardianBirthYear || '—'}</strong></div>
              <div>- Số điện thoại: <strong>{application.guardianPhone || '—'}</strong></div>
              <div>- Nghề nghiệp: <strong>{application.guardianJob || '—'}</strong></div>
            </div>
          </div>
        )}

        {/* Section 6: Thông tin liên hệ & Cam kết */}
        <div className="space-y-2 mb-6 border-t border-slate-200 pt-3">
          <div className="font-bold text-xs uppercase text-rose-700">
            6. THÔNG TIN LIÊN HỆ
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>• Số điện thoại liên hệ: <strong className="text-rose-600 text-sm">{application.contactPhone}</strong></div>
            <div>• Email: <strong>{application.email || '—'}</strong></div>
            {application.additionalNotes && (
              <div className="col-span-2">• Ghi chú gia đình: <em>{application.additionalNotes}</em></div>
            )}
          </div>
        </div>

        {/* Phụ huynh học sinh cam kết */}
        <div className="text-xs italic text-slate-700 mb-6 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
          <strong>Phụ huynh học sinh cam kết:</strong> Phụ huynh học sinh cam kết những thông tin của học sinh là đúng sự thật; nếu không đúng phụ huynh học sinh hoàn toàn chịu trách nhiệm về kết quả của học sinh.
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs pt-2">
          <div className="space-y-14">
            <div>
              <div className="font-bold uppercase">CÁN BỘ TIẾP NHẬN HỒ SƠ</div>
              <div className="text-[11px] text-slate-500 italic">(Ký và ghi rõ họ tên)</div>
            </div>
            <div className="font-bold text-slate-400">....................................................</div>
          </div>

          <div className="space-y-14">
            <div>
              <div className="italic text-slate-500 mb-1">
                Hà Nội, Ngày {new Date(application.createdAt).getDate()} tháng {new Date(application.createdAt).getMonth() + 1} năm {new Date(application.createdAt).getFullYear()}
              </div>
              <div className="font-bold uppercase">NGƯỜI LÀM ĐƠN (CHA / MẸ)</div>
              <div className="text-[11px] text-slate-500 italic">(Ký và ghi rõ họ tên)</div>
            </div>
            <div className="font-bold text-slate-900">{application.motherName || application.fatherName || 'Phụ huynh học sinh'}</div>
          </div>
        </div>

      </div>

    </div>
  );
};
