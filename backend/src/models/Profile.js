const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define(
  'Profile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bank_account_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank_account_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    face_descriptor: {
      type: DataTypes.TEXT, // Lưu chuỗi JSON 128 số
      allowNull: true,
    },
  },
  {
    tableName: 'profiles',
    timestamps: false,
  }
);

module.exports = Profile;
