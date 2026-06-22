const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveBalance = sequelize.define(
  'LeaveBalance',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 12,
    },
    used_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    pending_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'leave_balances',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'year'],
      },
    ],
  }
);

module.exports = LeaveBalance;
