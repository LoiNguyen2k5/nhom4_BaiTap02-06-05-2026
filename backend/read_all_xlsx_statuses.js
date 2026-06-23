const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../ATRIA_HRM_TestCases_Nhom11_v5 (1).xlsx');

function findStatuses() {
  const workbook = XLSX.readFile(excelPath);
  const sheetNames = workbook.SheetNames;
  
  console.log('=== TRẠNG THÁI TEST CASE TRÊN EXCEL ===');
  
  sheetNames.forEach(sheetName => {
    if (sheetName.startsWith('TC_')) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      let overallStatus = 'Unknown';
      
      // Kiểm tra Row 3 (index 2) Cell 5 (index 5)
      if (data[2] && data[2][5]) {
        overallStatus = data[2][5];
      }
      
      // Hoặc tìm trong vài hàng đầu xem có từ nào là 'Pass' hay 'Fail' đi kèm với 'Result' không
      console.log(`${sheetName}: ${overallStatus}`);
    }
  });
}

findStatuses();
