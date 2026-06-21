class PromotionProposalEntity {
  static tableName = 'promotion_proposals';

  static fields = {
    id:                { type: 'INT', pk: true, autoIncrement: true },
    user_id:           { type: 'INT', nullable: false, fk: 'users.id' },
    proposed_by:       { type: 'INT', nullable: false, fk: 'users.id' },
    current_position:  { type: 'VARCHAR(255)', nullable: false },
    proposed_position: { type: 'VARCHAR(255)', nullable: false },
    reason:            { type: 'TEXT', nullable: false },
    status:            { type: 'ENUM', values: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    created_at:        { type: 'DATETIME' },
    updated_at:        { type: 'DATETIME' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id',     as: 'user' },
    { type: 'belongsTo', model: 'User', fk: 'proposed_by', as: 'proposer' },
  ];

  constructor(data = {}) {
    this.id                = data.id                ?? null;
    this.user_id           = data.user_id           ?? null;
    this.proposed_by       = data.proposed_by       ?? null;
    this.current_position  = data.current_position  ?? '';
    this.proposed_position = data.proposed_position ?? '';
    this.reason            = data.reason            ?? '';
    this.status            = data.status            ?? 'Pending';
    this.created_at        = data.created_at        ?? null;
    this.updated_at        = data.updated_at        ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = PromotionProposalEntity;
