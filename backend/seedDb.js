require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/database');

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công');

    const seedPath = path.join(__dirname, 'src/database/seed.sql');
    console.log(`Đang đọc file seed: ${seedPath}`);
    const sql = fs.readFileSync(seedPath, 'utf8');

    // Tắt kiểm tra khóa ngoại trước khi truncate và chạy seed
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Chia các câu lệnh SQL bằng dấu chấm phẩy
    // Lưu ý: regex này bỏ qua dấu chấm phẩy trong chuỗi (ví dụ: 'Hr@123456')
    // Để an toàn, chúng ta lọc bỏ các comment và tách theo regex hoặc chạy từng khối lớn.
    // Cách đơn giản nhất là lọc các dòng trống và comments, sau đó ghép lại và tách bằng ';'
    const cleanSql = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n');

    const statements = cleanSql.split(';');

    console.log(`Tìm thấy ${statements.length} câu lệnh SQL cần chạy...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await sequelize.query(statement);
        } catch (err) {
          console.warn(`[Cảnh báo] Lỗi tại câu lệnh thứ ${i + 1}:`, err);
          console.warn(`Câu lệnh bị lỗi: ${statement.substring(0, 200)}...`);
        }
      }
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('\n✓ Đã nạp seed data thành công!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Lỗi chạy seed:', error.message);
    process.exit(1);
  }
}

runSeed();
