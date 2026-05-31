const User = require('./User');
const Profile = require('./Profile');
const OTP = require('./OTP');
const Department = require('./Department');
const ActivityLog = require('./ActivityLog');
const TaxInsuranceConfig = require('./TaxInsuranceConfig');
const Candidate = require('./Candidate');
const AccountRequest = require('./AccountRequest');
const Contract = require('./Contract');

// Define Associations
// 1 Phòng ban có nhiều Nhân viên
Department.hasMany(User, {
  foreignKey: 'department_id',
  as: 'users'
});

// 1 Nhân viên thuộc về 1 Phòng ban
User.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'department'
});

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

User.hasMany(ActivityLog, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

ActivityLog.belongsTo(User, {
  foreignKey: 'user_id'
});

const AccountRequest = require('./AccountRequest');
const Contract = require('./Contract');

// User and AccountRequest
User.hasMany(AccountRequest, { foreignKey: 'hr_id', as: 'account_requests' });
AccountRequest.belongsTo(User, { foreignKey: 'hr_id', as: 'hr' });

// Department and AccountRequest
Department.hasMany(AccountRequest, { foreignKey: 'department_id', as: 'account_requests' });
AccountRequest.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// User and Contract
User.hasMany(Contract, { foreignKey: 'user_id', as: 'contracts' });
Contract.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Contract, { foreignKey: 'created_by_hr_id', as: 'created_contracts' });
Contract.belongsTo(User, { foreignKey: 'created_by_hr_id', as: 'hr' });

module.exports = {
  User,
  Profile,
  OTP,
  Department,
  ActivityLog,
  TaxInsuranceConfig,
  Candidate,
  AccountRequest,
  Contract,
};
