class ContractEntity {
  static tableName = 'contracts';

  static fields = {
    id:               { type: 'INT', pk: true, autoIncrement: true },
    user_id:          { type: 'INT', nullable: false, fk: 'users.id', cascade: 'DELETE' },
    contract_number:  { type: 'VARCHAR(100)', nullable: true, unique: true },
    contract_type:    { type: 'VARCHAR(50)', default: 'Chính thức' },
    employee_type:    { type: 'VARCHAR(20)', nullable: false, default: 'Full-time' },
    basic_salary:     { type: 'INT', nullable: false },
    start_date:       { type: 'DATE', nullable: false },
    end_date:         { type: 'DATE', nullable: true },
    status:           { type: 'ENUM', values: ['active', 'expired', 'terminated'], default: 'active' },
    created_by_hr_id: { type: 'INT', nullable: true, fk: 'users.id' },
    created_at:       { type: 'DATE' },
    updated_at:       { type: 'DATE' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id',          as: 'user' },
    { type: 'belongsTo', model: 'User', fk: 'created_by_hr_id', as: 'hr' },
  ];

  constructor(data = {}) {
    this.id               = data.id               ?? null;
    this.user_id          = data.user_id          ?? null;
    this.contract_number  = data.contract_number  ?? null;
    this.contract_type    = data.contract_type    ?? 'Chính thức';
    this.employee_type    = data.employee_type    ?? 'Full-time';
    this.basic_salary     = data.basic_salary     ?? 0;
    this.start_date       = data.start_date       ?? null;
    this.end_date         = data.end_date         ?? null;
    this.status           = data.status           ?? 'active';
    this.created_by_hr_id = data.created_by_hr_id ?? null;
    this.created_at       = data.created_at       ?? null;
    this.updated_at       = data.updated_at       ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = ContractEntity;
