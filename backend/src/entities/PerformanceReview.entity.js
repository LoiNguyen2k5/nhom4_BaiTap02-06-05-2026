const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerformanceReview = sequelize.define('PerformanceReview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false,
  },
  kpi_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'performance_reviews',
  timestamps: true,
});

module.exports = PerformanceReview;
