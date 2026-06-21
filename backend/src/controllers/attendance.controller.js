const { Attendance, AttendanceLock } = require('../models');
const { Op } = require('sequelize');

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    // Chuyển về giờ địa phương dạng YYYY-MM-DD để query (ở VN timezone +7)
    // Tạm dùng múi giờ UTC hoặc server time
    const dateStr = today.toISOString().split('T')[0];
    const currentMonth = dateStr.substring(0, 7); // e.g. "2026-06"

    // Kiểm tra xem tháng hiện tại có bị chốt/khóa chưa
    const isLocked = await AttendanceLock.findOne({ where: { month: currentMonth } });
    if (isLocked) {
      return res.status(400).json({ success: false, message: `Bảng công tháng ${currentMonth} đã bị khóa, không thể chấm công!` });
    }

    // Kiểm tra đã check-in hôm nay chưa
    let attendance = await Attendance.findOne({
      where: {
        user_id: userId,
        date: dateStr
      }
    });

    if (attendance && attendance.check_in_time) {
      return res.status(400).json({ success: false, message: 'Bạn đã check-in trong ngày hôm nay rồi!' });
    }

    // Nếu chưa có record thì tạo mới
    if (!attendance) {
      attendance = await Attendance.create({
        user_id: userId,
        date: dateStr,
        check_in_time: today,
        status: 'Present' // Mặc định, có thể xử lý Late nếu cần
      });
    } else {
      // Đã có record (ví dụ được tạo trước do OnLeave, nhưng user lại đi làm)
      attendance.check_in_time = today;
      attendance.status = 'Present';
      await attendance.save();
    }

    res.status(200).json({ success: true, message: 'Check-in thành công!', data: attendance });
  } catch (error) {
    console.error('Lỗi Check-in:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi check-in' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const currentMonth = dateStr.substring(0, 7); // e.g. "2026-06"

    // Kiểm tra xem tháng hiện tại có bị chốt/khóa chưa
    const isLocked = await AttendanceLock.findOne({ where: { month: currentMonth } });
    if (isLocked) {
      return res.status(400).json({ success: false, message: `Bảng công tháng ${currentMonth} đã bị khóa, không thể chấm công!` });
    }

    const attendance = await Attendance.findOne({
      where: {
        user_id: userId,
        date: dateStr
      }
    });

    if (!attendance || !attendance.check_in_time) {
      return res.status(400).json({ success: false, message: 'Bạn chưa check-in trong ngày hôm nay!' });
    }

    if (attendance.check_out_time) {
      return res.status(400).json({ success: false, message: 'Bạn đã check-out trong ngày hôm nay rồi!' });
    }

    attendance.check_out_time = today;
    
    // Tính toán số giờ làm việc (ms -> giờ)
    const diffMs = today - new Date(attendance.check_in_time);
    const workHours = diffMs / (1000 * 60 * 60);
    attendance.work_hours = parseFloat(workHours.toFixed(2));

    await attendance.save();

    res.status(200).json({ success: true, message: 'Check-out thành công!', data: attendance });
  } catch (error) {
    console.error('Lỗi Check-out:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi check-out' });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendances = await Attendance.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
      limit: 30 // Lấy 30 ngày gần nhất
    });

    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    console.error('Lỗi lấy lịch sử:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch sử chấm công' });
  }
};
