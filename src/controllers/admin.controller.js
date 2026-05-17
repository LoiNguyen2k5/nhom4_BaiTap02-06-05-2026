const { Op } = require('sequelize');
const { User } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const { search, role, status, department, created_from, created_to } = req.query;

    const whereClause = {};

    // Tìm kiếm theo tên hoặc email
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Lọc theo role
    if (role) {
      whereClause.role = role;
    }

    // Lọc theo trạng thái (tương đương status / is_active)
    // Lưu ý: database model User.js dùng 'status' ENUM('inactive', 'active')
    if (status) {
      whereClause.status = status;
    }

    // Lọc theo phòng ban
    if (department) {
      whereClause.department = department;
    }

    // Lọc theo ngày tạo
    if (created_from || created_to) {
      whereClause.created_at = {};
      if (created_from) {
        whereClause.created_at[Op.gte] = new Date(created_from);
      }
      if (created_to) {
        // Cộng thêm 1 ngày để bao gồm trọn vẹn ngày created_to
        const toDate = new Date(created_to);
        toDate.setHours(23, 59, 59, 999);
        whereClause.created_at[Op.lte] = toDate;
      }
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] }, // Không trả về password
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
