require('dotenv').config();
const { Sequelize } = require('sequelize');

const initializeDatabase = async () => {
  try {
    // Connect directly - no CREATE DATABASE (Aiven already has defaultdb)
    const sequelize = require('./database');
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công');

    // Load all entities so they are registered before sync
    require('../entities/index');

    // Sync entities → tạo tables tự động
    await sequelize.sync({ alter: true });
    console.log('✓ Database da duoc cap nhat thanh cong');
    // Seed data: chạy thủ công khi cần → mysql -u root nhom4_baitap < backend/src/database/seed.sql
  } catch (error) {
    console.error('✗ Lỗi kết nối database:', error.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;