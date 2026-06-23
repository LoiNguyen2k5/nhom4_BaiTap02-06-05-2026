const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = path.join(__dirname, '../ATRIA_HRM_TestCases_Nhom11_v5 (1).xlsx');
const jsonReportPath = path.join(__dirname, 'test_results.json');

function main() {
  console.log('=== ĐANG ĐỐI CHIẾU EXCEL TEST CASES VS WEB THỰC TẾ ===\n');

  if (!fs.existsSync(jsonReportPath)) {
    console.error('✗ Không tìm thấy file test_results.json. Vui lòng chạy node verify_tests.js trước.');
    process.exit(1);
  }

  const webResults = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
  const workbook = XLSX.readFile(excelPath);
  const sheetNames = workbook.SheetNames;

  // Lấy danh sách kết quả từ Excel
  const excelStatuses = {};
  sheetNames.forEach(sheetName => {
    if (sheetName.startsWith('TC_')) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      let status = 'Unknown';
      if (data[2] && data[2][5]) {
        status = String(data[2][5]).trim();
      }
      excelStatuses[sheetName] = status;
    }
  });

  // Đối chiếu
  const comparison = [];
  let matchesCount = 0;
  let mismatchesCount = 0;

  webResults.forEach(webRes => {
    const tcId = webRes.tcId;
    if (!excelStatuses[tcId]) {
      // Bỏ qua các test case đã bị xoá khỏi file Excel
      return;
    }
    const excelStatus = excelStatuses[tcId];
    
    // Web results are PASS/FAIL
    // Excel statuses are Pass/Fail/Unknown
    const actualWebPassed = webRes.status === 'PASS';
    const excelPassed = excelStatus.toLowerCase() === 'pass';

    let match = false;
    if (excelStatus.toLowerCase() === 'pass' && webRes.status === 'PASS') {
      match = true;
    } else if (excelStatus.toLowerCase() === 'fail' && webRes.status === 'FAIL') {
      match = true;
    }

    if (match) {
      matchesCount++;
    } else {
      mismatchesCount++;
    }

    comparison.push({
      tcId,
      name: webRes.name,
      module: webRes.module,
      excelStatus,
      webStatus: webRes.status,
      match: match ? 'Khớp (MATCH)' : 'Lệch (MISMATCH)',
      actualDetail: webRes.actual,
      explanation: getExplanation(tcId, excelStatus, webRes.status)
    });
  });

  // Xuất báo cáo console
  console.log(`Tổng số TC đối chiếu: ${comparison.length}`);
  console.log(`✓ Khớp: ${matchesCount}`);
  console.log(`✗ Lệch: ${mismatchesCount}\n`);

  // Tạo báo cáo Markdown
  let md = `# ATRIA HRM — Báo cáo Đối chiếu Excel Test Cases vs Web Thực tế\n\n`;
  md += `**Thời gian đối chiếu:** ${new Date().toLocaleString('vi-VN')}\n`;
  md += `**File Excel:** ATRIA_HRM_TestCases_Nhom11_v5 (1).xlsx\n\n`;

  md += `## 1. Tóm tắt đối chiếu\n\n`;
  md += `| Chỉ số | Số lượng |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Tổng số ca kiểm thử đối chiếu** | **${comparison.length}** |\n`;
  md += `| **Trạng thái Khớp (MATCH)** | **${matchesCount}** |\n`;
  md += `| **Trạng thái Lệch (MISMATCH)** | **${mismatchesCount}** |\n\n`;

  md += `> [!NOTE]\n`;
  md += `> **Mismatches (Lệch)** xuất hiện khi một testcase được đánh dấu là **Fail** trong Excel (do phát hiện lỗi lúc làm báo cáo thủ công trước đây) nhưng trên Web thực tế hiện tại đã chạy **PASS** (lỗi đã được sửa/bổ sung hoàn thiện).\n\n`;

  md += `## 2. Bảng đối chiếu chi tiết\n\n`;
  md += `| Mã TC | Tên Test Case | Excel Status | Web Actual | Đối chiếu | Ghi chú & Giải thích |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  comparison.forEach(c => {
    const matchEmoji = c.match === 'Khớp (MATCH)' ? '✅ Khớp' : '⚠️ Lệch';
    md += `| **${c.tcId}** | ${c.name} | **${c.excelStatus}** | **${c.webStatus}** | **${matchEmoji}** | ${c.explanation} |\n`;
  });

  const comparisonReportPath = path.join(__dirname, '../EXCEL_VS_WEB_COMPARISON.md');
  fs.writeFileSync(comparisonReportPath, md, 'utf8');
  console.log(`✓ Đã lưu báo cáo đối chiếu vào: ${comparisonReportPath}`);

  // In ra các ca bị lệch (nếu có)
  if (mismatchesCount > 0) {
    console.log('\nCác testcase có sự khác biệt (Web thực tế chạy tốt hơn kỳ vọng Excel):');
    comparison.forEach(c => {
      if (c.match.includes('MISMATCH')) {
        console.log(`- ${c.tcId}: Excel = ${c.excelStatus} | Web = ${c.webStatus} -> ${c.explanation}`);
      }
    });
  }
}

function getExplanation(tcId, excelStatus, webStatus) {
  if (excelStatus.toLowerCase() === 'fail' && webStatus === 'PASS') {
    if (tcId === 'TC_062') {
      return 'Trùng lịch xin nghỉ: Excel đánh dấu Fail vì lỗi chưa chặn trùng. Hiện tại Web đã fix thành công (chặn trùng trả về 400).';
    }
    return 'Excel đánh dấu Fail vì phát hiện lỗi trước đó. Hiện tại code web đã chạy PASS (đáp ứng đúng yêu cầu).';
  }
  if (excelStatus.toLowerCase() === 'pass' && webStatus === 'FAIL') {
    return 'Excel chạy thành công nhưng web thực tế bị FAIL (cần kiểm tra lại code).';
  }
  return '-';
}

main();
