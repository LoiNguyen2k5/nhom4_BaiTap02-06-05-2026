class ActivityLogEntity {
  static tableName = 'activity_logs';

  static fields = {
    id:         { type: 'INT', pk: true, autoIncrement: true },
    user_id:    { type: 'INT', nullable: true, fk: 'users.id', cascade: 'SET NULL' },
    action:     { type: 'VARCHAR(100)', nullable: false },
    detail:     { type: 'TEXT', nullable: true },
    ip:         { type: 'VARCHAR(64)', nullable: true },
    user_agent: { type: 'VARCHAR(255)', nullable: true },
    is_read:    { type: 'BOOLEAN', nullable: false, default: false },
    created_at: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id' },
  ];

  constructor(data = {}) {
    this.id         = data.id         ?? null;
    this.user_id    = data.user_id    ?? null;
    this.action     = data.action     ?? '';
    this.detail     = data.detail     ?? null;
    this.ip         = data.ip         ?? null;
    this.user_agent = data.user_agent ?? null;
    this.is_read    = data.is_read    ?? false;
    this.created_at = data.created_at ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = ActivityLogEntity;
