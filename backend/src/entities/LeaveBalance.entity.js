class LeaveBalanceEntity {
  static tableName = 'leave_balances';

  static fields = {
    id:           { type: 'INT', pk: true, autoIncrement: true },
    user_id:      { type: 'INT', nullable: false, fk: 'users.id', cascade: 'DELETE' },
    year:         { type: 'INT', nullable: false },
    total_days:   { type: 'FLOAT', nullable: false, default: 12 },
    used_days:    { type: 'FLOAT', nullable: false, default: 0 },
    pending_days: { type: 'FLOAT', nullable: false, default: 0 },
  };

  static indexes = [
    { unique: true, fields: ['user_id', 'year'] },
  ];

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id', as: 'user' },
  ];

  constructor(data = {}) {
    this.id           = data.id           ?? null;
    this.user_id      = data.user_id      ?? null;
    this.year         = data.year         ?? new Date().getFullYear();
    this.total_days   = data.total_days   ?? 12;
    this.used_days    = data.used_days    ?? 0;
    this.pending_days = data.pending_days ?? 0;
  }

  get remaining_days() {
    return this.total_days - this.used_days - this.pending_days;
  }

  toJSON() { return { ...this, remaining_days: this.remaining_days }; }
}

module.exports = LeaveBalanceEntity;
