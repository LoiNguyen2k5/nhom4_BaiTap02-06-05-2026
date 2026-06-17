-- ================================================
-- Migration: Tạo bảng salary_adjustments
-- Khoản thu nhập thêm / khấu trừ phát sinh
-- ================================================

CREATE TABLE IF NOT EXISTS salary_adjustments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kind ENUM('income', 'deduction') NOT NULL COMMENT 'income = thu nhập thêm, deduction = khấu trừ',
    user_id INT NOT NULL COMMENT 'Nhân viên được áp dụng',
    category VARCHAR(100) NOT NULL COMMENT 'Loại khoản (VD: Thưởng dự án, Phạt đi trễ...)',
    amount BIGINT NOT NULL COMMENT 'Số tiền (VNĐ)',
    apply_month VARCHAR(7) NOT NULL COMMENT 'Tháng áp dụng, định dạng YYYY-MM',
    reason TEXT DEFAULT NULL COMMENT 'Lý do chi tiết',
    recurring TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Lặp lại hàng tháng',
    status ENUM('pending', 'applied') NOT NULL DEFAULT 'pending',
    entered_by INT DEFAULT NULL COMMENT 'Kế toán nhập liệu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (entered_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_kind (kind),
    INDEX idx_apply_month (apply_month),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
