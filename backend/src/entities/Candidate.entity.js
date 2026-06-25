const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidate = sequelize.define(
  'Candidate',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },

    position: { type: DataTypes.STRING(100), allowNull: false },

    // Skills lưu dạng JSON array string, e.g. '["React","TypeScript"]'
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('skills');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(val) {
        this.setDataValue('skills', Array.isArray(val) ? JSON.stringify(val) : val);
      },
    },

    experience_years: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    expected_salary: { type: DataTypes.BIGINT, allowNull: true },
    source: {
      type: DataTypes.ENUM('LinkedIn', 'TopCV', 'Referral', 'Direct', 'Other'),
      defaultValue: 'Other',
    },
    current_company: { type: DataTypes.STRING(100), allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },

    // Kanban stage
    stage: {
      type: DataTypes.ENUM('new', 'screening', 'iv1', 'iv2', 'offer', 'hired', 'rejected'),
      allowNull: false,
      defaultValue: 'new',
    },

    match_score: { type: DataTypes.FLOAT, allowNull: true, defaultValue: null },

    // Kết quả phân tích AI
    ai_summary: { type: DataTypes.TEXT, allowNull: true },
    ai_reasoning: { type: DataTypes.TEXT, allowNull: true },
    cv_file_path: { type: DataTypes.STRING(255), allowNull: true },
    onboard_date: { type: DataTypes.DATEONLY, allowNull: true },

    // Các trường phỏng vấn mới
    interview_date: { type: DataTypes.DATE, allowNull: true },
    interview_link: { type: DataTypes.STRING(255), allowNull: true },
    interviewer: { type: DataTypes.STRING(100), allowNull: true },
    interview_note: { type: DataTypes.TEXT, allowNull: true },

    // Người tạo (admin/hr) — null nếu ứng viên tự nộp qua portal công khai
    created_by: { type: DataTypes.INTEGER, allowNull: true },

    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'candidates',
    timestamps: false,
  }
);

module.exports = Candidate;
