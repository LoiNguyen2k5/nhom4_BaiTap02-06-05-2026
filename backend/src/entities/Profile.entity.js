class ProfileEntity {
  static tableName = 'profiles';

  static fields = {
    id:                  { type: 'INT', pk: true, autoIncrement: true },
    user_id:             { type: 'INT', nullable: false, unique: true, fk: 'users.id', cascade: 'DELETE' },
    full_name:           { type: 'VARCHAR(255)', nullable: true },
    phone:               { type: 'VARCHAR(20)', nullable: true },
    address:             { type: 'TEXT', nullable: true },
    avatar_url:          { type: 'VARCHAR(500)', nullable: true },
    bank_name:           { type: 'VARCHAR(100)', nullable: true },
    bank_account_number: { type: 'VARCHAR(50)', nullable: true },
    bank_account_name:   { type: 'VARCHAR(100)', nullable: true },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id' },
  ];

  constructor(data = {}) {
    this.id                  = data.id                  ?? null;
    this.user_id             = data.user_id             ?? null;
    this.full_name           = data.full_name           ?? null;
    this.phone               = data.phone               ?? null;
    this.address             = data.address             ?? null;
    this.avatar_url          = data.avatar_url          ?? null;
    this.bank_name           = data.bank_name           ?? null;
    this.bank_account_number = data.bank_account_number ?? null;
    this.bank_account_name   = data.bank_account_name   ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = ProfileEntity;
