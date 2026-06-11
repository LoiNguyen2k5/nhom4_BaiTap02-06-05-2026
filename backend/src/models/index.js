const User = require('./User');
const Profile = require('./Profile');
const OTP = require('./OTP');
const Department = require('./Department');
const ActivityLog = require('./ActivityLog');
const TaxInsuranceConfig = require('./TaxInsuranceConfig');
const Candidate = require('./Candidate');
const AccountRequest = require('./AccountRequest');
const Contract = require('./Contract');
const LeaveBalance = require('./LeaveBalance');
const LeaveRequest = require('./LeaveRequest');
const Task = require('./Task');

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

// ==========================================
// QUẢN LÝ NGHỈ PHÉP & OT (TIME & ATTENDANCE)
// ==========================================

// 1. Quan hệ giữa User và LeaveBalance (Nhân viên - Quỹ phép)
User.hasMany(LeaveBalance, { foreignKey: 'user_id', as: 'leave_balances' });
LeaveBalance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 2. Quan hệ giữa User và LeaveRequest (Nhân viên - Đơn xin nghỉ)
User.hasMany(LeaveRequest, { foreignKey: 'user_id', as: 'leave_requests' });
LeaveRequest.belongsTo(User, { foreignKey: 'user_id', as: 'requester' });

// 3. Quan hệ giữa LeaveRequest và Quản lý duyệt đơn
User.hasMany(LeaveRequest, { foreignKey: 'approved_by', as: 'approved_requests' });
LeaveRequest.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

// User and Task
User.hasMany(Task, { foreignKey: 'assigned_to_id', as: 'assigned_tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to_id', as: 'assignee' });

User.hasMany(Task, { foreignKey: 'assigned_by_id', as: 'created_tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_by_id', as: 'assigner' });

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
  LeaveBalance,
  LeaveRequest,
  Task,
};
