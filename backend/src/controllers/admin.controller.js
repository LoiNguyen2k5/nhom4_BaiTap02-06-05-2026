const { Op } = require('sequelize');
const User = require('../models/User');

// ============================================================
// DASHBOARD ADMIN — Thống kê tổng quan
// GET /api/admin/dashboard
// ============================================================
const getDashboardStats = async (req, res) => {
  try {
    // Xác định ngày đầu tháng hiện tại (để đếm tài khoản mới trong tháng)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Bước 1: Đếm tổng số tài khoản trong hệ thống
    const totalUsers = await User.count();

    // Bước 2: Đếm số tài khoản đang active
    const activeUsers = await User.count({
      where: { status: 'active' },
    });

    // Bước 3: Đếm số tài khoản bị khóa (inactive)
    const lockedUsers = await User.count({
      where: { status: 'inactive' },
    });

    // Bước 4: Đếm số tài khoản được tạo trong tháng này
    const newUsersThisMonth = await User.count({
      where: {
        created_at: {
          [Op.gte]: startOfMonth, // >= ngày đầu tháng
        },
      },
    });

    // Bước 5: Lấy 5 tài khoản được tạo gần đây nhất
    const recentUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5,
    });

    // Trả về JSON cho frontend
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        lockedUsers,
        newUsersThisMonth,
        recentUsers,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy dữ liệu dashboard',
    });
  }
};

module.exports = { getDashboardStats };
