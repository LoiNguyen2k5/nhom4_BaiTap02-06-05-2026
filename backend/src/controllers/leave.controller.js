const { LeaveBalance, LeaveRequest } = require('../models');
const { Op } = require('sequelize');

// ==========================================
// API DÀNH CHO NHÂN VIÊN (EMPLOYEE)
// ==========================================

// 1. Lấy thông tin Quỹ phép của tôi trong năm nay
exports.getMyLeaveBalance = async (req, res) => {
  try {
    const userId = req.user.id; // ID nhân viên lấy từ token đăng nhập
    const currentYear = new Date().getFullYear();

    // Tìm quỹ phép của nhân viên này trong năm nay
    let balance = await LeaveBalance.findOne({
      where: { user_id: userId, year: currentYear }
    });

    // Tự động cấp quỹ phép nếu đầu năm nhân viên chưa có
    if (!balance) {
      balance = await LeaveBalance.create({
        user_id: userId,
        year: currentYear,
        total_days: 12, // Mặc định mỗi năm có 12 ngày phép
        used_days: 0,
        pending_days: 0
      });
    }

    res.status(200).json({ success: true, data: balance });
  } catch (error) {
    console.error('Lỗi khi lấy quỹ phép:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 2. Nhân viên nộp đơn xin nghỉ phép hoặc xin OT
exports.createLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    // Lấy thông tin từ form người dùng gửi lên
    const { type, start_date, end_date, total_days, ot_hours, reason } = req.body;

    // Ràng buộc cơ bản
    if (!type || !start_date || !end_date || !reason) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // XỬ LÝ RIÊNG NẾU LÀ ĐƠN XIN NGHỈ PHÉP (LEAVE)
    if (type === 'leave') {
      if (!total_days || total_days <= 0) {
        return res.status(400).json({ success: false, message: 'Số ngày nghỉ không hợp lệ' });
      }

      const currentYear = new Date(start_date).getFullYear();

      // Lấy quỹ phép của năm đó ra để kiểm tra
      let balance = await LeaveBalance.findOne({ where: { user_id: userId, year: currentYear } });
      if (!balance) {
        balance = await LeaveBalance.create({ user_id: userId, year: currentYear, total_days: 12 });
      }

      // Công thức: Số ngày CÒN LẠI = Tổng cấp - (Đã dùng + Đang chờ duyệt)
      const remainingDays = balance.total_days - (balance.used_days + balance.pending_days);

      // Nếu số ngày xin nghỉ lớn hơn số ngày còn lại -> Từ chối ngay lập tức
      if (total_days > remainingDays) {
        return res.status(400).json({
          success: false,
          message: `Không đủ ngày phép. Bạn chỉ còn ${remainingDays} ngày có thể sử dụng.`
        });
      }

      // Nếu đủ ngày -> Lưu số ngày này vào mục pending (tạm khóa lại)
      balance.pending_days += parseFloat(total_days);
      await balance.save();
    }

    // XỬ LÝ RIÊNG NẾU LÀ ĐƠN OT
    if (type === 'ot') {
      if (!ot_hours || ot_hours <= 0) {
        return res.status(400).json({ success: false, message: 'Số giờ OT không hợp lệ' });
      }
      // Đơn OT thì không trừ quỹ phép nên không cần kiểm tra LeaveBalance
    }

    // Lưu lá đơn vào Database
    const newRequest = await LeaveRequest.create({
      user_id: userId,
      type,
      start_date,
      end_date,
      total_days: type === 'leave' ? total_days : 0, // Chỉ lưu total_days nếu là leave
      ot_hours: type === 'ot' ? ot_hours : null,     // Chỉ lưu ot_hours nếu là ot
      reason,
      status: 'pending' // Mặc định là chờ sếp duyệt
    });

    res.status(201).json({ success: true, message: 'Đã gửi đơn thành công', data: newRequest });
  } catch (error) {
    console.error('Lỗi khi nộp đơn:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 3. Nhân viên xem lại lịch sử các lá đơn mình đã nộp
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Tìm tất cả lá đơn do user này tạo, sắp xếp mới nhất lên đầu
    const requests = await LeaveRequest.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
