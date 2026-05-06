require('dotenv').config();
const { Sequelize } = require('sequelize');

const initializeDatabase = async () => {
  try {
    // Create connection without database to execute CREATE DATABASE
    const sequelizeAdmin = new Sequelize(
      '',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
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

    // Sync models
    await sequelize.sync({ force: false });
    console.log('✓ Database đã được khởi tạo thành công');
  } catch (error) {
    console.error('✗ Lỗi kết nối database:', error.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
