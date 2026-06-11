require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

async function seedAll() {
  // Init DB
  const sequelize = require('./src/config/database');
  await sequelize.authenticate();

  const User = require('./src/models/User');
  const Profile = require('./src/models/Profile');
  const Contract = require('./src/models/Contract');
  const Department = require('./src/models/Department');
  require('./src/models/index'); // set up associations

  await sequelize.sync({ alter: true });

  const hashedPw = await bcrypt.hash('123456', 10);

  // Seed 10 nhân viên mẫu
  const employeeData = [
    { name: 'Nguyễn Văn An',    email: 'an.nguyen@company.com',    department: 'IT' },
    { name: 'Trần Thị Bích',    email: 'bich.tran@company.com',    department: 'Kế toán' },
    { name: 'Lê Minh Cường',    email: 'cuong.le@company.com',     department: 'Kinh doanh' },
    { name: 'Phạm Thị Dung',    email: 'dung.pham@company.com',    department: 'Marketing' },
    { name: 'Hoàng Văn Em',     email: 'em.hoang@company.com',     department: 'IT' },
    { name: 'Đặng Thị Phương',  email: 'phuong.dang@company.com',  department: 'Hành chính' },
    { name: 'Vũ Quốc Hùng',     email: 'hung.vu@company.com',      department: 'Kinh doanh' },
    { name: 'Ngô Thị Lan',      email: 'lan.ngo@company.com',      department: 'Kế toán' },
  ];

  const users = [];
  for (const emp of employeeData) {
    let u = await User.findOne({ where: { email: emp.email } });
    if (!u) {
      const [dept] = await Department.findOrCreate({
        where: { name: emp.department },
        defaults: { description: `Phòng ${emp.department}`, status: 'active' }
      });
      u = await User.create({
        name: emp.name,
        email: emp.email,
        password: hashedPw,
        role: 'employee',
        department_id: dept.id,
        status: 'active',
      });
      await Profile.create({ user_id: u.id, full_name: emp.name });
      console.log(`✓ Đã tạo nhân viên: ${emp.name}`);
    } else {
      console.log(`  Bỏ qua (đã tồn tại): ${emp.email}`);
    }
    users.push({ id: u.id, name: emp.name, dept: emp.department });
  }

  // Seed hợp đồng mẫu
  const contractTemplates = [
    { type: 'probation', start: '2024-01-01', end: '2024-03-31', salary: 8000000,  status: 'expired' },
    { type: 'official',  start: '2024-04-01', end: '2025-03-31', salary: 12000000, status: 'expired' },
    { type: 'official',  start: '2025-04-01', end: '2026-03-31', salary: 14000000, status: 'active' },
    { type: 'probation', start: '2025-01-01', end: '2025-03-31', salary: 7500000,  status: 'expired' },
    { type: 'official',  start: '2025-04-01', end: null,         salary: 11000000, status: 'active' },
    { type: 'probation', start: '2025-06-01', end: '2025-08-31', salary: 9000000,  status: 'expired' },
    { type: 'official',  start: '2025-09-01', end: '2026-08-31', salary: 13000000, status: 'active' },
    { type: 'probation', start: '2024-09-01', end: '2024-11-30', salary: 8500000,  status: 'expired' },
    { type: 'official',  start: '2024-12-01', end: null,         salary: 15000000, status: 'active' },
    { type: 'probation', start: '2025-03-01', end: '2025-05-31', salary: 7000000,  status: 'terminated' },
    { type: 'official',  start: '2026-01-01', end: '2026-12-31', salary: 16000000, status: 'active' },
    { type: 'probation', start: '2026-02-01', end: '2026-04-30', salary: 9500000,  status: 'expired' },
  ];

  let contractIdx = 0;
  for (const user of users) {
    // Mỗi nhân viên lấy 1-2 hợp đồng từ templates
    const numContracts = Math.ceil((contractIdx % 3) + 1);
    for (let i = 0; i < numContracts && contractIdx < contractTemplates.length; i++, contractIdx++) {
      const t = contractTemplates[contractIdx];
      const num = `HĐ-${2024 + (contractIdx % 3)}-${String(contractIdx + 1).padStart(3, '0')}`;
      const exists = await Contract.findOne({ where: { contract_number: num } });
      if (!exists) {
        await Contract.create({
          user_id: user.id,
          contract_number: num,
          contract_type: t.type,
          start_date: t.start,
          end_date: t.end,
          basic_salary: t.salary,
          status: t.status,
        });
        console.log(`  ✓ HĐ ${num} → ${user.name} (${t.type}, ${t.status})`);
      }
    }
  }

  console.log('\n✅ Seed dữ liệu mẫu hoàn tất!');
  process.exit(0);
}

seedAll().catch(err => { console.error('Lỗi seed:', err.message); process.exit(1); });
