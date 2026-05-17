const { Sequelize } = require('sequelize');
require('dotenv').config();

// Chỉ dùng socketPath khi được cấu hình (Linux/Mac)
// Trên Windows dùng TCP (host + port) — không cần socketPath
const dialectOptions = { charset: 'utf8mb4' };
if (process.env.DB_SOCKET) {
  dialectOptions.socketPath = process.env.DB_SOCKET;
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'nhom4_baitap',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions,
  }
);

module.exports = sequelize;
