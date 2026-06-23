const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobPosting = sequelize.define(
  'JobPosting',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    title: { type: DataTypes.STRING(150), allowNull: false },
    department: { type: DataTypes.STRING(100), allowNull: true },
    location: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    requirements: { type: DataTypes.TEXT, allowNull: true },
    salary_range: { type: DataTypes.STRING(100), allowNull: true },

    employment_type: {
      type: DataTypes.ENUM('fulltime', 'parttime', 'internship'),
      defaultValue: 'fulltime',
    },

    deadline: { type: DataTypes.DATEONLY, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    created_by: { type: DataTypes.INTEGER, allowNull: true },

    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'job_postings',
    timestamps: false,
  }
);

module.exports = JobPosting;
