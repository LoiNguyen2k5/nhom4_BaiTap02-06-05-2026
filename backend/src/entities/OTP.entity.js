class OTPEntity {
  static tableName = 'otps';

  static fields = {
    id:         { type: 'INT', pk: true, autoIncrement: true },
    user_id:    { type: 'INT', nullable: false, fk: 'users.id', cascade: 'DELETE' },
    code:       { type: 'VARCHAR(6)', nullable: false },
    expires_at: { type: 'DATETIME', nullable: false },
    is_used:    { type: 'BOOLEAN', nullable: false, default: false },
    created_at: { type: 'DATETIME', nullable: true, default: 'CURRENT_TIMESTAMP' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id' },
  ];

  constructor(data = {}) {
    this.id         = data.id         ?? null;
    this.user_id    = data.user_id    ?? null;
    this.code       = data.code       ?? '';
    this.expires_at = data.expires_at ?? null;
    this.is_used    = data.is_used    ?? false;
    this.created_at = data.created_at ?? null;
  }

  get isExpired() {
    return this.expires_at && new Date(this.expires_at) < new Date();
  }

  toJSON() { return { ...this }; }
}

module.exports = OTPEntity;
