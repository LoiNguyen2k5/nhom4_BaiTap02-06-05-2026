const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialectOptions = {
  charset: 'utf8mb4',
  ssl: {
    rejectUnauthorized: false
  }
};

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