const User = require('./User');
const Profile = require('./Profile');
const OTP = require('./OTP');
const Contract = require('./Contract');

// Define Associations
User.hasOne(Profile, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Profile.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(OTP, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

OTP.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(Contract, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Contract.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = {
  User,
  Profile,
  OTP,
  Contract
};
