class AccountRequestEntity {
  static tableName = 'account_requests';

  static fields = {
    id:            { type: 'INT', pk: true, autoIncrement: true },
    hr_id:         { type: 'INT', nullable: false, fk: 'users.id' },
    email:         { type: 'VARCHAR(255)', nullable: false },
    full_name:     { type: 'VARCHAR(255)', nullable: false },
    role:          { type: 'ENUM', values: ['employee', 'manager', 'accountant'], default: 'employee' },
    department_id: { type: 'INT', nullable: true, fk: 'departments.id' },
    status:        { type: 'ENUM', values: ['pending', 'approved', 'rejected'], default: 'pending' },
    created_at:    { type: 'DATETIME' },
    updated_at:    { type: 'DATETIME' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User',       fk: 'hr_id',        as: 'hr' },
    { type: 'belongsTo', model: 'Department', fk: 'department_id', as: 'department' },
  ];

  constructor(data = {}) {
    this.id            = data.id            ?? null;
    this.hr_id         = data.hr_id         ?? null;
    this.email         = data.email         ?? '';
    this.full_name     = data.full_name     ?? '';
    this.role          = data.role          ?? 'employee';
    this.department_id = data.department_id ?? null;
    this.status        = data.status        ?? 'pending';
    this.created_at    = data.created_at    ?? null;
    this.updated_at    = data.updated_at    ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = AccountRequestEntity;
