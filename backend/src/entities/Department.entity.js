class DepartmentEntity {
  static tableName = 'departments';

  static fields = {
    id:          { type: 'INT', pk: true, autoIncrement: true },
    name:        { type: 'VARCHAR(100)', nullable: false, unique: true },
    description: { type: 'TEXT', nullable: true },
    status:      { type: 'ENUM', values: ['active', 'inactive'], nullable: false, default: 'active' },
    created_at:  { type: 'DATE', nullable: false, default: 'CURRENT_TIMESTAMP' },
    updated_at:  { type: 'DATE', nullable: false, default: 'CURRENT_TIMESTAMP' },
  };

  static relations = [
    { type: 'hasMany', model: 'User',           fk: 'department_id', as: 'users' },
    { type: 'hasMany', model: 'AccountRequest', fk: 'department_id', as: 'account_requests' },
  ];

  constructor(data = {}) {
    this.id          = data.id          ?? null;
    this.name        = data.name        ?? '';
    this.description = data.description ?? null;
    this.status      = data.status      ?? 'active';
    this.created_at  = data.created_at  ?? null;
    this.updated_at  = data.updated_at  ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = DepartmentEntity;
