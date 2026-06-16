require('dotenv').config();
const sequelize = require('./src/config/database');
require('./src/models/index');

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');
    await sequelize.sync({ alter: true });
    console.log('DB synced successfully with alter: true');
  } catch (err) {
    console.error('Sync Error:', err);
  } finally {
    process.exit();
  }
}
syncDb();
