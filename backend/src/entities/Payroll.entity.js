class PayrollEntity {
  static tableName = 'payrolls';

  static fields = {
    id:                 { type: 'INT', pk: true, autoIncrement: true },
    user_id:            { type: 'INT', nullable: false, fk: 'users.id', cascade: 'DELETE' },
    month:              { type: 'VARCHAR(7)', nullable: false },
    base_salary:        { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    allowance:          { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    bonus:              { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    deduction:          { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    advance:            { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    tax:                { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    insurance_company:  { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    insurance_employee: { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    net_salary:         { type: 'DECIMAL(15,2)', nullable: false, default: 0 },
    status:             { type: 'ENUM', values: ['draft', 'calculated', 'approved', 'paid'], default: 'draft' },
    is_payslip_sent:    { type: 'BOOLEAN', default: false },
    payment_date:       { type: 'DATETIME', nullable: true },
    created_at:         { type: 'DATETIME' },
    updated_at:         { type: 'DATETIME' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id', as: 'user' },
  ];

  constructor(data = {}) {
    this.id                 = data.id                 ?? null;
    this.user_id            = data.user_id            ?? null;
    this.month              = data.month              ?? '';
    this.base_salary        = data.base_salary        ?? 0;
    this.allowance          = data.allowance          ?? 0;
    this.bonus              = data.bonus              ?? 0;
    this.deduction          = data.deduction          ?? 0;
    this.advance            = data.advance            ?? 0;
    this.tax                = data.tax                ?? 0;
    this.insurance_company  = data.insurance_company  ?? 0;
    this.insurance_employee = data.insurance_employee ?? 0;
    this.net_salary         = data.net_salary         ?? 0;
    this.status             = data.status             ?? 'draft';
    this.is_payslip_sent    = data.is_payslip_sent    ?? false;
    this.payment_date       = data.payment_date       ?? null;
    this.created_at         = data.created_at         ?? null;
    this.updated_at         = data.updated_at         ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = PayrollEntity;
