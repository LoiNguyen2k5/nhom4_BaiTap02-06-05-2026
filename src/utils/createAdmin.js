const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createAdminAccount() {
  try {
    // Kiem tra admin da ton tai chua
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (adminExists) {
      console.log('⚠ Admin da ton tai: admin@example.com');
      return;
    }

    // Ma hoa mat khau
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Tao tai khoan admin voi status active
    await User.create({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });

    console.log('✓ Tai khoan admin da duoc tao thanh cong!');
    console.log('  Email: admin@example.com');
    console.log('  Password: Admin@123456');

  } catch (error) {
    console.error('✗ Loi khi tao admin:', error.message);
  }
}

module.exports = createAdminAccount;
