const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttendanceLock = sequelize.define('AttendanceLock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  month: {
    type: DataTypes.STRING(7), // YYYY-MM
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'locked'),
    defaultValue: 'locked'
  },
  locked_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'attendance_locks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AttendanceLock;
