const bcrypt = require('bcrypt');
const User = require('../models/User');
const Profile = require('../models/Profile');

async function createAdminAccount() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const testUserEmail = process.env.TEST_USER_EMAIL || 'user@example.com';
  const testUserPassword = process.env.TEST_USER_PASSWORD || 'User@123456';

  try {
    // Luôn đảm bảo tài khoản admin tồn tại và đúng mật khẩu
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await adminExists.update({ password: hashedPassword, role: 'admin', status: 'active', name: 'Hệ Thống Admin' });
      await Profile.findOrCreate({ where: { user_id: adminExists.id } }).then(([prof]) => prof.update({ full_name: 'Hệ Thống Admin' }));
      console.log(`√ Cập nhật tài khoản admin: ${adminEmail}`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = await User.create({ email: adminEmail, password: hashedPassword, role: 'admin', status: 'active', name: 'Hệ Thống Admin' });
      await Profile.create({ user_id: newAdmin.id, full_name: 'Hệ Thống Admin' });
      console.log(`√ Tài khoản admin đã được tạo: ${adminEmail}`);
    }

    // Luôn đảm bảo tài khoản user test tồn tại và đúng mật khẩu
    const testUserExists = await User.findOne({ where: { email: testUserEmail } });
    if (testUserExists) {
      const hashedTestPw = await bcrypt.hash(testUserPassword, 10);
      await testUserExists.update({ password: hashedTestPw, role: 'employee', status: 'active', name: 'Nguyễn Văn A' });
      await Profile.findOrCreate({ where: { user_id: testUserExists.id } }).then(([prof]) => prof.update({ full_name: 'Nguyễn Văn A' }));
      console.log(`√ Cập nhật tài khoản employee test: ${testUserEmail}`);
    } else {
      const hashedTestPw = await bcrypt.hash(testUserPassword, 10);
      const newEmp = await User.create({ email: testUserEmail, password: hashedTestPw, role: 'employee', status: 'active', name: 'Nguyễn Văn A' });
      await Profile.create({ user_id: newEmp.id, full_name: 'Nguyễn Văn A' });
      console.log(`√ Tài khoản employee test đã được tạo: ${testUserEmail}`);
    }

    // Luôn đảm bảo tài khoản hr tồn tại
    const hrEmail = 'hr@example.com';
    const hrPassword = 'Hr@123456';
    const hrExists = await User.findOne({ where: { email: hrEmail } });
    if (hrExists) {
      const hashedHrPw = await bcrypt.hash(hrPassword, 10);
      await hrExists.update({ password: hashedHrPw, role: 'hr', status: 'active', name: 'Trần Nhân Sự' });
      await Profile.findOrCreate({ where: { user_id: hrExists.id } }).then(([prof]) => prof.update({ full_name: 'Trần Nhân Sự' }));
      console.log(`√ Cập nhật tài khoản hr test: ${hrEmail}`);
    } else {
      const hashedHrPw = await bcrypt.hash(hrPassword, 10);
      const newHr = await User.create({ email: hrEmail, password: hashedHrPw, role: 'hr', status: 'active', name: 'Trần Nhân Sự' });
      await Profile.create({ user_id: newHr.id, full_name: 'Trần Nhân Sự' });
      console.log(`√ Tài khoản hr test đã được tạo: ${hrEmail}`);
    }
    // Luôn đảm bảo tài khoản manager tồn tại
    const managerEmail = 'manager@example.com';
    const managerPassword = 'Manager@123456';
    const managerExists = await User.findOne({ where: { email: managerEmail } });
    if (managerExists) {
      const hashedManagerPw = await bcrypt.hash(managerPassword, 10);
      await managerExists.update({ password: hashedManagerPw, role: 'manager', status: 'active', name: 'Nguyễn Quản Lý' });
      await Profile.findOrCreate({ where: { user_id: managerExists.id } }).then(([prof]) => prof.update({ full_name: 'Nguyễn Quản Lý' }));
      console.log(`√ Cập nhật tài khoản manager test: ${managerEmail}`);
    } else {
      const hashedManagerPw = await bcrypt.hash(managerPassword, 10);
      const newMan = await User.create({ email: managerEmail, password: hashedManagerPw, role: 'manager', status: 'active', name: 'Nguyễn Quản Lý' });
      await Profile.create({ user_id: newMan.id, full_name: 'Nguyễn Quản Lý' });
      console.log(`√ Tài khoản manager test đã được tạo: ${managerEmail}`);
    }

    // Luôn đảm bảo tài khoản accountant tồn tại
    const accountantEmail = 'accountant@example.com';
    const accountantPassword = 'Accountant@123456';
    const accountantExists = await User.findOne({ where: { email: accountantEmail } });
    if (accountantExists) {
      const hashedAccPw = await bcrypt.hash(accountantPassword, 10);
      await accountantExists.update({ password: hashedAccPw, role: 'accountant', status: 'active', name: 'Trần Kế Toán' });
      await Profile.findOrCreate({ where: { user_id: accountantExists.id } }).then(([prof]) => prof.update({ full_name: 'Trần Kế Toán' }));
      console.log(`√ Cập nhật tài khoản accountant test: ${accountantEmail}`);
    } else {
      const hashedAccPw = await bcrypt.hash(accountantPassword, 10);
      const newAcc = await User.create({ email: accountantEmail, password: hashedAccPw, role: 'accountant', status: 'active', name: 'Trần Kế Toán' });
      await Profile.create({ user_id: newAcc.id, full_name: 'Trần Kế Toán' });
      console.log(`√ Tài khoản accountant test đã được tạo: ${accountantEmail}`);
    }
  } catch (error) {
    console.error('✗ Lỗi khi tạo tài khoản hệ thống:', error.message);
  }
}

module.exports = createAdminAccount;
