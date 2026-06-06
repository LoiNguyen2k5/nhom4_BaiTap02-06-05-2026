const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Bảng lưu quỹ ngày phép của từng nhân viên theo từng năm.
// Mỗi nhân viên có đúng 1 dòng cho mỗi năm (ràng buộc unique ở dưới cùng).
const LeaveBalance = sequelize.define(
  'LeaveBalance',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Liên kết đến nhân viên nào, xóa nhân viên thì xóa luôn quỹ phép
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },

    // Năm áp dụng — mỗi năm tạo 1 record mới, VD: 2024, 2025
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Tổng ngày phép được cấp trong năm — mặc định 12 ngày, Admin có thể điều chỉnh
    total_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 12,
    },

    // Số ngày đã thực sự nghỉ — chỉ cộng vào khi đơn nghỉ được Manager DUYỆT
    used_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    // Số ngày đang bị "khóa" bởi đơn CHƯA duyệt (pending).
    // Mục đích: tránh nhân viên gửi nhiều đơn cùng lúc vượt quá quỹ phép.
    // Luồng: gửi đơn → pending_days tăng | duyệt đơn → pending về 0, used tăng | từ chối → pending về 0
    pending_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'leave_balances',
    // không tư động tạo thêm 2 thuộc tính là createdAt và updatedAt
    timestamps: false,

    // quy tắc 
    indexes: [
      {
        // Ràng buộc: 1 nhân viên chỉ được có đúng 1 record quỹ phép cho mỗi năm
        unique: true, // không được phép trùng 
        fields: ['user_id', 'year'], // 2 cột có áp dụng quy tắc trên 
      },
    ],
  }
);

module.exports = LeaveBalance;
