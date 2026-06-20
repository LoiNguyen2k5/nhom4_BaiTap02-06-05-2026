-- ================================================
-- Migration: Tạo bảng advance_requests
-- Quản lý tạm ứng lương
-- ================================================

CREATE TABLE IF NOT EXISTS advance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) DEFAULT NULL UNIQUE COMMENT 'Mã đơn ADV-YYYY-XXXX',
    user_id INT NOT NULL COMMENT 'Nhân viên yêu cầu',
    amount BIGINT NOT NULL COMMENT 'Số tiền tạm ứng (VNĐ)',
    monthly_salary BIGINT DEFAULT NULL COMMENT 'Lương tháng tại thời điểm nộp đơn',
    yearly_advanced BIGINT NOT NULL DEFAULT 0 COMMENT 'Tổng đã tạm ứng trong năm',
    yearly_limit BIGINT DEFAULT NULL COMMENT 'Hạn mức tối đa năm (thường = 3 tháng lương)',
    reason TEXT NOT NULL COMMENT 'Lý do tạm ứng',
    urgent TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Đánh dấu khẩn cấp',
    status ENUM('pending','approved','rejected','deducting','completed') NOT NULL DEFAULT 'pending',
    deduct_method ENUM('full','split') DEFAULT NULL COMMENT 'Phương thức khấu trừ',
    deduct_months INT DEFAULT NULL COMMENT 'Số tháng chia khấu trừ',
    disburse_date DATE DEFAULT NULL COMMENT 'Ngày dự kiến chi tiền',
    reviewed_by INT DEFAULT NULL COMMENT 'Kế toán duyệt/từ chối',
    reject_reason TEXT DEFAULT NULL COMMENT 'Lý do từ chối',
    deducted_so_far BIGINT NOT NULL DEFAULT 0 COMMENT 'Số tiền đã khấu trừ thực tế',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
