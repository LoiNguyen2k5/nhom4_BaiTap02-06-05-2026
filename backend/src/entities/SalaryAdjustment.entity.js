class SalaryAdjustmentEntity {
  static tableName = 'salary_adjustments';

  static fields = {
    id:          { type: 'INT', pk: true, autoIncrement: true },
    kind:        { type: 'ENUM', values: ['income', 'deduction'], nullable: false },
    user_id:     { type: 'INT', nullable: false, fk: 'users.id' },
    category:    { type: 'VARCHAR(100)', nullable: false },
    amount:      { type: 'BIGINT', nullable: false },
    apply_month: { type: 'VARCHAR(7)', nullable: false },
    reason:      { type: 'TEXT', nullable: true },
    recurring:   { type: 'BOOLEAN', nullable: false, default: false },
    status:      { type: 'ENUM', values: ['pending', 'applied'], nullable: false, default: 'pending' },
    entered_by:  { type: 'INT', nullable: true, fk: 'users.id' },
    created_at:  { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
    updated_at:  { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id',    as: 'employee' },
    { type: 'belongsTo', model: 'User', fk: 'entered_by', as: 'enteredBy' },
  ];

  constructor(data = {}) {
    this.id          = data.id          ?? null;
    this.kind        = data.kind        ?? 'income';
    this.user_id     = data.user_id     ?? null;
    this.category    = data.category    ?? '';
    this.amount      = data.amount      ?? 0;
    this.apply_month = data.apply_month ?? '';
    this.reason      = data.reason      ?? null;
    this.recurring   = data.recurring   ?? false;
    this.status      = data.status      ?? 'pending';
    this.entered_by  = data.entered_by  ?? null;
    this.created_at  = data.created_at  ?? null;
    this.updated_at  = data.updated_at  ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = SalaryAdjustmentEntity;
