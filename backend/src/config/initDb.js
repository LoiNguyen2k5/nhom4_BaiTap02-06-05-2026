require('dotenv').config();
const { Sequelize } = require('sequelize');

const initializeDatabase = async () => {
  try {
    // Create connection without database to execute CREATE DATABASE
    // Chỉ dùng socketPath khi được cấu hình (Linux/Mac)
    // Trên Windows dùng TCP (host + port) — không cần socketPath
    const adminDialectOptions = {};
    if (process.env.DB_SOCKET) {
      adminDialectOptions.socketPath = process.env.DB_SOCKET;
    }

    const sequelizeAdmin = new Sequelize(
      '',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: adminDialectOptions,
      }
    );

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'nhom4_baitap';
    await sequelizeAdmin.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ Database '${dbName}' được tạo hoặc đã tồn tại`);
    await sequelizeAdmin.close();

    // Now connect to the actual database
    const sequelize = require('./database');
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công');

    // Load all entities so they are registered before sync
    require('../entities/index');

    // Sync entities → tạo tables tự động
    await sequelize.sync({ alter: false });
    console.log('✓ Database da duoc cap nhat thanh cong');
    // Seed data: chạy thủ công khi cần → mysql -u root nhom4_baitap < backend/src/database/seed.sql
  } catch (error) {
    console.error('✗ Lỗi kết nối database:', error.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
