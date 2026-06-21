class CandidateEntity {
  static tableName = 'candidates';

  static fields = {
    id:               { type: 'INT', pk: true, autoIncrement: true },
    name:             { type: 'VARCHAR(100)', nullable: false },
    email:            { type: 'VARCHAR(150)', nullable: true },
    phone:            { type: 'VARCHAR(20)', nullable: true },
    position:         { type: 'VARCHAR(100)', nullable: false },
    skills:           { type: 'TEXT', nullable: true },
    experience_years: { type: 'INT', nullable: true, default: 0 },
    expected_salary:  { type: 'BIGINT', nullable: true },
    source:           { type: 'ENUM', values: ['LinkedIn', 'TopCV', 'Referral', 'Direct', 'Other'], default: 'Other' },
    current_company:  { type: 'VARCHAR(100)', nullable: true },
    note:             { type: 'TEXT', nullable: true },
    stage:            { type: 'ENUM', values: ['new', 'screening', 'iv1', 'iv2', 'offer', 'hired', 'rejected'], nullable: false, default: 'new' },
    match_score:      { type: 'FLOAT', nullable: true, default: 3.5 },
    onboard_date:     { type: 'DATE', nullable: true },
    created_by:       { type: 'INT', nullable: true },
    created_at:       { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
    updated_at:       { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
  };

  static relations = [];

  constructor(data = {}) {
    this.id               = data.id               ?? null;
    this.name             = data.name             ?? '';
    this.email            = data.email            ?? null;
    this.phone            = data.phone            ?? null;
    this.position         = data.position         ?? '';
    this.skills           = data.skills           ?? [];
    this.experience_years = data.experience_years ?? 0;
    this.expected_salary  = data.expected_salary  ?? null;
    this.source           = data.source           ?? 'Other';
    this.current_company  = data.current_company  ?? null;
    this.note             = data.note             ?? null;
    this.stage            = data.stage            ?? 'new';
    this.match_score      = data.match_score      ?? 3.5;
    this.onboard_date     = data.onboard_date     ?? null;
    this.created_by       = data.created_by       ?? null;
    this.created_at       = data.created_at       ?? null;
    this.updated_at       = data.updated_at       ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = CandidateEntity;
