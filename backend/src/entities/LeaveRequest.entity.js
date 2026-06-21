class LeaveRequestEntity {
  static tableName = 'leave_requests';

  static fields = {
    id:            { type: 'INT', pk: true, autoIncrement: true },
    user_id:       { type: 'INT', nullable: false, fk: 'users.id', cascade: 'DELETE' },
    type:          { type: 'ENUM', values: ['leave', 'ot'], nullable: false },
    start_date:    { type: 'DATE', nullable: false },
    end_date:      { type: 'DATE', nullable: false },
    total_days:    { type: 'FLOAT', nullable: false },
    ot_hours:      { type: 'FLOAT', nullable: true, default: null },
    reason:        { type: 'TEXT', nullable: false },
    status:        { type: 'ENUM', values: ['pending', 'approved', 'rejected', 'cancelled'], nullable: false, default: 'pending' },
    approved_by:   { type: 'INT', nullable: true, fk: 'users.id' },
    approved_at:   { type: 'DATETIME', nullable: true },
    reject_reason: { type: 'TEXT', nullable: true },
    created_at:    { type: 'DATETIME' },
    updated_at:    { type: 'DATETIME' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id',     as: 'requester' },
    { type: 'belongsTo', model: 'User', fk: 'approved_by', as: 'approver' },
  ];

  constructor(data = {}) {
    this.id            = data.id            ?? null;
    this.user_id       = data.user_id       ?? null;
    this.type          = data.type          ?? 'leave';
    this.start_date    = data.start_date    ?? null;
    this.end_date      = data.end_date      ?? null;
    this.total_days    = data.total_days    ?? 0;
    this.ot_hours      = data.ot_hours      ?? null;
    this.reason        = data.reason        ?? '';
    this.status        = data.status        ?? 'pending';
    this.approved_by   = data.approved_by   ?? null;
    this.approved_at   = data.approved_at   ?? null;
    this.reject_reason = data.reject_reason ?? null;
    this.created_at    = data.created_at    ?? null;
    this.updated_at    = data.updated_at    ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = LeaveRequestEntity;
