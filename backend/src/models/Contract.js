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
      allowNull: false,
      unique: true,
    },
    contract_type: {
      type: DataTypes.ENUM('probation', 'official'),
      allowNull: false,
      defaultValue: 'probation', // 'probation' = Thử việc, 'official' = Chính thức
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    basic_salary: {
      type: DataTypes.INTEGER, // Có thể dùng BIGINT hoặc DECIMAL nếu lương lớn, dùng INT tạm cho VND
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'terminated'),
      allowNull: false,
      defaultValue: 'active',
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
    tableName: 'contracts',
    timestamps: false,
  }
);

module.exports = Contract;
