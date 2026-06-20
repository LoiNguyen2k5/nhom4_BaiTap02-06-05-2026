const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalaryAdjustment = sequelize.define(
  'SalaryAdjustment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Loại: 'income' = thu nhập thêm, 'deduction' = khấu trừ
    kind: {
      type: DataTypes.ENUM('income', 'deduction'),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    // Loại khoản (VD: Thưởng dự án, Phạt đi trễ...)
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // Tháng áp dụng: định dạng "YYYY-MM" (VD: "2026-05")
    apply_month: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Lặp lại hàng tháng
    recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // Trạng thái: 'pending' | 'applied'
    status: {
      type: DataTypes.ENUM('pending', 'applied'),
      allowNull: false,
      defaultValue: 'pending',
    },
    // Kế toán nhập khoản này
    entered_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
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
    tableName: 'salary_adjustments',
    timestamps: false,
  }
);

module.exports = SalaryAdjustment;
