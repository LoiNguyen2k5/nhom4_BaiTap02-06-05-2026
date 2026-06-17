const { SalaryAdjustment, User, Profile } = require('../models');
const { Op } = require('sequelize');

// ── helpers ───────────────────────────────────────────────────────────────────
const employeeInclude = {
  model: User,
  as: 'employee',
  attributes: ['id', 'name', 'email'],
  include: [
    {
      model: Profile,
      attributes: ['job_title', 'department'],
    },
  ],
};

const enteredByInclude = {
  model: User,
  as: 'enteredBy',
  attributes: ['id', 'name'],
};

// ── GET /api/adjustments ──────────────────────────────────────────────────────
// Query: kind, apply_month, status, search (tên nhân viên)
exports.getAll = async (req, res) => {
  try {
    const { kind, apply_month, status, search } = req.query;

    const where = {};
    if (kind) where.kind = kind;
    if (apply_month) where.apply_month = apply_month;
    if (status) where.status = status;

    // Lọc theo tên nhân viên cần dùng HAVING / subquery — dùng cách đơn giản: lấy all rồi filter ở JS
    const rows = await SalaryAdjustment.findAll({
      where,
      include: [employeeInclude, enteredByInclude],
      order: [['created_at', 'DESC']],
    });

    // Lọc theo search (tên nhân viên)
    const filtered = search
      ? rows.filter((r) =>
          r.employee?.name?.toLowerCase().includes(search.toLowerCase())
        )
      : rows;

    return res.json({ success: true, data: filtered });
  } catch (err) {
    console.error('getAll adjustments error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ── POST /api/adjustments ─────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { kind, user_id, category, amount, apply_month, reason, recurring } =
      req.body;

    // Validate bắt buộc
    if (!kind || !user_id || !category || !amount || !apply_month) {
      return res
        .status(400)
        .json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }
    if (!['income', 'deduction'].includes(kind)) {
      return res.status(400).json({ success: false, message: 'kind phải là income hoặc deduction' });
    }
    // apply_month: YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(apply_month)) {
      return res.status(400).json({ success: false, message: 'apply_month phải có định dạng YYYY-MM' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền phải lớn hơn 0' });
    }

    // Kiểm tra user tồn tại
    const targetUser = await User.findByPk(user_id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Nhân viên không tồn tại' });
    }

    const adj = await SalaryAdjustment.create({
      kind,
      user_id,
      category,
      amount: Number(amount),
      apply_month,
      reason: reason || null,
      recurring: !!recurring,
      status: 'pending',
      entered_by: req.user?.id || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Trả về bản ghi kèm thông tin nhân viên
    const result = await SalaryAdjustment.findByPk(adj.id, {
      include: [employeeInclude, enteredByInclude],
    });

    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('create adjustment error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ── PATCH /api/adjustments/:id/status ────────────────────────────────────────
// Áp dụng hoặc thu hồi khoản (applied <-> pending)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'applied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'status không hợp lệ' });
    }

    const adj = await SalaryAdjustment.findByPk(id);
    if (!adj) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản' });
    }

    await adj.update({ status, updated_at: new Date() });

    return res.json({ success: true, data: adj });
  } catch (err) {
    console.error('updateStatus adjustment error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ── DELETE /api/adjustments/:id ───────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const adj = await SalaryAdjustment.findByPk(id);
    if (!adj) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản' });
    }
    if (adj.status === 'applied') {
      return res
        .status(400)
        .json({ success: false, message: 'Không thể xóa khoản đã áp dụng vào bảng lương' });
    }
    await adj.destroy();
    return res.json({ success: true, message: 'Đã xóa khoản thành công' });
  } catch (err) {
    console.error('remove adjustment error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ── GET /api/adjustments/employees ───────────────────────────────────────────
// Lấy danh sách nhân viên để chọn khi tạo khoản
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: { [Op.in]: ['employee', 'user', 'manager', 'accountant', 'hr'] } },
      attributes: ['id', 'name', 'email'],
      include: [{ model: Profile, attributes: ['job_title', 'department'] }],
      order: [['name', 'ASC']],
    });
    return res.json({ success: true, data: employees });
  } catch (err) {
    console.error('getEmployees error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
