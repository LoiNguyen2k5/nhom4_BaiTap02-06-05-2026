const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createAdminAccount() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (adminExists) {
      console.log('⚠ Admin đã tồn tại: admin@example.com');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Create admin user
    const admin = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      is_verified: true,
    });

    console.log('✓ Tài khoản admin đã được tạo thành công!');
    console.log('  Email: admin@example.com');
    console.log('  Password: Admin@123456');

  } catch (error) {
    console.error('✗ Lỗi khi tạo admin:', error.message);
  }
}

module.exports = createAdminAccount;
