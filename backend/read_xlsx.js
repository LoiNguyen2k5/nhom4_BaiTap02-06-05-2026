const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../ATRIA_HRM_TestCases_Nhom11_v5 (1).xlsx');

function readTestCases() {
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['TC_062'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log('--- TC_001 DATA ---');
  data.forEach((row, idx) => {
    console.log(`Row ${idx + 1}:`, row);
  });
}

readTestCases();
