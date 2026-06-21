class PerformanceReviewEntity {
  static tableName = 'performance_reviews';

  static fields = {
    id:          { type: 'INT', pk: true, autoIncrement: true },
    user_id:     { type: 'INT', nullable: false, fk: 'users.id' },
    reviewer_id: { type: 'INT', nullable: false, fk: 'users.id' },
    month:       { type: 'INT', nullable: false },
    year:        { type: 'INT', nullable: false },
    rating:      { type: 'ENUM', values: ['A', 'B', 'C', 'D'], nullable: false },
    kpi_score:   { type: 'FLOAT', nullable: false },
    comments:    { type: 'TEXT', nullable: true },
    created_at:  { type: 'DATETIME' },
    updated_at:  { type: 'DATETIME' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id',     as: 'user' },
    { type: 'belongsTo', model: 'User', fk: 'reviewer_id', as: 'reviewer' },
  ];

  constructor(data = {}) {
    this.id          = data.id          ?? null;
    this.user_id     = data.user_id     ?? null;
    this.reviewer_id = data.reviewer_id ?? null;
    this.month       = data.month       ?? null;
    this.year        = data.year        ?? null;
    this.rating      = data.rating      ?? null;
    this.kpi_score   = data.kpi_score   ?? 0;
    this.comments    = data.comments    ?? null;
    this.created_at  = data.created_at  ?? null;
    this.updated_at  = data.updated_at  ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = PerformanceReviewEntity;
