const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdvanceRequest = sequelize.define(
  'AdvanceRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Mã đơn tự sinh VD: ADV-2026-0001
    code: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true,
    },
    // Nhân viên yêu cầu
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    // Số tiền yêu cầu (VNĐ)
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // Lương tháng hiện tại (snapshot tại thời điểm gửi)
    monthly_salary: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // Hạn mức đã dùng trong năm
    yearly_advanced: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    // Hạn mức tối đa trong năm
    yearly_limit: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // Lý do
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Đánh dấu khẩn cấp
    urgent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // Trạng thái: pending | approved | rejected | deducting | completed
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'deducting', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    // Phương thức khấu trừ: 'full' | 'split'
    deduct_method: {
      type: DataTypes.ENUM('full', 'split'),
      allowNull: true,
    },
    // Số tháng chia khấu trừ (khi method = split)
    deduct_months: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Ngày dự kiến chi tiền
    disburse_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Kế toán duyệt/từ chối
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    // Lý do từ chối
    reject_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Số tiền đã khấu trừ thực tế
    deducted_so_far: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'advance_requests',
    timestamps: false,
  }
);

module.exports = AdvanceRequest;
