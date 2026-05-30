const { User, Profile, AccountRequest, Contract, Department } = require('../models');
const { logActivity } = require('../utils/activityLogger');
const bcrypt = require('bcrypt');

// ==========================================
// QUẢN LÝ YÊU CẦU CẤP TÀI KHOẢN (ACCOUNT REQUESTS)
// ==========================================

exports.createAccountRequest = async (req, res) => {
  try {
    const { email, full_name, role, department_id } = req.body;
    const hr_id = req.user.id;

    if (!email || !full_name) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và họ tên' });
    }

    // Check if email already exists in users table
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email này đã có tài khoản trong hệ thống' });
    }

    // Check if there is already a pending request for this email
    const existingRequest = await AccountRequest.findOne({ where: { email, status: 'pending' } });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Đã có yêu cầu đang chờ duyệt cho email này' });
    }

    const newRequest = await AccountRequest.create({
      hr_id,
      email,
      full_name,
      role: role || 'employee',
      department_id: department_id || null,
      status: 'pending'
    });

    await logActivity({
      userId: hr_id,
      action: 'Tạo yêu cầu cấp tài khoản',
      detail: `Gửi yêu cầu tạo tài khoản cho ${email}`
    });

    res.status(201).json({ success: true, message: 'Đã gửi yêu cầu cấp tài khoản cho Admin', data: newRequest });
  } catch (error) {
    console.error('Lỗi khi tạo account request:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getMyAccountRequests = async (req, res) => {
  try {
    const hr_id = req.user.id;
    const requests = await AccountRequest.findAll({
      where: { hr_id },
      include: [
        { model: Department, as: 'department', attributes: ['name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('Lỗi khi lấy account requests:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ==========================================
// CẬP NHẬT HỒ SƠ NHÂN VIÊN (THĂNG CHỨC / ĐỔI PHÒNG BAN)
// ==========================================

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, department_id, full_name, phone, address } = req.body;
    const hr_id = req.user.id;

    const user = await User.findByPk(id, { include: [{ model: Profile }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
    }

    // Update User level info
    let userUpdated = false;
    if (role && role !== user.role) {
      user.role = role;
      userUpdated = true;
    }
    if (department_id !== undefined && department_id !== user.department_id) {
      user.department_id = department_id || null;
      userUpdated = true;
    }
    if (userUpdated) await user.save();

    // Update Profile level info
    if (user.Profile) {
      let profileUpdated = false;
      if (full_name !== undefined) { user.Profile.full_name = full_name; profileUpdated = true; }
      if (phone !== undefined) { user.Profile.phone = phone; profileUpdated = true; }
      if (address !== undefined) { user.Profile.address = address; profileUpdated = true; }
      if (profileUpdated) await user.Profile.save();
    } else if (full_name || phone || address) {
      // If profile doesn't exist, create it
      await Profile.create({
        user_id: id,
        full_name,
        phone,
        address
      });
    }

    await logActivity({
      userId: hr_id,
      action: 'Cập nhật hồ sơ nhân viên',
      detail: `Cập nhật thông tin cho tài khoản ${user.email}`
    });

    res.status(200).json({ success: true, message: 'Cập nhật hồ sơ thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật hồ sơ:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ==========================================
// QUẢN LÝ HỢP ĐỒNG (CONTRACTS)
// ==========================================

exports.createContract = async (req, res) => {
  try {
    const { user_id, contract_type, basic_salary, start_date, end_date } = req.body;
    const hr_id = req.user.id;

    if (!user_id || !basic_salary || !start_date) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' });
    }

    // Kiểm tra xem user này có hợp đồng active không
    const activeContract = await Contract.findOne({ where: { user_id, status: 'active' } });
    if (activeContract) {
      return res.status(400).json({ success: false, message: 'Nhân viên này đang có hợp đồng hiệu lực. Vui lòng gia hạn hoặc chấm dứt hợp đồng cũ trước.' });
    }

    const newContract = await Contract.create({
      user_id,
      contract_type: contract_type || 'Chính thức',
      basic_salary,
      start_date,
      end_date: end_date || null,
      status: 'active',
      created_by_hr_id: hr_id
    });

    await logActivity({
      userId: hr_id,
      action: 'Tạo hợp đồng',
      detail: `Tạo hợp đồng ${contract_type} cho User ID ${user_id}`
    });

    res.status(201).json({ success: true, message: 'Tạo hợp đồng thành công', data: newContract });
  } catch (error) {
    console.error('Lỗi khi tạo hợp đồng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: User, as: 'hr', attributes: ['name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    console.error('Lỗi khi lấy hợp đồng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.renewContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { contract_type, basic_salary, start_date, end_date } = req.body;
    const hr_id = req.user.id;

    const oldContract = await Contract.findByPk(id);
    if (!oldContract) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hợp đồng' });
    }

    if (oldContract.status === 'terminated') {
      return res.status(400).json({ success: false, message: 'Không thể gia hạn hợp đồng đã chấm dứt' });
    }

    // Đóng hợp đồng cũ
    oldContract.status = 'expired';
    await oldContract.save();

    // Tạo hợp đồng mới
    const newContract = await Contract.create({
      user_id: oldContract.user_id,
      contract_type: contract_type || oldContract.contract_type,
      basic_salary: basic_salary || oldContract.basic_salary,
      start_date: start_date,
      end_date: end_date || null,
      status: 'active',
      created_by_hr_id: hr_id
    });

    await logActivity({
      userId: hr_id,
      action: 'Gia hạn hợp đồng',
      detail: `Gia hạn hợp đồng cho User ID ${oldContract.user_id}`
    });

    res.status(201).json({ success: true, message: 'Gia hạn hợp đồng thành công', data: newContract });
  } catch (error) {
    console.error('Lỗi khi gia hạn hợp đồng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
