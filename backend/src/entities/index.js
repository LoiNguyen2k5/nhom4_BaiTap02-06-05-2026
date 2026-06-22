const User = require('./User.entity');
const Profile = require('./Profile.entity');
const OTP = require('./OTP.entity');
const Department = require('./Department.entity');
const ActivityLog = require('./ActivityLog.entity');
const TaxInsuranceConfig = require('./TaxInsuranceConfig.entity');
const Candidate = require('./Candidate.entity');
const AccountRequest = require('./AccountRequest.entity');
const Contract = require('./Contract.entity');
const LeaveBalance = require('./LeaveBalance.entity');
const LeaveRequest = require('./LeaveRequest.entity');
const Task = require('./Task.entity');
const Attendance = require('./Attendance.entity');
const PerformanceReview = require('./PerformanceReview.entity');
const PromotionProposal = require('./PromotionProposal.entity');
const Payroll = require('./Payroll.entity');
const SalaryAdjustment = require('./SalaryAdjustment.entity');
const AdvanceRequest = require('./AdvanceRequest.entity');
const AttendanceLock = require('./AttendanceLock.entity');

// Define Associations
Department.hasMany(User, {
  foreignKey: 'department_id',
  as: 'users'
});

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

User.hasMany(AccountRequest, { foreignKey: 'hr_id', as: 'account_requests' });
AccountRequest.belongsTo(User, { foreignKey: 'hr_id', as: 'hr' });

Department.hasMany(AccountRequest, { foreignKey: 'department_id', as: 'account_requests' });
AccountRequest.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

User.hasMany(Contract, { foreignKey: 'user_id', as: 'contracts' });
Contract.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Contract, { foreignKey: 'created_by_hr_id', as: 'created_contracts' });
Contract.belongsTo(User, { foreignKey: 'created_by_hr_id', as: 'hr' });

User.hasMany(LeaveBalance, { foreignKey: 'user_id', as: 'leave_balances' });
LeaveBalance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(LeaveRequest, { foreignKey: 'user_id', as: 'leave_requests' });
LeaveRequest.belongsTo(User, { foreignKey: 'user_id', as: 'requester' });

User.hasMany(LeaveRequest, { foreignKey: 'approved_by', as: 'approved_requests' });
LeaveRequest.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

User.hasMany(Task, { foreignKey: 'assigned_to_id', as: 'assigned_tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to_id', as: 'assignee' });

User.hasMany(Task, { foreignKey: 'assigned_by_id', as: 'created_tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_by_id', as: 'assigner' });

User.hasMany(Attendance, { foreignKey: 'user_id', as: 'attendances' });
Attendance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(PerformanceReview, { foreignKey: 'user_id', as: 'performance_reviews' });
PerformanceReview.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(PerformanceReview, { foreignKey: 'reviewer_id', as: 'reviews_given' });
PerformanceReview.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });

User.hasMany(PromotionProposal, { foreignKey: 'user_id', as: 'promotion_proposals' });
PromotionProposal.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(PromotionProposal, { foreignKey: 'proposed_by', as: 'proposals_made' });
PromotionProposal.belongsTo(User, { foreignKey: 'proposed_by', as: 'proposer' });

User.hasMany(Payroll, { foreignKey: 'user_id', as: 'payrolls' });
Payroll.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(SalaryAdjustment, { foreignKey: 'user_id', as: 'salary_adjustments' });
SalaryAdjustment.belongsTo(User, { foreignKey: 'user_id', as: 'employee' });

User.hasMany(SalaryAdjustment, { foreignKey: 'entered_by', as: 'entered_adjustments' });
SalaryAdjustment.belongsTo(User, { foreignKey: 'entered_by', as: 'enteredBy' });

User.hasMany(AdvanceRequest, { foreignKey: 'user_id', as: 'advance_requests' });
AdvanceRequest.belongsTo(User, { foreignKey: 'user_id', as: 'requester' });

User.hasMany(AdvanceRequest, { foreignKey: 'reviewed_by', as: 'reviewed_advances' });
AdvanceRequest.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

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
  Attendance,
  PerformanceReview,
  PromotionProposal,
  Payroll,
  SalaryAdjustment,
  AdvanceRequest,
  AttendanceLock,
};
