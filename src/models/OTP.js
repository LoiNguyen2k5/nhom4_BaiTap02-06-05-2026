const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTP = sequelize.define(
  'OTP',
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
    otp_code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('register', 'forgot_password'),
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'otps',
    timestamps: false,
  }
);

module.exports = OTP;
