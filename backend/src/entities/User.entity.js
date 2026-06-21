class UserEntity {
  static tableName = 'users';

  static fields = {
    id:            { type: 'INT', pk: true, autoIncrement: true },
    name:          { type: 'VARCHAR(255)', nullable: true },
    email:         { type: 'VARCHAR(255)', unique: true, nullable: false },
    password:      { type: 'VARCHAR(255)', nullable: false },
    role:          { type: 'ENUM', values: ['user', 'admin', 'hr', 'manager', 'accountant', 'employee'], default: 'employee' },
    department_id: { type: 'INT', nullable: true, fk: 'departments.id' },
    status:        { type: 'ENUM', values: ['inactive', 'active'], nullable: false, default: 'active' },
    created_at:    { type: 'DATE', nullable: false, default: 'CURRENT_TIMESTAMP' },
  };

  static relations = [
    { type: 'hasOne',    model: 'Profile',           fk: 'user_id',       cascade: 'DELETE' },
    { type: 'hasMany',   model: 'OTP',               fk: 'user_id',       cascade: 'DELETE' },
    { type: 'hasMany',   model: 'ActivityLog',        fk: 'user_id',       cascade: 'SET NULL' },
    { type: 'hasMany',   model: 'LeaveBalance',       fk: 'user_id',       as: 'leave_balances' },
    { type: 'hasMany',   model: 'LeaveRequest',       fk: 'user_id',       as: 'leave_requests' },
    { type: 'hasMany',   model: 'LeaveRequest',       fk: 'approved_by',   as: 'approved_requests' },
    { type: 'hasMany',   model: 'Task',               fk: 'assigned_to_id', as: 'assigned_tasks' },
    { type: 'hasMany',   model: 'Task',               fk: 'assigned_by_id', as: 'created_tasks' },
    { type: 'hasMany',   model: 'Attendance',         fk: 'user_id',       as: 'attendances' },
    { type: 'hasMany',   model: 'PerformanceReview',  fk: 'user_id',       as: 'performance_reviews' },
    { type: 'hasMany',   model: 'PerformanceReview',  fk: 'reviewer_id',   as: 'reviews_given' },
    { type: 'hasMany',   model: 'PromotionProposal',  fk: 'user_id',       as: 'promotion_proposals' },
    { type: 'hasMany',   model: 'PromotionProposal',  fk: 'proposed_by',   as: 'proposals_made' },
    { type: 'hasMany',   model: 'Payroll',             fk: 'user_id',       as: 'payrolls' },
    { type: 'hasMany',   model: 'SalaryAdjustment',   fk: 'user_id',       as: 'salary_adjustments' },
    { type: 'hasMany',   model: 'SalaryAdjustment',   fk: 'entered_by',    as: 'entered_adjustments' },
    { type: 'hasMany',   model: 'AdvanceRequest',     fk: 'user_id',       as: 'advance_requests' },
    { type: 'hasMany',   model: 'AdvanceRequest',     fk: 'reviewed_by',   as: 'reviewed_advances' },
    { type: 'hasMany',   model: 'Contract',           fk: 'user_id',       as: 'contracts' },
    { type: 'hasMany',   model: 'AccountRequest',     fk: 'hr_id',         as: 'account_requests' },
    { type: 'belongsTo', model: 'Department',         fk: 'department_id', as: 'department' },
  ];

  constructor(data = {}) {
    this.id            = data.id            ?? null;
    this.name          = data.name          ?? null;
    this.email         = data.email         ?? '';
    this.role          = data.role          ?? 'employee';
    this.department_id = data.department_id ?? null;
    this.status        = data.status        ?? 'active';
    this.created_at    = data.created_at    ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = UserEntity;
