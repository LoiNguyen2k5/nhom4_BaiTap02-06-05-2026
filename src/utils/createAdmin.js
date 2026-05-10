const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createAdminAccount() {
  try {
    // Check if admin already exists
    let adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (adminExists) {
      // Update password if exists
      const hashedPassword = await bcrypt.hash('123456', 10);
      await adminExists.update({
        password: hashedPassword,
        role: 'admin',
        is_verified: true
      });
      console.log('⚠ Cập nhật mật khẩu admin: admin@example.com');
      console.log('  Email: admin@example.com');
      console.log('  Password: 123456');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create admin user
    const admin = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      is_verified: true,
    });

    console.log('✓ Tài khoản admin đã được tạo thành công!');
    console.log('  Email: admin@example.com');
    console.log('  Password: 123456');

    // Create test user
    const testUserExists = await User.findOne({ where: { email: 'user@example.com' } });
    if (!testUserExists) {
      const testUserPassword = await bcrypt.hash('123456', 10);
      await User.create({
        email: 'user@example.com',
        password: testUserPassword,
        role: 'user',
        is_verified: true
      });
      console.log('✓ Tài khoản user test đã được tạo!');
      console.log('  Email: user@example.com');
      console.log('  Password: 123456');
    }

  } catch (error) {
    console.error('✗ Lỗi khi tạo admin:', error.message);
  }
}

module.exports = createAdminAccount;
