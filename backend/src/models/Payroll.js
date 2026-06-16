const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payroll = sequelize.define(
  'Payroll',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    base_salary: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    allowances: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    bonuses: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    deductions: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    insurance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    net_salary: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('draft', 'calculated', 'approved', 'paid'),
      defaultValue: 'draft',
    },
    is_payslip_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'payrolls',
    timestamps: true,
  }
);

module.exports = Payroll;
