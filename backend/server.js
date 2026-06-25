require('dotenv').config();
const app = require('./src/app');
const initializeDatabase = require('./src/config/initDb');

const PORT = process.env.PORT || 3000;

// Debug env vars
console.log('=== ENV CHECK ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('================');

const server = app.listen(PORT, async () => {
  console.log(`✓ Server đang chạy trên http://localhost:${PORT}`);

  // Initialize Database after server starts
  await initializeDatabase();
});