class TaskEntity {
  static tableName = 'tasks';

  static fields = {
    id:             { type: 'INT', pk: true, autoIncrement: true },
    title:          { type: 'VARCHAR(255)', nullable: false },
    description:    { type: 'TEXT', nullable: true },
    priority:       { type: 'ENUM', values: ['low', 'medium', 'high', 'urgent'], nullable: false, default: 'medium' },
    status:         { type: 'ENUM', values: ['todo', 'in_progress', 'review', 'done', 'cancelled'], nullable: false, default: 'todo' },
    due_date:       { type: 'DATE', nullable: true },
    assigned_to_id: { type: 'INT', nullable: false, fk: 'users.id' },
    assigned_by_id: { type: 'INT', nullable: false, fk: 'users.id' },
    completed_at:   { type: 'DATETIME', nullable: true },
    created_at:     { type: 'DATETIME' },
    updated_at:     { type: 'DATETIME' },
  };

  static relations = [
    { type: 'belongsTo', model: 'User', fk: 'assigned_to_id', as: 'assignee' },
    { type: 'belongsTo', model: 'User', fk: 'assigned_by_id', as: 'assigner' },
  ];

  constructor(data = {}) {
    this.id             = data.id             ?? null;
    this.title          = data.title          ?? '';
    this.description    = data.description    ?? null;
    this.priority       = data.priority       ?? 'medium';
    this.status         = data.status         ?? 'todo';
    this.due_date       = data.due_date       ?? null;
    this.assigned_to_id = data.assigned_to_id ?? null;
    this.assigned_by_id = data.assigned_by_id ?? null;
    this.completed_at   = data.completed_at   ?? null;
    this.created_at     = data.created_at     ?? null;
    this.updated_at     = data.updated_at     ?? null;
  }

  toJSON() { return { ...this }; }
}

module.exports = TaskEntity;
