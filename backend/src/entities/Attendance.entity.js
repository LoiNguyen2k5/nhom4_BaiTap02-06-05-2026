class AttendanceEntity {
  static tableName = 'attendances';

  static fields = {
    id:             { type: 'INT', pk: true, autoIncrement: true },
    user_id:        { type: 'INT', nullable: false, fk: 'users.id' },
    date:           { type: 'DATE', nullable: false },
    status:         { type: 'ENUM', values: ['Present', 'Late', 'Absent', 'OnLeave'], default: 'Present' },
    check_in_time:  { type: 'DATETIME', nullable: true },
    check_out_time: { type: 'DATETIME', nullable: true },
    work_hours:     { type: 'FLOAT', nullable: true },
    created_at:     { type: 'DATETIME' },
    updated_at:     { type: 'DATETIME' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'user_id', as: 'user' },
  ];

  constructor(data = {}) {
    this.id             = data.id             ?? null;
    this.user_id        = data.user_id        ?? null;
    this.date           = data.date           ?? null;
    this.status         = data.status         ?? 'Present';
    this.check_in_time  = data.check_in_time  ?? null;
    this.check_out_time = data.check_out_time ?? null;
    this.work_hours     = data.work_hours     ?? null;
    this.created_at     = data.created_at     ?? null;
    this.updated_at     = data.updated_at     ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = AttendanceEntity;
