const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Bảng lưu từng đơn xin nghỉ phép hoặc đăng ký OT (Overtime)
const LeaveRequest = sequelize.define(
  'LeaveRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    
    // Đơn này của ai tạo?
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },

    // Phân loại: là đơn xin nghỉ phép (leave) hay đơn làm thêm giờ (ot)
    type: {
      type: DataTypes.ENUM('leave', 'ot'),
      allowNull: false,
    },

    // Ngày bắt đầu nghỉ / làm thêm
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    // Ngày kết thúc nghỉ / làm thêm
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    // Tổng số ngày (VD: nghỉ buổi sáng là 0.5 ngày, nghỉ 1 tuần là 5 ngày)
    // Hệ thống sẽ dùng số này để trừ vào bảng LeaveBalance
    total_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // Nếu type = 'ot' (làm thêm) thì mới dùng trường này để tính lương OT
    ot_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },

    // Lý do gửi lên cho Manager đọc
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // Trạng thái của đơn.
    // pending: Mới tạo, đang chờ Manager duyệt
    // approved: Đã duyệt (hệ thống sẽ tự động gọi logic để trừ ngày phép)
    // rejected: Bị từ chối
    // cancelled: Nhân viên tự rút lại đơn khi Manager chưa kịp duyệt
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },

    // Manager nào là người đã bấm nút duyệt/từ chối? (Lưu ID của Manager đó)
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },

    // Ngày giờ lúc Manager bấm nút duyệt
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Nếu Manager từ chối (reject) thì phải ghi lý do vào đây
    reject_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'leave_requests',
    
    // Bật timestamps: true để Sequelize TỰ ĐỘNG tạo 2 cột:
    // createdAt (ngày nộp đơn) và updatedAt (ngày cập nhật đơn)
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = LeaveRequest;
