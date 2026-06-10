const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'nhom4_baitap',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

async function check() {
  try {
    const [results] = await sequelize.query('SELECT id, name, email, role FROM users');
    console.log('Current users in DB:');
    console.log(results);
    
    const [columns] = await sequelize.query('DESCRIBE users');
    console.log('Current schema for users table:');
    console.log(columns);
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await sequelize.close();
  }
}

check();
