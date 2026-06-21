/**
 * seedData.js - Tạo dữ liệu mẫu phong phú dùng chung cho toàn nhóm
 * Tự động chạy khi khởi động server (idempotent - an toàn khi chạy nhiều lần)
 */
const bcrypt = require('bcrypt');
const {
  User, Profile, Department, Contract, LeaveBalance, LeaveRequest,
  Task, Payroll, PerformanceReview, Attendance, TaxInsuranceConfig,
  Candidate, SalaryAdjustment, AdvanceRequest,
} = require('../models/index');

// ──────────────────────────────────────────────────────
// HELPER
// ──────────────────────────────────────────────────────
const days = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};
const dt = (dateStr, h, m = 0) => {
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d;
};
const HASH = '$2b$10$rGnL5vI7Dl6dTz.X2F3vWuDFp4k3fKJ0k5XdXqMd7nqJSNdYHqjuy'; // Admin@123456

async function seedData() {
  try {
    const deptCount = await Department.count();
    if (deptCount > 0) {
      console.log('ℹ️  Dữ liệu mẫu đã tồn tại, bỏ qua seed.');
      return;
    }

    console.log('🌱 Bắt đầu tạo dữ liệu mẫu phong phú...');

    // ══════════════════════════════════════════════════
    // 1. CẤU HÌNH THUẾ & BẢO HIỂM
    // ══════════════════════════════════════════════════
    await TaxInsuranceConfig.create({
      social_insurance_rate: 8.0,
      health_insurance_rate: 1.5,
      unemployment_insurance_rate: 1.0,
      base_salary: 2340000,
      max_insurance_salary: 46800000,
      personal_deduction: 11000000,
      dependent_deduction: 4400000,
    });
    console.log('  ✓ Cấu hình thuế & bảo hiểm');

    // ══════════════════════════════════════════════════
    // 2. PHÒNG BAN (7 phòng)
    // ══════════════════════════════════════════════════
    const depts = await Department.bulkCreate([
      { name: 'Công nghệ thông tin',    description: 'Phát triển sản phẩm, hạ tầng kỹ thuật và bảo mật hệ thống',          status: 'active' },
      { name: 'Nhân sự',                description: 'Tuyển dụng, đào tạo và phát triển nguồn nhân lực',                   status: 'active' },
      { name: 'Kế toán - Tài chính',    description: 'Quản lý tài chính, kế toán và kiểm soát ngân sách',                  status: 'active' },
      { name: 'Marketing',              description: 'Truyền thông thương hiệu, chiến lược marketing và nội dung số',       status: 'active' },
      { name: 'Kinh doanh',             description: 'Phát triển kinh doanh và chăm sóc khách hàng doanh nghiệp',          status: 'active' },
      { name: 'Vận hành & Hỗ trợ',     description: 'Đảm bảo vận hành trơn tru và hỗ trợ các bộ phận khác',              status: 'active' },
      { name: 'Nghiên cứu & Phát triển',description: 'Nghiên cứu công nghệ mới và phát triển sản phẩm sáng tạo',          status: 'active' },
    ]);
    const D = {}; // name -> id
    depts.forEach(d => { D[d.name] = d.id; });
    console.log(`  ✓ ${depts.length} phòng ban`);

    // ══════════════════════════════════════════════════
    // 3. TẠO USERS + PROFILES
    // ══════════════════════════════════════════════════
    const pwAdmin  = await bcrypt.hash('Admin@123456',      10);
    const pwHr     = await bcrypt.hash('Hr@123456',         10);
    const pwMgr    = await bcrypt.hash('Manager@123456',    10);
    const pwAcc    = await bcrypt.hash('Accountant@123456', 10);
    const pwEmp    = await bcrypt.hash('User@123456',       10);
    const pwExtra  = await bcrypt.hash('Employee@123',      10);

    const usersRaw = [
      // Hệ thống
      { name: 'Hệ Thống Admin',    email: 'admin@example.com',        password: pwAdmin, role: 'admin',      status: 'active', dept: null,                        phone: '0901000001', address: 'TP. Hồ Chí Minh', bank: 'Vietcombank', bankNum: '1234567890', bankName: 'HE THONG ADMIN' },
      // HR
      { name: 'Trần Thị Nhân Sự',  email: 'hr@example.com',           password: pwHr,    role: 'hr',         status: 'active', dept: 'Nhân sự',                   phone: '0902000001', address: '12 Lê Lợi, Q.1, HCM',      bank: 'Techcombank',  bankNum: '9876543210', bankName: 'TRAN THI NHAN SU' },
      { name: 'Lê Thị Mai Hương',  email: 'huong.le@example.com',     password: pwExtra, role: 'hr',         status: 'active', dept: 'Nhân sự',                   phone: '0902000002', address: '45 Trần Hưng Đạo, Q.5, HCM', bank: 'BIDV',         bankNum: '5544332211', bankName: 'LE THI MAI HUONG' },
      // Manager
      { name: 'Nguyễn Văn Quản Lý',email: 'manager@example.com',      password: pwMgr,   role: 'manager',    status: 'active', dept: 'Công nghệ thông tin',       phone: '0903000001', address: '78 Võ Văn Tần, Q.3, HCM',   bank: 'VPBank',       bankNum: '1122334455', bankName: 'NGUYEN VAN QUAN LY' },
      { name: 'Phạm Thanh Tùng',   email: 'tung.pham@example.com',    password: pwExtra, role: 'manager',    status: 'active', dept: 'Marketing',                 phone: '0903000002', address: '99 Nguyễn Trãi, Q.5, HCM',  bank: 'Agribank',     bankNum: '6677889900', bankName: 'PHAM THANH TUNG' },
      // Accountant
      { name: 'Trần Văn Kế Toán',  email: 'accountant@example.com',   password: pwAcc,   role: 'accountant', status: 'active', dept: 'Kế toán - Tài chính',       phone: '0904000001', address: '23 Đinh Tiên Hoàng, Q.1, HCM',bank:'MB Bank',      bankNum: '3344556677', bankName: 'TRAN VAN KE TOAN' },
      // Employees - IT
      { name: 'Nguyễn Văn An',     email: 'user@example.com',         password: pwEmp,   role: 'employee',   status: 'active', dept: 'Công nghệ thông tin',       phone: '0905000001', address: '10 Bùi Thị Xuân, Q.1, HCM', bank: 'Vietcombank',  bankNum: '1100220033', bankName: 'NGUYEN VAN AN' },
      { name: 'Lê Minh Tuấn',      email: 'tuan.le@example.com',      password: pwExtra, role: 'employee',   status: 'active', dept: 'Công nghệ thông tin',       phone: '0905000002', address: '55 Lý Thường Kiệt, Q.10, HCM',bank:'Techcombank', bankNum: '9988776655', bankName: 'LE MINH TUAN' },
      { name: 'Phạm Thị Lan',      email: 'lan.pham@example.com',     password: pwExtra, role: 'employee',   status: 'active', dept: 'Công nghệ thông tin',       phone: '0905000003', address: '7 Cách Mạng Tháng 8, Q.3, HCM',bank:'VCB',         bankNum: '4433221100', bankName: 'PHAM THI LAN' },
      { name: 'Trần Quốc Bảo',     email: 'bao.tran@example.com',     password: pwExtra, role: 'employee',   status: 'active', dept: 'Công nghệ thông tin',       phone: '0905000004', address: '33 Điện Biên Phủ, Q. Bình Thạnh',bank:'BIDV',      bankNum: '7766554433', bankName: 'TRAN QUOC BAO' },
      { name: 'Võ Thị Thanh',      email: 'thanh.vo@example.com',     password: pwExtra, role: 'employee',   status: 'active', dept: 'Nghiên cứu & Phát triển',   phone: '0905000005', address: '88 Hoàng Văn Thụ, Q. Phú Nhuận',bank:'TPBank',     bankNum: '2211009988', bankName: 'VO THI THANH' },
      // Employees - Marketing
      { name: 'Hoàng Văn Hùng',    email: 'hung.hoang@example.com',   password: pwExtra, role: 'employee',   status: 'active', dept: 'Marketing',                 phone: '0906000001', address: '14 Trường Sa, Q.3, HCM',    bank: 'Agribank',     bankNum: '5566778899', bankName: 'HOANG VAN HUNG' },
      { name: 'Nguyễn Thị Kiều',   email: 'kieu.nguyen@example.com',  password: pwExtra, role: 'employee',   status: 'active', dept: 'Marketing',                 phone: '0906000002', address: '22 Phan Đình Phùng, Q. PN',  bank: 'Sacombank',    bankNum: '3322110099', bankName: 'NGUYEN THI KIEU' },
      // Employees - HR
      { name: 'Ngô Thị Hồng',      email: 'hong.ngo@example.com',     password: pwExtra, role: 'employee',   status: 'active', dept: 'Nhân sự',                   phone: '0907000001', address: '67 Nguyễn Thị Minh Khai, Q.1',bank:'VPBank',      bankNum: '8899001122', bankName: 'NGO THI HONG' },
      // Employees - Kinh doanh
      { name: 'Đặng Minh Khoa',    email: 'khoa.dang@example.com',    password: pwExtra, role: 'employee',   status: 'active', dept: 'Kinh doanh',                phone: '0908000001', address: '90 Ngô Gia Tự, Q.10, HCM',  bank: 'VietinBank',   bankNum: '1212343456', bankName: 'DANG MINH KHOA' },
      { name: 'Bùi Thị Phương',    email: 'phuong.bui@example.com',   password: pwExtra, role: 'employee',   status: 'active', dept: 'Kinh doanh',                phone: '0908000002', address: '3 Bà Huyện Thanh Quan, Q.3', bank: 'MB Bank',      bankNum: '6543217890', bankName: 'BUI THI PHUONG' },
      // Inactive
      { name: 'Trần Đình Long',     email: 'long.tran@example.com',    password: pwExtra, role: 'employee',   status: 'inactive', dept: 'Vận hành & Hỗ trợ',     phone: '0909000001', address: 'Hà Nội',                    bank: 'BIDV',         bankNum: '9999888877', bankName: 'TRAN DINH LONG' },
    ];

    const createdUsers = [];
    for (const u of usersRaw) {
      const deptId = u.dept ? D[u.dept] : null;
      const user = await User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        status: u.status,
        department_id: deptId,
      });
      await Profile.create({
        user_id: user.id,
        full_name: u.name,
        phone: u.phone,
        address: u.address,
        bank_name: u.bank,
        bank_account_number: u.bankNum,
        bank_account_name: u.bankName,
      });
      createdUsers.push({ ...u, id: user.id, department_id: deptId });
    }
    console.log(`  ✓ ${createdUsers.length} tài khoản + hồ sơ`);

    // Alias nhanh
    const byEmail = (email) => createdUsers.find(u => u.email === email)?.id;
    const ADMIN   = byEmail('admin@example.com');
    const HR1     = byEmail('hr@example.com');
    const MGR1    = byEmail('manager@example.com');
    const MGR2    = byEmail('tung.pham@example.com');
    const ACC1    = byEmail('accountant@example.com');
    const EMP1    = byEmail('user@example.com');
    const EMP2    = byEmail('tuan.le@example.com');
    const EMP3    = byEmail('lan.pham@example.com');
    const EMP4    = byEmail('bao.tran@example.com');
    const EMP5    = byEmail('thanh.vo@example.com');
    const EMP6    = byEmail('hung.hoang@example.com');
    const EMP7    = byEmail('kieu.nguyen@example.com');
    const EMP8    = byEmail('hong.ngo@example.com');
    const EMP9    = byEmail('khoa.dang@example.com');
    const EMP10   = byEmail('phuong.bui@example.com');

    const ALL_EMPS = [EMP1, EMP2, EMP3, EMP4, EMP5, EMP6, EMP7, EMP8, EMP9, EMP10].filter(Boolean);
    const IT_EMPS  = [EMP1, EMP2, EMP3, EMP4, EMP5].filter(Boolean);

    // ══════════════════════════════════════════════════
    // 4. HỢP ĐỒNG LAO ĐỘNG (mỗi nhân viên có 1-2 hợp đồng)
    // ══════════════════════════════════════════════════
    const contractsData = [
      // Nhân viên chính thức (đang active)
      { user_id: EMP1, contract_number: 'HD-2024-001', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 15000000, start_date: '2024-01-15', end_date: '2026-01-15', status: 'expired', created_by_hr_id: HR1 },
      { user_id: EMP1, contract_number: 'HD-2026-001', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 18000000, start_date: '2026-01-16', end_date: '2028-01-16', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP2, contract_number: 'HD-2025-001', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 20000000, start_date: '2025-03-01', end_date: '2027-03-01', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP3, contract_number: 'HD-2026-002', contract_type: 'Thử việc',    employee_type: 'Full-time', basic_salary: 12000000, start_date: '2026-03-01', end_date: '2026-06-01', status: 'expired', created_by_hr_id: HR1 },
      { user_id: EMP3, contract_number: 'HD-2026-003', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 14000000, start_date: '2026-06-02', end_date: '2028-06-02', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP4, contract_number: 'HD-2025-002', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 16000000, start_date: '2025-06-01', end_date: '2027-06-01', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP5, contract_number: 'HD-2025-003', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 22000000, start_date: '2025-09-01', end_date: '2027-09-01', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP6, contract_number: 'HD-2024-002', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 13000000, start_date: '2024-08-01', end_date: '2026-08-01', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP7, contract_number: 'HD-2026-004', contract_type: 'Thử việc',    employee_type: 'Full-time', basic_salary: 11000000, start_date: '2026-04-01', end_date: '2026-07-01', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP8, contract_number: 'HD-2025-004', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 12500000, start_date: '2025-11-01', end_date: '2027-11-01', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP9, contract_number: 'HD-2024-003', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 17000000, start_date: '2024-05-01', end_date: '2026-05-01', status: 'expired', created_by_hr_id: HR1 },
      { user_id: EMP9, contract_number: 'HD-2026-005', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 19000000, start_date: '2026-05-02', end_date: '2028-05-02', status: 'active',  created_by_hr_id: HR1 },
      { user_id: EMP10,contract_number: 'HD-2026-006', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 15500000, start_date: '2026-02-01', end_date: '2028-02-01', status: 'active',  created_by_hr_id: HR1 },
      // Staff HR và Manager cũng có hợp đồng
      { user_id: HR1,  contract_number: 'HD-2023-001', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 18000000, start_date: '2023-01-01', end_date: '2025-01-01', status: 'expired', created_by_hr_id: ADMIN },
      { user_id: HR1,  contract_number: 'HD-2025-005', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 22000000, start_date: '2025-01-02', end_date: '2027-01-02', status: 'active',  created_by_hr_id: ADMIN },
      { user_id: MGR1, contract_number: 'HD-2022-001', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 30000000, start_date: '2022-06-01', end_date: '2025-06-01', status: 'expired', created_by_hr_id: HR1 },
      { user_id: MGR1, contract_number: 'HD-2025-006', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 35000000, start_date: '2025-06-02', end_date: '2027-06-02', status: 'active',  created_by_hr_id: HR1 },
      { user_id: ACC1, contract_number: 'HD-2023-002', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 25000000, start_date: '2023-03-01', end_date: '2025-03-01', status: 'expired', created_by_hr_id: HR1 },
      { user_id: ACC1, contract_number: 'HD-2025-007', contract_type: 'Chính thức',  employee_type: 'Full-time', basic_salary: 28000000, start_date: '2025-03-02', end_date: '2027-03-02', status: 'active',  created_by_hr_id: HR1 },
    ].filter(c => c.user_id);
    await Contract.bulkCreate(contractsData);
    console.log(`  ✓ ${contractsData.length} hợp đồng lao động`);

    // ══════════════════════════════════════════════════
    // 5. QUỸ PHÉP (năm hiện tại + năm trước)
    // ══════════════════════════════════════════════════
    const year = new Date().getFullYear();
    const leaveBalances = [];
    const leaveConfig = {
      [EMP1]: { used: 5, pending: 0 }, [EMP2]: { used: 2, pending: 0 },
      [EMP3]: { used: 1, pending: 0 }, [EMP4]: { used: 3, pending: 0 },
      [EMP5]: { used: 0, pending: 1 }, [EMP6]: { used: 4, pending: 0 },
      [EMP7]: { used: 0, pending: 0 }, [EMP8]: { used: 2, pending: 0 },
      [EMP9]: { used: 6, pending: 0 }, [EMP10]:{ used: 1, pending: 0 },
      [HR1]:  { used: 3, pending: 0 }, [MGR1]: { used: 2, pending: 0 },
      [MGR2]: { used: 1, pending: 0 }, [ACC1]: { used: 0, pending: 0 },
    };
    for (const [uid, cfg] of Object.entries(leaveConfig)) {
      leaveBalances.push({ user_id: Number(uid), year, total_days: 12, used_days: cfg.used, pending_days: cfg.pending });
      leaveBalances.push({ user_id: Number(uid), year: year - 1, total_days: 12, used_days: 12, pending_days: 0 });
    }
    await LeaveBalance.bulkCreate(leaveBalances, { ignoreDuplicates: true });
    console.log(`  ✓ ${leaveBalances.length} bản ghi quỹ phép`);

    // ══════════════════════════════════════════════════
    // 6. ĐƠN XIN NGHỈ PHÉP / OT
    // ══════════════════════════════════════════════════
    const leaveRequests = [
      // Đã duyệt
      { user_id: EMP1,  type: 'leave', start_date: days(-20), end_date: days(-18), total_days: 3, reason: 'Nghỉ phép năm - Du lịch cùng gia đình',             status: 'approved', approved_by: MGR1, approved_at: new Date(Date.now() - 19*86400000) },
      { user_id: EMP1,  type: 'leave', start_date: days(-10), end_date: days(-10), total_days: 1, reason: 'Nghỉ ốm - Khám sức khỏe định kỳ',                   status: 'approved', approved_by: MGR1, approved_at: new Date(Date.now() - 9*86400000) },
      { user_id: EMP2,  type: 'leave', start_date: days(-15), end_date: days(-14), total_days: 2, reason: 'Việc cá nhân khẩn cấp',                              status: 'approved', approved_by: MGR1, approved_at: new Date(Date.now() - 14*86400000) },
      { user_id: EMP4,  type: 'ot',    start_date: days(-5),  end_date: days(-5),  total_days: 1, ot_hours: 3, reason: 'Làm thêm giờ để hoàn thành sprint deadline',  status: 'approved', approved_by: MGR1, approved_at: new Date(Date.now() - 4*86400000) },
      { user_id: EMP6,  type: 'leave', start_date: days(-30), end_date: days(-27), total_days: 4, reason: 'Kết hôn - Nghỉ chế độ',                             status: 'approved', approved_by: MGR2, approved_at: new Date(Date.now() - 26*86400000) },
      { user_id: EMP9,  type: 'leave', start_date: days(-45), end_date: days(-40), total_days: 6, reason: 'Nghỉ phép năm - Về quê thăm gia đình',              status: 'approved', approved_by: MGR1, approved_at: new Date(Date.now() - 39*86400000) },
      { user_id: HR1,   type: 'leave', start_date: days(-12), end_date: days(-10), total_days: 3, reason: 'Hội nghị nhân sự toàn quốc tại Hà Nội',            status: 'approved', approved_by: ADMIN,approved_at: new Date(Date.now() - 9*86400000) },
      // Đang chờ duyệt
      { user_id: EMP3,  type: 'leave', start_date: days(3),   end_date: days(4),   total_days: 2, reason: 'Khám bệnh và theo dõi sức khỏe định kỳ',           status: 'pending',  approved_by: null },
      { user_id: EMP5,  type: 'ot',    start_date: days(1),   end_date: days(1),   total_days: 1, ot_hours: 4, reason: 'Nghiên cứu mô hình AI mới cho dự án R&D',    status: 'pending',  approved_by: null },
      { user_id: EMP7,  type: 'leave', start_date: days(7),   end_date: days(7),   total_days: 1, reason: 'Công việc cá nhân quan trọng',                     status: 'pending',  approved_by: null },
      // Bị từ chối
      { user_id: EMP10, type: 'leave', start_date: days(-3),  end_date: days(-1),  total_days: 3, reason: 'Nghỉ phép cá nhân',                                status: 'rejected', approved_by: MGR1, approved_at: new Date(Date.now() - 2*86400000), reject_reason: 'Thời điểm cuối quý, cần đảm bảo nhân sự. Vui lòng đổi sang tuần sau.' },
      { user_id: EMP2,  type: 'ot',    start_date: days(-20), end_date: days(-20), total_days: 1, ot_hours: 5, reason: 'Muốn làm thêm giờ tự nguyện',               status: 'rejected', approved_by: MGR1, approved_at: new Date(Date.now() - 19*86400000), reject_reason: 'OT cần có nhiệm vụ cụ thể được giao, không chấp nhận OT tự phát.' },
    ].filter(r => r.user_id);
    await LeaveRequest.bulkCreate(leaveRequests);
    console.log(`  ✓ ${leaveRequests.length} đơn nghỉ phép / OT`);

    // ══════════════════════════════════════════════════
    // 7. TASKS (phân công từ Manager)
    // ══════════════════════════════════════════════════
    const tasksData = [
      // IT Team tasks
      { title: 'Xây dựng tính năng xác thực 2 lớp (2FA)',             description: 'Tích hợp Google Authenticator và SMS OTP. Đảm bảo backward compatibility với luồng đăng nhập hiện tại.', status: 'in_progress', priority: 'high',   due_date: days(7),   assigned_to_id: EMP1, assigned_by_id: MGR1 },
      { title: 'Tối ưu hoá API trả về danh sách nhân viên',           description: 'Thêm Redis caching và phân trang cursor-based. Mục tiêu giảm thời gian phản hồi xuống < 200ms.',           status: 'review',      priority: 'high',   due_date: days(3),   assigned_to_id: EMP2, assigned_by_id: MGR1 },
      { title: 'Fix bug: Layout vỡ trên trình duyệt Safari 16+',      description: 'Hàng loạt người dùng iOS báo layout bị lỗi. Ưu tiên xử lý ngay trước buổi demo cho khách hàng.',          status: 'todo',        priority: 'urgent', due_date: days(-1),  assigned_to_id: EMP1, assigned_by_id: MGR1 },
      { title: 'Thiết kế Database Schema cho module Payroll v2',       description: 'Thiết kế lại schema để hỗ trợ nhiều currency, multi-company. Cần review cùng ACC trước khi implement.',  status: 'done',        priority: 'high',   due_date: days(-5),  assigned_to_id: EMP2, assigned_by_id: MGR1 },
      { title: 'Viết unit test cho module Authentication',             description: 'Sử dụng Jest + Supertest. Target code coverage >= 85% cho tất cả các service liên quan đến auth.',        status: 'in_progress', priority: 'medium', due_date: days(14),  assigned_to_id: EMP3, assigned_by_id: MGR1 },
      { title: 'Triển khai CI/CD Pipeline với GitHub Actions',        description: 'Thiết lập workflow tự động: lint → test → build → deploy to staging khi merge vào branch main.',          status: 'todo',        priority: 'medium', due_date: days(21),  assigned_to_id: EMP4, assigned_by_id: MGR1 },
      { title: 'Nghiên cứu tích hợp AI nhận diện khuôn mặt',          description: 'Đánh giá face-api.js vs DeepFace. Viết POC (Proof of Concept) demo chạy được trên trình duyệt web.',     status: 'in_progress', priority: 'high',   due_date: days(10),  assigned_to_id: EMP5, assigned_by_id: MGR1 },
      { title: 'Viết API documentation với Swagger/OpenAPI 3.0',       description: 'Tài liệu hoá toàn bộ 45 API endpoints. Cần rõ ràng, có ví dụ request/response cho từng endpoint.',      status: 'todo',        priority: 'low',    due_date: days(30),  assigned_to_id: EMP3, assigned_by_id: MGR1 },
      { title: 'Refactor code module Leave Request',                   description: 'Code hiện tại vi phạm nguyên tắc Single Responsibility. Cần tách ra các service riêng biệt, dễ test.',   status: 'done',        priority: 'medium', due_date: days(-3),  assigned_to_id: EMP4, assigned_by_id: MGR1 },
      { title: 'Implement Dark Mode cho toàn bộ Dashboard',            description: 'Sử dụng CSS custom properties. Lưu preference của user vào localStorage. Đồng bộ với OS system theme.', status: 'cancelled',   priority: 'low',    due_date: days(-10), assigned_to_id: EMP3, assigned_by_id: MGR1 },
      // Marketing tasks
      { title: 'Lên kế hoạch chiến dịch marketing Q3/2026',          description: 'Nghiên cứu thị trường, xác định target audience và ngân sách cho các kênh: Facebook, Google, LinkedIn.', status: 'in_progress', priority: 'high',   due_date: days(5),   assigned_to_id: EMP6, assigned_by_id: MGR2 },
      { title: 'Tạo nội dung video giới thiệu sản phẩm mới',          description: '2-3 phút, format ngắn gọn súc tích. Phụ đề tiếng Anh và tiếng Việt. Upload YouTube + TikTok.',          status: 'todo',        priority: 'medium', due_date: days(12),  assigned_to_id: EMP7, assigned_by_id: MGR2 },
      { title: 'Phân tích hiệu quả chiến dịch email marketing',       description: 'Báo cáo open rate, click rate, conversion theo từng segment khách hàng. So sánh với benchmark ngành.',  status: 'done',        priority: 'medium', due_date: days(-8),  assigned_to_id: EMP6, assigned_by_id: MGR2 },
      { title: 'A/B Testing trang Landing Page',                       description: 'Test 2 phiên bản CTA button và headline. Minimum 500 user mỗi variant. Deadline report sau 2 tuần.',     status: 'review',      priority: 'high',   due_date: days(2),   assigned_to_id: EMP7, assigned_by_id: MGR2 },
      // HR tasks
      { title: 'Cập nhật chính sách lương thưởng 2026',               description: 'Rà soát và cập nhật quy chế lương theo nghị định mới của Chính phủ. Trình Ban Giám Đốc phê duyệt.',    status: 'in_progress', priority: 'high',   due_date: days(7),   assigned_to_id: EMP8, assigned_by_id: HR1  },
      { title: 'Tổ chức buổi đào tạo kỹ năng mềm Q2',                description: 'Mời chuyên gia bên ngoài. Chủ đề: Giao tiếp hiệu quả, Quản lý thời gian. 50 nhân viên tham dự.',        status: 'done',        priority: 'medium', due_date: days(-14), assigned_to_id: EMP8, assigned_by_id: HR1  },
    ].filter(t => t.assigned_to_id && t.assigned_by_id);
    await Task.bulkCreate(tasksData);
    console.log(`  ✓ ${tasksData.length} task`);

    // ══════════════════════════════════════════════════
    // 8. PHIẾU LƯƠNG (3 tháng gần nhất)
    // ══════════════════════════════════════════════════
    const salaryMap = {
      [EMP1]: 18000000, [EMP2]: 20000000, [EMP3]: 14000000,
      [EMP4]: 16000000, [EMP5]: 22000000, [EMP6]: 13000000,
      [EMP7]: 11000000, [EMP8]: 12500000, [EMP9]: 19000000,
      [EMP10]: 15500000, [HR1]: 22000000, [MGR1]: 35000000, [ACC1]: 28000000,
    };
    const payrollsData = [];
    const now = new Date();
    for (let mOffset = 3; mOffset >= 1; mOffset--) {
      const d = new Date(now.getFullYear(), now.getMonth() - mOffset, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const isLatestMonth = mOffset === 1;

      for (const [uid, base] of Object.entries(salaryMap)) {
        const ins  = Math.round(base * 0.105); // 8% BHXH + 1.5% BHYT + 1% BHTN
        const taxable = Math.max(0, base + 500000 - ins - 11000000);
        const tax  = taxable <= 5000000  ? Math.round(taxable * 0.05)
                   : taxable <= 10000000 ? Math.round(250000 + (taxable - 5000000) * 0.10)
                   : taxable <= 18000000 ? Math.round(750000 + (taxable - 10000000) * 0.15)
                   : Math.round(1950000 + (taxable - 18000000) * 0.20);
        const bonus = (mOffset === 2) ? Math.round(base * 0.1) : 0; // thưởng tháng 2
        const net   = base + 500000 + bonus - ins - tax;

        payrollsData.push({
          user_id: Number(uid),
          month: monthStr,
          base_salary: base,
          allowance: 500000,
          bonus,
          deduction: 0,
          advance: 0,
          insurance_employee: ins,
          insurance_company: Math.round(base * 0.215), // 17% BHXH + 3% BHYT + 1% BHTN công ty đóng
          tax: Math.max(0, tax),
          net_salary: Math.max(0, net),
          status: isLatestMonth ? 'approved' : 'paid',
          is_payslip_sent: !isLatestMonth,
          payment_date: isLatestMonth ? null : new Date(d.getFullYear(), d.getMonth() + 1, 5),
        });
      }
    }
    await Payroll.bulkCreate(payrollsData);
    console.log(`  ✓ ${payrollsData.length} phiếu lương (3 tháng × ${Object.keys(salaryMap).length} nhân viên)`);

    // ══════════════════════════════════════════════════
    // 9. ĐÁNH GIÁ KPI (2 tháng)
    const kpiData = [
      { user_id: EMP1, reviewer_id: MGR1, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 85, rating: 'B', comments: 'Hoàn thành 85% KPI. Tốt ở phần backend, cần cải thiện tốc độ fix bug frontend. Tiếp tục phát huy tinh thần học hỏi.' },
      { user_id: EMP2, reviewer_id: MGR1, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 96, rating: 'A', comments: 'Xuất sắc! Vượt KPI 20%. Thiết kế kiến trúc hệ thống rất chuyên nghiệp. Là tấm gương cho cả team. Xem xét thăng chức lên Senior.' },
      { user_id: EMP3, reviewer_id: MGR1, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 70, rating: 'C', comments: 'Cần cải thiện. Một số task bị trễ deadline. Kỹ năng kỹ thuật còn hạn chế, cần tham gia khóa đào tạo thêm trong Q3.' },
      { user_id: EMP4, reviewer_id: MGR1, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 88, rating: 'B', comments: 'Làm việc tốt, nhiệt tình hỗ trợ team members. Nên chủ động hơn trong việc đề xuất cải tiến quy trình.' },
      { user_id: EMP5, reviewer_id: MGR1, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 92, rating: 'A', comments: 'Nghiên cứu AI/ML rất tốt. Đề xuất giải pháp sáng tạo và khả thi. Đặc biệt ấn tượng với POC nhận diện khuôn mặt.' },
      { user_id: EMP6, reviewer_id: MGR2, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 80, rating: 'B', comments: 'Chiến dịch marketing Q2 đạt kết quả tốt. ROI vượt kỳ vọng 15%. Cần cải thiện kỹ năng báo cáo số liệu.' },
      { user_id: EMP7, reviewer_id: MGR2, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 73, rating: 'C', comments: 'Mới tham gia team, đang trong giai đoạn học việc. Cần thêm 1 tháng để đánh giá chính xác hơn.' },
      { user_id: EMP9, reviewer_id: MGR1, month: (now.getMonth() + 1) || 12, year: (now.getMonth() + 1) ? now.getFullYear() : now.getFullYear() - 1, kpi_score: 91, rating: 'A', comments: 'Kinh doanh xuất sắc! Đạt 135% chỉ tiêu doanh số Q2. Ký được 3 hợp đồng lớn với khách hàng enterprise.' },
    ];
    await PerformanceReview.bulkCreate(kpiData.filter(k => k.user_id));
    console.log(`  ✓ ${kpiData.length} đánh giá KPI`);

    // ══════════════════════════════════════════════════
    // 10. CHẤM CÔNG (30 ngày cho tất cả nhân viên)
    // ══════════════════════════════════════════════════
    const attendanceRecords = [];
    const lateEmployees = new Set([EMP3, EMP7]); // 2 người hay đi trễ
    const absentEmployees = { [EMP3]: [days(-20)], [EMP10]: [days(-15), days(-14)] };

    for (const empId of ALL_EMPS) {
      for (let i = 30; i >= 1; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (d.getDay() === 0 || d.getDay() === 6) continue;
        const dateStr = d.toISOString().split('T')[0];

        const absentDays = absentEmployees[empId] || [];
        if (absentDays.includes(dateStr)) {
          attendanceRecords.push({ user_id: empId, date: dateStr, status: 'Absent', check_in_time: null, check_out_time: null, work_hours: null });
          continue;
        }

        const isLate = lateEmployees.has(empId) && Math.random() < 0.3;
        const checkInH = isLate ? 9 : 8;
        const checkInM = isLate ? Math.floor(Math.random() * 30) : 0;
        const checkIn  = dt(dateStr, checkInH, checkInM);
        const checkOut = dt(dateStr, 17, 30 + Math.floor(Math.random() * 30));
        const workHours = parseFloat(((checkOut - checkIn) / 3600000).toFixed(2));

        attendanceRecords.push({
          user_id: empId, date: dateStr,
          status: isLate ? 'Late' : 'Present',
          check_in_time: checkIn, check_out_time: checkOut, work_hours: workHours,
        });
      }
    }
    await Attendance.bulkCreate(attendanceRecords, { ignoreDuplicates: true });
    console.log(`  ✓ ${attendanceRecords.length} bản ghi chấm công`);

    // ══════════════════════════════════════════════════
    // 11. ỨNG VIÊN TUYỂN DỤNG
    // ══════════════════════════════════════════════════
    const candidates = [
      { name: 'Nguyễn Thành Đạt',   email: 'dat.nguyen.dev@gmail.com',  phone: '0901112233', position: 'Senior Backend Developer',     skills: JSON.stringify(['Node.js','PostgreSQL','Docker','Redis','AWS']),        experience_years: 5, expected_salary: 30000000, source: 'LinkedIn', current_company: 'FPT Software',     stage: 'offer',     match_score: 4.5, created_by: HR1 },
      { name: 'Trần Thị Kim Oanh',   email: 'oanh.tran.ux@gmail.com',    phone: '0902223344', position: 'UI/UX Designer',              skills: JSON.stringify(['Figma','Adobe XD','Sketch','Prototyping','User Research']),experience_years: 3, expected_salary: 20000000, source: 'TopCV',    current_company: 'VNG Corporation',  stage: 'iv2',       match_score: 4.2, created_by: HR1 },
      { name: 'Lê Văn Phúc',         email: 'phuc.le.mobile@gmail.com',  phone: '0903334455', position: 'React Native Developer',      skills: JSON.stringify(['React Native','TypeScript','Redux','Firebase','iOS']),    experience_years: 4, expected_salary: 28000000, source: 'Referral', current_company: 'Tiki',             stage: 'iv1',       match_score: 3.8, created_by: HR1 },
      { name: 'Phạm Quang Minh',     email: 'minh.pq.devops@gmail.com',  phone: '0904445566', position: 'DevOps Engineer',             skills: JSON.stringify(['Kubernetes','Terraform','Jenkins','GCP','Linux']),         experience_years: 6, expected_salary: 35000000, source: 'LinkedIn', current_company: 'Zalo',             stage: 'screening', match_score: 4.7, created_by: HR1 },
      { name: 'Võ Thị Bảo Châu',     email: 'chau.vo.data@gmail.com',    phone: '0905556677', position: 'Data Analyst',                skills: JSON.stringify(['Python','SQL','Power BI','Tableau','Machine Learning']),   experience_years: 2, expected_salary: 18000000, source: 'Direct',   current_company: null,               stage: 'new',       match_score: 3.5, created_by: HR1 },
      { name: 'Hoàng Minh Quân',     email: 'quan.hoang.fe@gmail.com',   phone: '0906667788', position: 'Frontend Developer',          skills: JSON.stringify(['React','Next.js','TailwindCSS','TypeScript','GraphQL']),   experience_years: 3, expected_salary: 22000000, source: 'TopCV',    current_company: 'Shopee',           stage: 'hired',     match_score: 4.3, onboard_date: days(14), created_by: HR1 },
      { name: 'Đỗ Thị Lan Anh',      email: 'lananh.do.pm@gmail.com',    phone: '0907778899', position: 'Product Manager',             skills: JSON.stringify(['Agile','Scrum','Jira','Product Strategy','Data-driven']),  experience_years: 7, expected_salary: 40000000, source: 'Referral', current_company: 'MoMo',             stage: 'rejected',  match_score: 2.8, created_by: HR1 },
      { name: 'Bùi Công Thành',      email: 'thanh.bui.qa@gmail.com',    phone: '0908889900', position: 'QA Engineer',                 skills: JSON.stringify(['Selenium','Cypress','Postman','Jest','TestRail']),          experience_years: 3, expected_salary: 17000000, source: 'Direct',   current_company: 'Grab',             stage: 'iv1',       match_score: 3.9, created_by: HR1 },
      { name: 'Nguyễn Văn Thịnh',    email: 'thinh.nv.sec@gmail.com',    phone: '0909990011', position: 'Security Engineer',           skills: JSON.stringify(['Penetration Testing','OWASP','Burp Suite','Python','CTF']),  experience_years: 4, expected_salary: 32000000, source: 'LinkedIn', current_company: 'VNPT',             stage: 'screening', match_score: 4.1, created_by: HR1 },
      { name: 'Trịnh Thị Hà',        email: 'ha.trinh.mkt@gmail.com',    phone: '0901234567', position: 'Digital Marketing Specialist',skills: JSON.stringify(['Google Ads','Facebook Ads','SEO','Content Marketing','Analytics']),experience_years: 4, expected_salary: 18000000, source: 'TopCV', current_company: 'Lazada',          stage: 'offer',     match_score: 4.0, created_by: HR1 },
    ];
    await Candidate.bulkCreate(candidates);
    console.log(`  ✓ ${candidates.length} ứng viên tuyển dụng`);

    // ══════════════════════════════════════════════════
    // 12. ĐIỀU CHỈNH LƯƠNG (THƯỞNG / PHẠT)
    // ══════════════════════════════════════════════════
    const now2 = new Date();
    const m1 = new Date(now2.getFullYear(), now2.getMonth() - 1, 1);
    const m2 = new Date(now2.getFullYear(), now2.getMonth() - 2, 1);
    const mon1 = `${m1.getFullYear()}-${String(m1.getMonth()+1).padStart(2,'0')}`;
    const mon2 = `${m2.getFullYear()}-${String(m2.getMonth()+1).padStart(2,'0')}`;

    await SalaryAdjustment.bulkCreate([
      { user_id: EMP2,  entered_by: ACC1, kind: 'income',    amount: 3000000,  reason: 'Thưởng hoàn thành dự án trước deadline - Sprint 12',              apply_month: mon1, category: 'Thưởng dự án' },
      { user_id: EMP5,  entered_by: ACC1, kind: 'income',    amount: 5000000,  reason: 'Thưởng sáng kiến - POC AI nhận diện khuôn mặt được Board duyệt', apply_month: mon1, category: 'Thưởng sáng kiến' },
      { user_id: EMP9,  entered_by: ACC1, kind: 'income',    amount: 8000000,  reason: 'Hoa hồng ký hợp đồng Q2 - Khách hàng VinGroup 2 năm',            apply_month: mon1, category: 'Hoa hồng' },
      { user_id: EMP1,  entered_by: ACC1, kind: 'deduction', amount: 500000,   reason: 'Khấu trừ tạm ứng lương tháng 5/2026 (đợt 1)',                    apply_month: mon1, category: 'Khấu trừ tạm ứng' },
      { user_id: EMP3,  entered_by: ACC1, kind: 'deduction', amount: 200000,   reason: 'Phạt đi muộn 4 lần trong tháng theo nội quy công ty',            apply_month: mon2, category: 'Phạt nội quy' },
      { user_id: EMP6,  entered_by: ACC1, kind: 'income',    amount: 2000000,  reason: 'Thưởng hoàn thành mục tiêu chiến dịch marketing Q1/2026',        apply_month: mon2, category: 'Thưởng KPI' },
      { user_id: MGR1,  entered_by: ACC1, kind: 'income',    amount: 10000000, reason: 'Thưởng quản lý xuất sắc Q2 - Team IT hoàn thành 95% roadmap',    apply_month: mon1, category: 'Thưởng quản lý' },
    ].filter(a => a.user_id));
    console.log(`  ✓ 7 khoản điều chỉnh lương`);

    // ══════════════════════════════════════════════════
    // 13. TẠM ỨNG LƯƠNG
    // ══════════════════════════════════════════════════
    const AdvReq = require('../models/AdvanceRequest');
    await AdvReq.bulkCreate([
      { user_id: EMP1,  amount: 5000000,  reason: 'Cần tiền mua máy tính cá nhân phục vụ công việc remote',      status: 'approved', reviewed_by: ACC1, reviewed_at: new Date(Date.now() - 20*86400000), repay_month: mon1 },
      { user_id: EMP4,  amount: 3000000,  reason: 'Chi phí chữa bệnh đột xuất cho người thân',                   status: 'approved', reviewed_by: ACC1, reviewed_at: new Date(Date.now() - 15*86400000), repay_month: mon1 },
      { user_id: EMP8,  amount: 2000000,  reason: 'Đặt vé máy bay về quê dự đám giỗ',                            status: 'rejected', reviewed_by: ACC1, reviewed_at: new Date(Date.now() - 10*86400000), review_note: 'Tạm ứng chỉ dành cho trường hợp khẩn cấp y tế hoặc công tác.' },
      { user_id: EMP6,  amount: 4000000,  reason: 'Sửa chữa xe máy - phương tiện đi làm hàng ngày',              status: 'pending',  reviewed_by: null },
      { user_id: EMP10, amount: 6000000,  reason: 'Đặt cọc thuê nhà - chuyển chỗ ở gần công ty hơn',             status: 'pending',  reviewed_by: null },
    ].filter(a => a.user_id));
    console.log(`  ✓ 5 yêu cầu tạm ứng lương`);

    console.log('\n🎉 Tạo dữ liệu mẫu hoàn tất! Hệ thống sẵn sàng sử dụng.\n');
  } catch (error) {
    console.error('✗ Lỗi khi tạo dữ liệu mẫu:', error.message);
    if (error.errors) {
      console.error('Chi tiết lỗi validation:', JSON.stringify(error.errors.map(e => ({ message: e.message, type: e.type, path: e.path, value: e.value })), null, 2));
    }
    console.error(error.stack);
  }
}

module.exports = seedData;
