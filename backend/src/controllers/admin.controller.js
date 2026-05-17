const User = require('../models/User');
const Profile = require('../models/Profile');

// Lấy danh sách user kèm profile (admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [Profile],
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

// Lấy user + profile theo ID (admin)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });

    const profile = await Profile.findOne({ where: { user_id: userId } });

    return res.status(200).json({ success: true, data: { user, profile } });
  } catch (error) {
    console.error('Get User By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin người dùng' });
  }
};

// Cập nhật trạng thái (active/inactive)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // expected 'active' or 'inactive'
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });

    await user.update({ status });
    return res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: { user } });
  } catch (error) {
    console.error('Update User Status Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái' });
  }
};

// Cập nhật role (user/admin)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body; // expected 'user' or 'admin'
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role không hợp lệ' });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });

    await user.update({ role });
    return res.status(200).json({ success: true, message: 'Cập nhật role thành công', data: { user } });
  } catch (error) {
    console.error('Update User Role Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật role' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
};
