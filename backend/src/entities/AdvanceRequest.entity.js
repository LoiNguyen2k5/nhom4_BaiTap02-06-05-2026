class AdvanceRequestEntity {
  static tableName = 'advance_requests';

  static fields = {
    id:              { type: 'INT', pk: true, autoIncrement: true },
    code:            { type: 'VARCHAR(30)', nullable: true, unique: true },
    user_id:         { type: 'INT', nullable: false, fk: 'users.id' },
    amount:          { type: 'BIGINT', nullable: false },
    monthly_salary:  { type: 'BIGINT', nullable: true },
    yearly_advanced: { type: 'BIGINT', nullable: false, default: 0 },
    yearly_limit:    { type: 'BIGINT', nullable: true },
    reason:          { type: 'TEXT', nullable: false },
    urgent:          { type: 'BOOLEAN', nullable: false, default: false },
    status:          { type: 'ENUM', values: ['pending', 'approved', 'rejected', 'deducting', 'completed'], nullable: false, default: 'pending' },
    deduct_method:   { type: 'ENUM', values: ['full', 'split'], nullable: true },
    deduct_months:   { type: 'INT', nullable: true },
    disburse_date:   { type: 'DATE', nullable: true },
    reviewed_by:     { type: 'INT', nullable: true, fk: 'users.id' },
    reject_reason:   { type: 'TEXT', nullable: true },
    deducted_so_far: { type: 'BIGINT', nullable: false, default: 0 },
    created_at:      { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
    updated_at:      { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id',     as: 'requester' },
    { type: 'belongsTo', model: 'User', fk: 'reviewed_by', as: 'reviewer' },
  ];

  constructor(data = {}) {
    this.id              = data.id              ?? null;
    this.code            = data.code            ?? null;
    this.user_id         = data.user_id         ?? null;
    this.amount          = data.amount          ?? 0;
    this.monthly_salary  = data.monthly_salary  ?? null;
    this.yearly_advanced = data.yearly_advanced ?? 0;
    this.yearly_limit    = data.yearly_limit    ?? null;
    this.reason          = data.reason          ?? '';
    this.urgent          = data.urgent          ?? false;
    this.status          = data.status          ?? 'pending';
    this.deduct_method   = data.deduct_method   ?? null;
    this.deduct_months   = data.deduct_months   ?? null;
    this.disburse_date   = data.disburse_date   ?? null;
    this.reviewed_by     = data.reviewed_by     ?? null;
    this.reject_reason   = data.reject_reason   ?? null;
    this.deducted_so_far = data.deducted_so_far ?? 0;
    this.created_at      = data.created_at      ?? null;
    this.updated_at      = data.updated_at      ?? null;
  }

  get remaining_debt() {
    return this.amount - this.deducted_so_far;
  }

  toJSON() { return { ...this, remaining_debt: this.remaining_debt }; }
}

module.exports = AdvanceRequestEntity;
