import type { AdmissionApplication } from '../types';
import { AGE_GROUP_LABELS, SCHOOL_INFO } from '../data/schoolInfo';

export const exportApplicationsToExcel = (applications: AdmissionApplication[], titleSuffix = '') => {
  if (applications.length === 0) {
    alert('Không có dữ liệu hồ sơ để xuất báo cáo Excel.');
    return;
  }

  const currentDateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã trúng tuyển';
      case 'reviewing': return 'Đang thẩm định';
      case 'need_supplement': return 'Cần bổ sung hồ sơ';
      case 'rejected': return 'Từ chối tiếp nhận';
      case 'pending':
      default: return 'Chờ tiếp nhận';
    }
  };

  // Build styled HTML Spreadsheet table for Excel
  const excelTable = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>DanhSachTuyenSinh</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; }
        table { border-collapse: collapse; width: 100%; }
        th { 
          background-color: #D9E1F2; 
          color: #002060; 
          font-weight: bold; 
          border: 1px solid #000000; 
          text-align: center; 
          vertical-align: middle; 
          padding: 8px 4px; 
          font-size: 10pt;
        }
        td { 
          border: 1px solid #000000; 
          vertical-align: middle; 
          padding: 6px 4px; 
          font-size: 10.5pt;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .text-bold { font-weight: bold; }
        .format-text { mso-number-format:"\\@"; }
        .title-header { font-size: 15pt; font-weight: bold; text-align: center; color: #C00000; }
        .school-header { font-size: 11pt; font-weight: bold; }
      </style>
    </head>
    <body>
      <table>
        <!-- Header Info -->
        <tr>
          <td colspan="10" class="school-header text-left">SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI<br/><strong>${SCHOOL_INFO.schoolName}</strong><br/>Địa chỉ: ${SCHOOL_INFO.address}</td>
          <td colspan="22" class="school-header text-center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/><strong>Độc lập - Tự do - Hạnh phúc</strong></td>
        </tr>
        <tr><td colspan="32" style="height: 15px; border: none;"></td></tr>
        <tr>
          <td colspan="32" class="title-header">
            BẢNG TỔNG HỢP DANH SÁCH ĐĂNG KÝ TUYỂN SINH MẦM NON NĂM HỌC 2026 - 2027
          </td>
        </tr>
        <tr>
          <td colspan="32" class="text-center" style="font-style: italic; border: none; font-size: 10pt; color: #595959;">
            (Thời điểm xuất danh sách: ${currentDateStr} - Tổng số hồ sơ: ${applications.length})
          </td>
        </tr>
        <tr><td colspan="32" style="height: 12px; border: none;"></td></tr>

        <!-- Table Columns -->
        <thead>
          <tr style="background-color: #4472C4; color: #FFFFFF;">
            <th style="background-color: #2F5597; color: white;" rowspan="2">STT</th>
            <th style="background-color: #2F5597; color: white;" rowspan="2">Mã hồ sơ</th>
            <th style="background-color: #2F5597; color: white;" colspan="8">1. THÔNG TIN CỦA HỌC SINH</th>
            <th style="background-color: #2F5597; color: white;" colspan="4">NƠI THƯỜNG TRÚ</th>
            <th style="background-color: #2F5597; color: white;" colspan="4">NƠI Ở HIỆN TẠI</th>
            <th style="background-color: #2F5597; color: white;" rowspan="2">2. SỐ ĐỊNH DANH (12 SỐ)</th>
            <th style="background-color: #2F5597; color: white;" rowspan="2">KHỐI LỚP DỰ TUYỂN</th>
            <th style="background-color: #2F5597; color: white;" colspan="5">3. THÔNG TIN CHA</th>
            <th style="background-color: #2F5597; color: white;" colspan="5">4. THÔNG TIN MẸ</th>
            <th style="background-color: #2F5597; color: white;" colspan="4">5. THÔNG TIN NGƯỜI GIÁM HỘ (NẾU CÓ)</th>
            <th style="background-color: #2F5597; color: white;" colspan="2">6. THÔNG TIN LIÊN HỆ</th>
            <th style="background-color: #2F5597; color: white;" rowspan="2">TRẠNG THÁI DUYỆT</th>
            <th style="background-color: #2F5597; color: white;" rowspan="2">GHI CHÚ XÉT DUYỆT</th>
            <th style="background-color: #2F5597; color: white;" rowspan="2">NGÀY ĐĂNG KÝ</th>
          </tr>
          <tr>
            <!-- 1. Học sinh -->
            <th>Họ và tên</th>
            <th>Giới tính</th>
            <th>Dân tộc</th>
            <th>Ngày sinh</th>
            <th>Nơi sinh (Tỉnh/TP)</th>
            <th>Nơi sinh chi tiết</th>
            <th>Đối tượng chính sách</th>
            <th>HS Khuyết tật</th>
            
            <!-- Nơi thường trú -->
            <th>Tỉnh/Thành phố</th>
            <th>Xã (Phường)</th>
            <th>Thôn (Tổ)</th>
            <th>Số nhà</th>

            <!-- Nơi ở hiện tại -->
            <th>Tỉnh/Thành phố</th>
            <th>Xã (Phường)</th>
            <th>Thôn (Tổ)</th>
            <th>Số nhà</th>

            <!-- 3. Cha -->
            <th>Họ tên Cha</th>
            <th>Năm sinh</th>
            <th>Số CCCD</th>
            <th>Số ĐT Cha</th>
            <th>Nghề nghiệp</th>

            <!-- 4. Mẹ -->
            <th>Họ tên Mẹ</th>
            <th>Năm sinh</th>
            <th>Số CCCD</th>
            <th>Số ĐT Mẹ</th>
            <th>Nghề nghiệp</th>

            <!-- 5. Giám hộ -->
            <th>Họ tên</th>
            <th>Năm sinh</th>
            <th>Số ĐT</th>
            <th>Nghề nghiệp</th>

            <!-- 6. Liên hệ -->
            <th>Số ĐT liên hệ</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${applications.map((app, index) => {
            const ageGroupInfo = AGE_GROUP_LABELS[app.targetGroup]?.label || app.targetGroup;
            const createdDateStr = new Date(app.createdAt).toLocaleString('vi-VN');
            
            return `
              <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F9FBFD'};">
                <td class="text-center format-text">${index + 1}</td>
                <td class="text-center text-bold format-text" style="color: #C00000;">${app.id || ''}</td>
                
                <!-- 1. Học sinh -->
                <td class="text-bold text-left">${(app.studentName || '').toUpperCase()}</td>
                <td class="text-center">${app.gender || ''}</td>
                <td class="text-center">${app.ethnicity || ''}</td>
                <td class="text-center format-text">${app.birthDate || ''}</td>
                <td class="text-left">${app.birthPlace || ''}</td>
                <td class="text-left">${app.detailedBirthPlace || ''}</td>
                <td class="text-left">${app.policyCategory || 'Không'}</td>
                <td class="text-center">${app.disabilityStatus || 'Không'}</td>

                <!-- Nơi thường trú -->
                <td class="text-left">${app.permanentProvince || ''}</td>
                <td class="text-left">${app.permanentWard || ''}</td>
                <td class="text-left">${app.permanentHamlet || ''}</td>
                <td class="text-left">${app.permanentHouseNumber || ''}</td>

                <!-- Nơi ở hiện tại -->
                <td class="text-left">${app.currentProvince || ''}</td>
                <td class="text-left">${app.currentWard || ''}</td>
                <td class="text-left">${app.currentHamlet || ''}</td>
                <td class="text-left">${app.currentHouseNumber || ''}</td>

                <!-- 2. Số định danh cá nhân -->
                <td class="text-center format-text text-bold" style="color: #002060;">'${app.personalIdNumber || ''}</td>
                
                <!-- Khối lớp -->
                <td class="text-left text-bold">${ageGroupInfo}</td>

                <!-- 3. Cha -->
                <td class="text-left">${app.fatherName || ''}</td>
                <td class="text-center format-text">${app.fatherBirthYear || ''}</td>
                <td class="text-center format-text">'${app.fatherIdCard || ''}</td>
                <td class="text-center format-text">${app.fatherPhone || ''}</td>
                <td class="text-left">${app.fatherJob || ''}</td>

                <!-- 4. Mẹ -->
                <td class="text-left">${app.motherName || ''}</td>
                <td class="text-center format-text">${app.motherBirthYear || ''}</td>
                <td class="text-center format-text">'${app.motherIdCard || ''}</td>
                <td class="text-center format-text">${app.motherPhone || ''}</td>
                <td class="text-left">${app.motherJob || ''}</td>

                <!-- 5. Giám hộ -->
                <td class="text-left">${app.guardianName || ''}</td>
                <td class="text-center format-text">${app.guardianBirthYear || ''}</td>
                <td class="text-center format-text">${app.guardianPhone || ''}</td>
                <td class="text-left">${app.guardianJob || ''}</td>

                <!-- 6. Liên hệ -->
                <td class="text-center format-text text-bold" style="color: #C00000;">${app.contactPhone || ''}</td>
                <td class="text-left">${app.email || ''}</td>

                <!-- Trạng thái & Ghi chú -->
                <td class="text-center text-bold">${getStatusText(app.status)}</td>
                <td class="text-left">${app.statusNote || ''}</td>
                <td class="text-center format-text">${createdDateStr}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <!-- Signatures Footer -->
      <br/><br/>
      <table style="border: none;">
        <tr style="border: none;">
          <td colspan="8" style="border: none; text-align: center;">
            <strong>NGƯỜI LẬP BIỂU</strong><br/>
            <span style="font-style: italic; font-size: 9pt;">(Ký và ghi rõ họ tên)</span>
            <br/><br/><br/><br/>
          </td>
          <td colspan="12" style="border: none; text-align: center;">
            <strong>CÁN BỘ TUYỂN SINH</strong><br/>
            <span style="font-style: italic; font-size: 9pt;">(Ký và ghi rõ họ tên)</span>
            <br/><br/><br/><br/>
          </td>
          <td colspan="12" style="border: none; text-align: center;">
            <em>Hà Nội, ngày ...... tháng ...... năm 2026</em><br/>
            <strong>BAN GIÁM HIỆU NHÀ TRƯỜNG</strong><br/>
            <span style="font-style: italic; font-size: 9pt;">(Ký tên và đóng dấu)</span>
            <br/><br/><br/><br/>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Create Excel file blob (.xls with Excel HTML MIME)
  const blob = new Blob(['\uFEFF' + excelTable], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  const fileName = `Bang_Tong_Hop_Tuyen_Sinh_Mam_Non_Yen_Bai_${new Date().toISOString().slice(0, 10)}${titleSuffix ? '_' + titleSuffix : ''}.xls`;

  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
