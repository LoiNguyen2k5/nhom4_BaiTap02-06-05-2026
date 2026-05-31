const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contract = sequelize.define(
  'Contract',
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
    contract_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    contract_type: {
      type: DataTypes.ENUM('Thử việc', 'Chính thức', 'Thời vụ'),
      defaultValue: 'Chính thức',
    },
    basic_salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'terminated'),
      defaultValue: 'active',
    },
    created_by_hr_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'contracts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Contract;
