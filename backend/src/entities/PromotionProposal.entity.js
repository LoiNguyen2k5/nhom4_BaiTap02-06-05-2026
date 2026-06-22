const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PromotionProposal = sequelize.define('PromotionProposal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  proposed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  current_position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  proposed_position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
  },
}, {
  tableName: 'promotion_proposals',
  timestamps: true,
});

module.exports = PromotionProposal;
