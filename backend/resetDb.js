/**
 * resetDb.js - Xóa sạch toàn bộ data trong database (giữ nguyên cấu trúc bảng)
 * Chạy: node resetDb.js
 */
require('dotenv').config();
const sequelize = require('./src/config/database');
require('./src/models/index');

async function resetDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công');

    // Tắt kiểm tra khóa ngoại để xóa không bị lỗi thứ tự
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    const tables = [
      'advance_requests',
      'salary_adjustments',
      'payrolls',
      'performance_reviews',
      'promotion_proposals',
      'leave_requests',
      'leave_balances',
      'attendances',
      'tasks',
      'candidates',
      'account_requests',
      'contracts',
      'activity_logs',
      'otps',
      'profiles',
      'users',
      'departments',
      'tax_insurance_configs',
    ];

    for (const table of tables) {
      try {
        await sequelize.query(`TRUNCATE TABLE \`${table}\``);
        console.log(`  ✓ Đã xóa bảng: ${table}`);
      } catch (e) {
        console.log(`  ℹ️  Bỏ qua bảng ${table}: ${e.message}`);
      }
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('\n✅ Xóa sạch database thành công!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Lỗi:', error.message);
    process.exit(1);
  }
}

resetDatabase();
