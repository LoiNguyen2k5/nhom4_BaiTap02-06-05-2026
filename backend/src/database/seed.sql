-- ============================================================
-- ATRIA HRM — Seed Data v1.0
-- Database: nhom4_baitap
-- Usage: mysql -u root nhom4_baitap < backend/src/database/seed.sql
-- Yêu cầu: Chạy backend 1 lần trước để Sequelize sync() tạo tables
-- Password tất cả tài khoản test: Admin@123456 | User@123456 | ...
-- (createAdmin.js sẽ hash lại khi restart, seed chỉ dùng cho data phụ)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- Xóa data cũ theo thứ tự reverse FK
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE advance_requests;
TRUNCATE TABLE salary_adjustments;
TRUNCATE TABLE payrolls;
TRUNCATE TABLE performance_reviews;
TRUNCATE TABLE promotion_proposals;
TRUNCATE TABLE leave_requests;
TRUNCATE TABLE leave_balances;
TRUNCATE TABLE attendances;
TRUNCATE TABLE tasks;
TRUNCATE TABLE account_requests;
TRUNCATE TABLE candidates;
TRUNCATE TABLE contracts;
TRUNCATE TABLE otps;
TRUNCATE TABLE profiles;
TRUNCATE TABLE tax_insurance_configs;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. DEPARTMENTS (5 phòng ban)
-- ============================================================
INSERT INTO departments (id, name, description, status, created_at, updated_at) VALUES
(1, 'Ban Giám Đốc',    'Lãnh đạo và định hướng công ty',                  'active', NOW(), NOW()),
(2, 'Phòng IT',        'Phát triển và vận hành hệ thống công nghệ',        'active', NOW(), NOW()),
(3, 'Phòng Nhân Sự',   'Quản lý tuyển dụng và phát triển nhân viên',      'active', NOW(), NOW()),
(4, 'Phòng Kế Toán',   'Quản lý tài chính, lương và chi phí',             'active', NOW(), NOW()),
(5, 'Phòng Marketing', 'Truyền thông, marketing và phát triển thị trường', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), status = VALUES(status);

-- ============================================================
-- 2. USERS (10 tài khoản — đủ tất cả roles)
-- Tất cả dùng password đã được createAdmin.js quản lý
-- Seed chỉ tạo employee test accounts (IDs 6-10)
-- IDs 1-5 do createAdmin.js tạo khi start server
-- ============================================================
INSERT INTO users (id, name, email, password, role, department_id, status, created_at) VALUES
(6,  'Lê Văn Bình',   'employee1@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 2, 'active', NOW()),
(7,  'Phạm Thị Cúc',  'employee2@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 2, 'active', NOW()),
(8,  'Ngô Văn Đức',   'employee3@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 5, 'active', NOW()),
(9,  'Hoàng Thị Em',  'employee4@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 5, 'active', NOW()),
(10, 'Vũ Văn Phong',  'employee5@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 3, 'active', NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name), email = VALUES(email), role = VALUES(role),
  department_id = VALUES(department_id), status = VALUES(status);

-- Cập nhật department cho các tài khoản hệ thống (nếu chưa có)
UPDATE users SET department_id = 1 WHERE email = 'admin@example.com';
UPDATE users SET department_id = 3 WHERE email = 'hr@example.com';
UPDATE users SET department_id = 4 WHERE email = 'accountant@example.com';
UPDATE users SET department_id = 2 WHERE email = 'manager@example.com';
UPDATE users SET department_id = 2 WHERE email = 'user@example.com';

-- ============================================================
-- 3. PROFILES (thông tin cá nhân + bank account)
-- ============================================================
INSERT INTO profiles (user_id, full_name, phone, address, avatar_url, bank_name, bank_account_number, bank_account_name) VALUES
(6,  'Lê Văn Bình',   '0901234561', '45 Lê Lợi, Q.1, TP.HCM',       NULL, 'Vietcombank', '1023456786', 'LE VAN BINH'),
(7,  'Phạm Thị Cúc',  '0901234562', '78 Nguyễn Trãi, Q.5, TP.HCM',  NULL, 'Techcombank', '1923456787', 'PHAM THI CUC'),
(8,  'Ngô Văn Đức',   '0901234563', '12 Đinh Tiên Hoàng, Q.BT, HCM', NULL, 'MB Bank',     '8823456788', 'NGO VAN DUC'),
(9,  'Hoàng Thị Em',  '0901234564', '99 Cộng Hòa, Q.TB, TP.HCM',    NULL, 'BIDV',        '3123456789', 'HOANG THI EM'),
(10, 'Vũ Văn Phong',  '0901234565', '56 Hai Bà Trưng, Q.3, TP.HCM', NULL, 'Agribank',    '5423456780', 'VU VAN PHONG');

-- Đảm bảo profiles cho system accounts tồn tại
INSERT IGNORE INTO profiles (user_id, full_name, phone, bank_name, bank_account_number, bank_account_name)
SELECT u.id, u.name, '0900000000', 'Vietcombank', CONCAT('100000000', u.id), UPPER(REPLACE(u.name, ' ', ' '))
FROM users u
WHERE u.email IN ('admin@example.com','hr@example.com','accountant@example.com','manager@example.com','user@example.com')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- ============================================================
-- 4. TAX INSURANCE CONFIG
-- ============================================================
INSERT INTO tax_insurance_configs (
  social_insurance_rate, health_insurance_rate, unemployment_insurance_rate,
  base_salary, max_insurance_salary, personal_deduction, dependent_deduction, updated_at
) VALUES (
  8.0, 1.5, 1.0,
  2340000.00, 46800000.00, 11000000.00, 4400000.00, NOW()
);

-- ============================================================
-- 5. CONTRACTS (8 hợp đồng lao động)
-- Tham chiếu user_id: user@example.com ~= 5 (hệ thống), employees 6-10
-- created_by_hr_id = hr user
-- ============================================================
INSERT INTO contracts (user_id, contract_number, contract_type, employee_type, basic_salary, start_date, end_date, status, created_at, updated_at)
SELECT u.id, CONCAT('CT-2024-00', ROW_NUMBER() OVER (ORDER BY u.id)), 'Chính thức', 'Full-time',
  CASE WHEN u.role IN ('admin','manager') THEN 25000000
       WHEN u.role = 'accountant'         THEN 20000000
       WHEN u.role = 'hr'                 THEN 18000000
       ELSE 15000000 END,
  '2024-01-01', NULL, 'active', NOW(), NOW()
FROM users u
WHERE u.email IN ('manager@example.com','user@example.com','accountant@example.com','hr@example.com');

INSERT INTO contracts (user_id, contract_number, contract_type, employee_type, basic_salary, start_date, end_date, status, created_at, updated_at) VALUES
(6,  'CT-2024-005', 'Chính thức', 'Full-time', 16000000, '2024-03-01', NULL,         'active',  NOW(), NOW()),
(7,  'CT-2024-006', 'Chính thức', 'Full-time', 15000000, '2024-06-01', NULL,         'active',  NOW(), NOW()),
(8,  'CT-2025-007', 'Thời vụ',   'Intern',    8000000,  '2025-01-01', '2026-06-30', 'active',  NOW(), NOW()),
(9,  'CT-2025-008', 'Thời vụ',   'Intern',    8000000,  '2025-03-01', '2026-03-01', 'expired', NOW(), NOW()),
(10, 'CT-2024-009', 'Chính thức', 'Full-time', 14000000, '2024-09-01', NULL,         'active',  NOW(), NOW());

-- ============================================================
-- 6. LEAVE BALANCES (năm 2026 cho 10 nhân viên)
-- ============================================================
INSERT INTO leave_balances (user_id, year, total_days, used_days, pending_days)
SELECT u.id, 2026,
  12,
  CASE WHEN u.email = 'user@example.com'      THEN 3
       WHEN u.email = 'employee1@example.com' THEN 2
       WHEN u.email = 'employee2@example.com' THEN 5
       ELSE 0 END,
  CASE WHEN u.email = 'employee3@example.com' THEN 1
       ELSE 0 END
FROM users u
WHERE u.email IN ('admin@example.com','hr@example.com','accountant@example.com','manager@example.com',
                  'user@example.com','employee1@example.com','employee2@example.com',
                  'employee3@example.com','employee4@example.com','employee5@example.com');

-- ============================================================
-- 7. LEAVE REQUESTS (5 đơn nghỉ phép)
-- ============================================================
INSERT INTO leave_requests (user_id, type, start_date, end_date, total_days, ot_hours, reason, status, approved_by, approved_at, reject_reason, created_at, updated_at)
SELECT
  u_emp.id, 'leave', '2026-06-02', '2026-06-02', 1, NULL,
  'Nghỉ phép cá nhân', 'approved', u_mgr.id, '2026-05-30 09:00:00', NULL, '2026-05-28 08:00:00', '2026-05-30 09:00:00'
FROM users u_emp, users u_mgr
WHERE u_emp.email = 'user@example.com' AND u_mgr.email = 'manager@example.com';

INSERT INTO leave_requests (user_id, type, start_date, end_date, total_days, ot_hours, reason, status, approved_by, approved_at, reject_reason, created_at, updated_at)
SELECT
  u_emp.id, 'leave', '2026-06-16', '2026-06-18', 3, NULL,
  'Nghỉ phép gia đình có việc', 'approved', u_mgr.id, '2026-06-10 10:00:00', NULL, '2026-06-08 14:00:00', '2026-06-10 10:00:00'
FROM users u_emp, users u_mgr
WHERE u_emp.email = 'employee2@example.com' AND u_mgr.email = 'manager@example.com';

INSERT INTO leave_requests (user_id, type, start_date, end_date, total_days, ot_hours, reason, status, approved_by, approved_at, reject_reason, created_at, updated_at)
SELECT
  u.id, 'leave', '2026-06-25', '2026-06-25', 1, NULL,
  'Nghỉ phép cá nhân', 'pending', NULL, NULL, NULL, '2026-06-18 09:00:00', '2026-06-18 09:00:00'
FROM users u WHERE u.email = 'employee1@example.com';

INSERT INTO leave_requests (user_id, type, start_date, end_date, total_days, ot_hours, reason, status, approved_by, approved_at, reject_reason, created_at, updated_at)
SELECT
  u.id, 'ot', '2026-06-20', '2026-06-20', 0, 4, 'OT deadline project', 'pending', NULL, NULL, NULL, '2026-06-17 16:00:00', '2026-06-17 16:00:00'
FROM users u WHERE u.email = 'employee3@example.com';

INSERT INTO leave_requests (user_id, type, start_date, end_date, total_days, ot_hours, reason, status, approved_by, approved_at, reject_reason, created_at, updated_at)
SELECT
  u_emp.id, 'leave', '2026-05-01', '2026-05-03', 3, NULL,
  'Nghỉ phép du lịch', 'rejected', u_mgr.id, '2026-04-25 11:00:00', 'Đây là giai đoạn cao điểm, không thể nghỉ', '2026-04-20 10:00:00', '2026-04-25 11:00:00'
FROM users u_emp, users u_mgr
WHERE u_emp.email = 'employee4@example.com' AND u_mgr.email = 'manager@example.com';

-- ============================================================
-- 8. ATTENDANCES (20 bản ghi chấm công tháng 06/2026)
-- ============================================================
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-02', 'Present', '2026-06-02 08:01:00', '2026-06-02 17:30:00', 8.5, NOW(), NOW() FROM users u WHERE u.email = 'employee1@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-03', 'Late',    '2026-06-03 09:15:00', '2026-06-03 18:00:00', 7.75, NOW(), NOW() FROM users u WHERE u.email = 'employee1@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-04', 'Present', '2026-06-04 07:58:00', '2026-06-04 17:00:00', 9.0, NOW(), NOW() FROM users u WHERE u.email = 'employee1@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-05', 'Present', '2026-06-05 08:05:00', '2026-06-05 17:15:00', 8.2, NOW(), NOW() FROM users u WHERE u.email = 'employee1@example.com';

INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-02', 'Present', '2026-06-02 08:00:00', '2026-06-02 17:00:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee2@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-03', 'Present', '2026-06-03 08:10:00', '2026-06-03 17:10:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee2@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-04', 'Absent',  NULL,                  NULL,                  0,   NOW(), NOW() FROM users u WHERE u.email = 'employee2@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-05', 'Present', '2026-06-05 08:00:00', '2026-06-05 17:00:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee2@example.com';

INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-02', 'Present', '2026-06-02 08:30:00', '2026-06-02 17:30:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee3@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-03', 'Late',    '2026-06-03 09:30:00', '2026-06-03 18:30:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee3@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-04', 'Present', '2026-06-04 08:00:00', '2026-06-04 17:00:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee3@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-05', 'Present', '2026-06-05 08:05:00', '2026-06-05 17:05:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee3@example.com';

INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-02', 'OnLeave', NULL, NULL, 0, NOW(), NOW() FROM users u WHERE u.email = 'employee4@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-03', 'Present', '2026-06-03 08:00:00', '2026-06-03 17:00:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee4@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-04', 'Present', '2026-06-04 07:55:00', '2026-06-04 17:00:00', 8.1, NOW(), NOW() FROM users u WHERE u.email = 'employee4@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-05', 'Late',    '2026-06-05 09:00:00', '2026-06-05 18:00:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee4@example.com';

INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-02', 'Present', '2026-06-02 08:00:00', '2026-06-02 17:00:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee5@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-03', 'Absent',  NULL, NULL, 0, NOW(), NOW() FROM users u WHERE u.email = 'employee5@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-04', 'Present', '2026-06-04 08:00:00', '2026-06-04 17:00:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee5@example.com';
INSERT INTO attendances (user_id, date, status, check_in_time, check_out_time, work_hours, createdAt, updatedAt)
SELECT u.id, '2026-06-05', 'Present', '2026-06-05 08:10:00', '2026-06-05 17:10:00', 8.0, NOW(), NOW() FROM users u WHERE u.email = 'employee5@example.com';

-- ============================================================
-- 9. TASKS (8 task đủ priority/status)
-- ============================================================
INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'Phát triển module Payroll FE', 'Hoàn thiện UI trang tính lương cho kế toán', 'high', 'done',
  '2026-06-15', emp.id, mgr.id, '2026-06-14 16:00:00', '2026-05-20 09:00:00', '2026-06-14 16:00:00'
FROM users emp, users mgr WHERE emp.email = 'employee1@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'Fix bug login page', 'Xử lý lỗi refresh token hết hạn', 'urgent', 'in_progress',
  '2026-06-21', emp.id, mgr.id, NULL, '2026-06-17 10:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee1@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'Viết tài liệu API', 'Tài liệu Swagger cho các endpoint mới', 'medium', 'todo',
  '2026-06-30', emp.id, mgr.id, NULL, '2026-06-10 14:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee2@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'Thiết kế banner tháng 7', 'Banner quảng cáo cho chiến dịch Q3', 'medium', 'review',
  '2026-06-25', emp.id, mgr.id, NULL, '2026-06-12 09:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee3@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'SEO trang chủ', 'Tối ưu SEO cho trang chủ website công ty', 'low', 'todo',
  '2026-07-15', emp.id, mgr.id, NULL, '2026-06-15 11:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee4@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'Onboard nhân viên mới', 'Chuẩn bị tài liệu và hướng dẫn cho nhân viên tháng 7', 'high', 'in_progress',
  '2026-06-28', emp.id, mgr.id, NULL, '2026-06-16 08:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee5@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'Review code PR#42', 'Review pull request module attendance', 'high', 'done',
  '2026-06-10', emp.id, mgr.id, '2026-06-09 15:00:00', '2026-06-08 10:00:00', '2026-06-09 15:00:00'
FROM users emp, users mgr WHERE emp.email = 'employee2@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to_id, assigned_by_id, completed_at, created_at, updated_at)
SELECT 'Testing module tạm ứng', 'Test đầy đủ luồng advance request', 'high', 'cancelled',
  '2026-06-05', emp.id, mgr.id, NULL, '2026-06-01 09:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee1@example.com' AND mgr.email = 'manager@example.com';

-- ============================================================
-- 10. PERFORMANCE REVIEWS (Q1 2026)
-- ============================================================
INSERT INTO performance_reviews (user_id, reviewer_id, month, year, rating, kpi_score, comments, createdAt, updatedAt)
SELECT emp.id, mgr.id, 3, 2026, 'A', 92.5, 'Hiệu suất xuất sắc, hoàn thành vượt KPI', NOW(), NOW()
FROM users emp, users mgr WHERE emp.email = 'employee1@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO performance_reviews (user_id, reviewer_id, month, year, rating, kpi_score, comments, createdAt, updatedAt)
SELECT emp.id, mgr.id, 3, 2026, 'B', 78.0, 'Đạt yêu cầu, cần cải thiện tốc độ delivery', NOW(), NOW()
FROM users emp, users mgr WHERE emp.email = 'employee2@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO performance_reviews (user_id, reviewer_id, month, year, rating, kpi_score, comments, createdAt, updatedAt)
SELECT emp.id, mgr.id, 3, 2026, 'B', 81.5, 'Sáng tạo tốt, đúng deadline', NOW(), NOW()
FROM users emp, users mgr WHERE emp.email = 'employee3@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO performance_reviews (user_id, reviewer_id, month, year, rating, kpi_score, comments, createdAt, updatedAt)
SELECT emp.id, mgr.id, 3, 2026, 'C', 65.0, 'Cần nỗ lực thêm, hay đến trễ', NOW(), NOW()
FROM users emp, users mgr WHERE emp.email = 'employee4@example.com' AND mgr.email = 'manager@example.com';

-- ============================================================
-- 11. PROMOTION PROPOSALS
-- ============================================================
INSERT INTO promotion_proposals (user_id, proposed_by, current_position, proposed_position, reason, status, createdAt, updatedAt)
SELECT emp.id, mgr.id, 'Junior Developer', 'Senior Developer',
  'Nhân viên đã làm việc xuất sắc 2 năm, nắm vững kỹ năng và mentor được junior', 'Approved', '2026-04-01 09:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee1@example.com' AND mgr.email = 'manager@example.com';

INSERT INTO promotion_proposals (user_id, proposed_by, current_position, proposed_position, reason, status, createdAt, updatedAt)
SELECT emp.id, mgr.id, 'HR Officer', 'HR Team Lead',
  'Có kinh nghiệm xử lý tuyển dụng độc lập, phù hợp làm team lead', 'Pending', '2026-06-01 10:00:00', NOW()
FROM users emp, users mgr WHERE emp.email = 'employee5@example.com' AND mgr.email = 'manager@example.com';

-- ============================================================
-- 12. CANDIDATES (5 ứng viên đủ pipeline stage)
-- ============================================================
INSERT INTO candidates (name, email, phone, position, skills, experience_years, expected_salary, source, current_company, note, stage, match_score, created_at, updated_at)
VALUES
('Trần Anh Khoa',   'anhkhoa@gmail.com',   '0912345671', 'Frontend Developer',   '["React","TypeScript","TailwindCSS"]', 3, 20000000, 'LinkedIn',  'FPT Software',   'Ứng viên tiềm năng', 'screening', 4.2, NOW(), NOW()),
('Lý Thị Hoa',      'lythihoa@gmail.com',  '0912345672', 'Backend Developer',    '["Node.js","MySQL","Docker"]',        4, 22000000, 'TopCV',     'Tiki',           'Có kinh nghiệm tốt', 'iv1',       4.5, NOW(), NOW()),
('Phan Minh Tuấn',  'minhtuan@gmail.com',  '0912345673', 'UI/UX Designer',       '["Figma","Adobe XD","Sketch"]',       2, 16000000, 'Referral',  'Freelancer',     NULL,                 'iv2',       3.8, NOW(), NOW()),
('Bùi Thị Ngọc',    'buitngoc@gmail.com',  '0912345674', 'HR Officer',           '["Tuyển dụng","HRIS","Excel"]',       1, 12000000, 'Direct',    'Mới ra trường', 'Sinh viên mới ra trường', 'offer', 3.5, NOW(), NOW()),
('Đặng Quốc Hùng',  'quochung@gmail.com',  '0912345675', 'Marketing Executive',  '["SEO","Google Ads","Content"]',      5, 18000000, 'LinkedIn',  'VinGroup',       'Senior candidate',   'new',       4.0, NOW(), NOW());

-- ============================================================
-- 13. ACCOUNT REQUESTS (3 yêu cầu tạo tài khoản)
-- ============================================================
INSERT INTO account_requests (hr_id, email, full_name, role, department_id, status, created_at, updated_at)
SELECT h.id, 'newdev@example.com', 'Nguyễn Tấn Phát', 'employee', 2, 'approved', '2026-05-15 10:00:00', '2026-05-16 09:00:00'
FROM users h WHERE h.email = 'hr@example.com';

INSERT INTO account_requests (hr_id, email, full_name, role, department_id, status, created_at, updated_at)
SELECT h.id, 'newmarketing@example.com', 'Trần Thị Nhung', 'employee', 5, 'pending', '2026-06-10 14:00:00', '2026-06-10 14:00:00'
FROM users h WHERE h.email = 'hr@example.com';

INSERT INTO account_requests (hr_id, email, full_name, role, department_id, status, created_at, updated_at)
SELECT h.id, 'newmanager@example.com', 'Phạm Văn Kiên', 'manager', 2, 'rejected', '2026-05-01 09:00:00', '2026-05-05 11:00:00'
FROM users h WHERE h.email = 'hr@example.com';

-- ============================================================
-- 14. SALARY ADJUSTMENTS (6 khoản thu nhập/khấu trừ tháng 2026-06)
-- ============================================================
INSERT INTO salary_adjustments (kind, user_id, category, amount, apply_month, reason, recurring, status, entered_by, created_at, updated_at)
SELECT 'income', emp.id, 'Thưởng dự án', 3000000, '2026-06', 'Hoàn thành dự án trước deadline', 0, 'applied', acc.id, '2026-06-01 09:00:00', '2026-06-01 09:00:00'
FROM users emp, users acc WHERE emp.email = 'employee1@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO salary_adjustments (kind, user_id, category, amount, apply_month, reason, recurring, status, entered_by, created_at, updated_at)
SELECT 'income', emp.id, 'Phụ cấp xăng xe', 500000, '2026-06', 'Phụ cấp đi lại hàng tháng', 1, 'applied', acc.id, '2026-06-01 09:00:00', '2026-06-01 09:00:00'
FROM users emp, users acc WHERE emp.email = 'employee2@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO salary_adjustments (kind, user_id, category, amount, apply_month, reason, recurring, status, entered_by, created_at, updated_at)
SELECT 'deduction', emp.id, 'Phạt đi trễ', 200000, '2026-06', 'Đến trễ 3 lần trong tháng', 0, 'applied', acc.id, '2026-06-01 09:00:00', '2026-06-01 09:00:00'
FROM users emp, users acc WHERE emp.email = 'employee3@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO salary_adjustments (kind, user_id, category, amount, apply_month, reason, recurring, status, entered_by, created_at, updated_at)
SELECT 'income', emp.id, 'Thưởng KPI Q1', 2000000, '2026-06', 'KPI Q1 đạt 92.5 điểm (xếp loại A)', 0, 'applied', acc.id, '2026-06-05 10:00:00', '2026-06-05 10:00:00'
FROM users emp, users acc WHERE emp.email = 'employee1@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO salary_adjustments (kind, user_id, category, amount, apply_month, reason, recurring, status, entered_by, created_at, updated_at)
SELECT 'income', emp.id, 'Phụ cấp ăn trưa', 700000, '2026-06', 'Phụ cấp ăn trưa định kỳ', 1, 'pending', acc.id, '2026-06-10 09:00:00', NOW()
FROM users emp, users acc WHERE emp.email = 'employee4@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO salary_adjustments (kind, user_id, category, amount, apply_month, reason, recurring, status, entered_by, created_at, updated_at)
SELECT 'deduction', emp.id, 'Trừ nghỉ không phép', 500000, '2026-06', 'Nghỉ 1 ngày không xin phép', 0, 'pending', acc.id, '2026-06-12 11:00:00', NOW()
FROM users emp, users acc WHERE emp.email = 'employee5@example.com' AND acc.email = 'accountant@example.com';

-- ============================================================
-- 15. ADVANCE REQUESTS (4 đơn tạm ứng — đủ status)
-- ============================================================
INSERT INTO advance_requests (code, user_id, amount, monthly_salary, yearly_advanced, yearly_limit, reason, urgent, status, deduct_method, deduct_months, disburse_date, reviewed_by, reject_reason, deducted_so_far, created_at, updated_at)
SELECT 'ADV-2026-0001', emp.id, 5000000, 16000000, 5000000, 45000000,
  'Chi phí sửa chữa xe đột xuất', 1, 'completed', 'full', 1, '2026-04-15', acc.id, NULL, 5000000, '2026-04-10 09:00:00', '2026-04-20 10:00:00'
FROM users emp, users acc WHERE emp.email = 'employee1@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO advance_requests (code, user_id, amount, monthly_salary, yearly_advanced, yearly_limit, reason, urgent, status, deduct_method, deduct_months, disburse_date, reviewed_by, reject_reason, deducted_so_far, created_at, updated_at)
SELECT 'ADV-2026-0002', emp.id, 10000000, 15000000, 10000000, 45000000,
  'Đặt cọc thuê nhà mới', 0, 'deducting', 'split', 2, '2026-05-01', acc.id, NULL, 5000000, '2026-04-25 14:00:00', '2026-05-05 09:00:00'
FROM users emp, users acc WHERE emp.email = 'employee2@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO advance_requests (code, user_id, amount, monthly_salary, yearly_advanced, yearly_limit, reason, urgent, status, deduct_method, deduct_months, disburse_date, reviewed_by, reject_reason, deducted_so_far, created_at, updated_at)
SELECT 'ADV-2026-0003', emp.id, 3000000, 8000000, 3000000, 24000000,
  'Chi phí học tiếng Anh', 0, 'approved', 'full', 1, '2026-06-20', acc.id, NULL, 0, '2026-06-10 10:00:00', '2026-06-12 14:00:00'
FROM users emp, users acc WHERE emp.email = 'employee3@example.com' AND acc.email = 'accountant@example.com';

INSERT INTO advance_requests (code, user_id, amount, monthly_salary, yearly_advanced, yearly_limit, reason, urgent, status, deduct_method, deduct_months, disburse_date, reviewed_by, reject_reason, deducted_so_far, created_at, updated_at)
SELECT 'ADV-2026-0004', emp.id, 8000000, 14000000, 0, 42000000,
  'Chi phí cưới hỏi', 1, 'pending', NULL, NULL, NULL, NULL, NULL, 0, '2026-06-18 16:00:00', '2026-06-18 16:00:00'
FROM users emp WHERE emp.email = 'employee5@example.com';

-- ============================================================
-- 16. PAYROLLS (5 phiếu lương tháng 2026-06)
-- ============================================================
INSERT INTO payrolls (user_id, month, base_salary, allowance, bonus, deduction, advance, tax, insurance_company, insurance_employee, net_salary, status, is_payslip_sent, payment_date, created_at, updated_at)
SELECT emp.id, '2026-06',
  16000000, 5000000, 3000000, 200000, 0,
  595000, 3360000, 1680000, 21525000,
  'paid', 1, '2026-06-25 10:00:00', NOW(), NOW()
FROM users emp WHERE emp.email = 'employee1@example.com';

INSERT INTO payrolls (user_id, month, base_salary, allowance, bonus, deduction, advance, tax, insurance_company, insurance_employee, net_salary, status, is_payslip_sent, payment_date, created_at, updated_at)
SELECT emp.id, '2026-06',
  15000000, 500000, 0, 0, 5000000,
  325000, 3150000, 1575000, 8600000,
  'approved', 0, NULL, NOW(), NOW()
FROM users emp WHERE emp.email = 'employee2@example.com';

INSERT INTO payrolls (user_id, month, base_salary, allowance, bonus, deduction, advance, tax, insurance_company, insurance_employee, net_salary, status, is_payslip_sent, payment_date, created_at, updated_at)
SELECT emp.id, '2026-06',
  8000000, 0, 0, 200000, 3000000,
  0, 1680000, 840000, 3960000,
  'calculated', 0, NULL, NOW(), NOW()
FROM users emp WHERE emp.email = 'employee3@example.com';

INSERT INTO payrolls (user_id, month, base_salary, allowance, bonus, deduction, advance, tax, insurance_company, insurance_employee, net_salary, status, is_payslip_sent, payment_date, created_at, updated_at)
SELECT emp.id, '2026-06',
  14000000, 700000, 0, 500000, 0,
  238000, 2940000, 1470000, 12492000,
  'calculated', 0, NULL, NOW(), NOW()
FROM users emp WHERE emp.email = 'employee5@example.com';

INSERT INTO payrolls (user_id, month, base_salary, allowance, bonus, deduction, advance, tax, insurance_company, insurance_employee, net_salary, status, is_payslip_sent, payment_date, created_at, updated_at)
SELECT emp.id, '2026-06',
  20000000, 0, 0, 0, 0,
  1395000, 4200000, 2100000, 16505000,
  'draft', 0, NULL, NOW(), NOW()
FROM users emp WHERE emp.email = 'accountant@example.com';

-- ============================================================
-- 17. ACTIVITY LOGS (5 log mẫu)
-- ============================================================
INSERT INTO activity_logs (user_id, action, detail, ip, user_agent, is_read, created_at)
SELECT u.id, 'USER_LOGIN', 'Đăng nhập thành công', '127.0.0.1', 'Mozilla/5.0 Chrome/125.0', 1, '2026-06-18 08:01:00'
FROM users u WHERE u.email = 'accountant@example.com';

INSERT INTO activity_logs (user_id, action, detail, ip, user_agent, is_read, created_at)
SELECT u.id, 'PAYROLL_CALCULATE', 'Tính lương tháng 2026-06 cho 5 nhân viên', '127.0.0.1', 'Mozilla/5.0 Chrome/125.0', 0, '2026-06-18 09:30:00'
FROM users u WHERE u.email = 'accountant@example.com';

INSERT INTO activity_logs (user_id, action, detail, ip, user_agent, is_read, created_at)
SELECT u.id, 'LEAVE_APPROVED', 'Duyệt đơn nghỉ phép của Lê Văn Bình', '127.0.0.1', 'Mozilla/5.0 Chrome/125.0', 1, '2026-05-30 09:00:00'
FROM users u WHERE u.email = 'manager@example.com';

INSERT INTO activity_logs (user_id, action, detail, ip, user_agent, is_read, created_at)
SELECT u.id, 'ADVANCE_APPROVED', 'Duyệt tạm ứng ADV-2026-0003', '127.0.0.1', 'Mozilla/5.0 Chrome/125.0', 0, '2026-06-12 14:00:00'
FROM users u WHERE u.email = 'accountant@example.com';

INSERT INTO activity_logs (user_id, action, detail, ip, user_agent, is_read, created_at)
SELECT u.id, 'USER_LOGIN', 'Đăng nhập thành công', '127.0.0.1', 'Mozilla/5.0 Safari/17.0', 1, '2026-06-18 08:05:00'
FROM users u WHERE u.email = 'manager@example.com';

-- ============================================================
-- 18. SUPPLEMENT DATA (bổ sung cho các TC biên)
-- ============================================================

-- TC_062: leave_request đã approved từ 10/07–12/07/2026 (để test trùng lịch)
INSERT INTO leave_requests (user_id, type, start_date, end_date, total_days, ot_hours, reason, status, approved_by, approved_at, reject_reason, created_at, updated_at)
SELECT u_emp.id, 'leave', '2026-07-10', '2026-07-12', 3, NULL,
  'Nghỉ phép gia đình', 'approved', u_mgr.id, '2026-07-01 09:00:00', NULL, '2026-06-28 10:00:00', '2026-07-01 09:00:00'
FROM users u_emp, users u_mgr
WHERE u_emp.email = 'employee1@example.com' AND u_mgr.email = 'manager@example.com';

-- TC_070: thêm 11 users dummy để tổng >20 users (cần cho pagination test)
INSERT INTO users (id, name, email, password, role, department_id, status, created_at) VALUES
(11, 'Trần Văn A',    'user11@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 2, 'active', NOW()),
(12, 'Nguyễn Thị B',  'user12@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 2, 'active', NOW()),
(13, 'Lê Văn C',      'user13@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 3, 'active', NOW()),
(14, 'Phạm Thị D',    'user14@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 4, 'active', NOW()),
(15, 'Hoàng Văn E',   'user15@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 5, 'active', NOW()),
(16, 'Đỗ Thị F',      'user16@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 2, 'active', NOW()),
(17, 'Vũ Văn G',      'user17@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 3, 'active', NOW()),
(18, 'Bùi Thị H',     'user18@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 4, 'inactive', NOW()),
(19, 'Đinh Văn I',    'user19@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 5, 'active', NOW()),
(20, 'Phan Thị K',    'user20@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 2, 'active', NOW()),
(21, 'Cao Văn L',     'user21@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 3, 'active', NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name), role = VALUES(role), department_id = VALUES(department_id), status = VALUES(status);

-- TC_055: user lương 60tr (> trần BHXH 46.8tr) để test BHXH ceiling
INSERT INTO users (id, name, email, password, role, department_id, status, created_at) VALUES
(22, 'Giám Đốc Test', 'director.test@atria.vn', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 1, 'active', NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), department_id = VALUES(department_id);

INSERT INTO payrolls (user_id, month, base_salary, allowance, bonus, deduction, advance, tax, insurance_company, insurance_employee, net_salary, status, is_payslip_sent, payment_date, created_at, updated_at)
VALUES (22, '2026-06',
  60000000, 0, 0, 0, 0,
  -- BHXH đúng phải tính trên trần 46.8tr: 46800000*8%=3744000; BHYT: 46800000*1.5%=702000; BHTN: 46800000*1%=468000 -> total BH employee = 4914000
  -- Thuế: TNTT = 60tr - 4914000 - 11tr = 44086000
  -- Bậc 1: 250000; Bậc 2: (10tr-5tr)*10%=500000; Bậc 3: (18tr-10tr)*15%=1200000; Bậc 4: (32tr-18tr)*20%=2800000; Bậc 5: (44.086tr-32tr)*25%=3021500 => Tổng = 7771500
  7771500, 9360000, 4914000, 43714500,
  'draft', 0, NULL, NOW(), NOW());

-- ============================================================
-- DONE
-- ============================================================
SELECT 'Seed data loaded successfully!' AS result;
SELECT CONCAT('departments: ', COUNT(*)) AS summary FROM departments
UNION ALL SELECT CONCAT('users: ', COUNT(*)) FROM users
UNION ALL SELECT CONCAT('contracts: ', COUNT(*)) FROM contracts
UNION ALL SELECT CONCAT('payrolls: ', COUNT(*)) FROM payrolls
UNION ALL SELECT CONCAT('advance_requests: ', COUNT(*)) FROM advance_requests
UNION ALL SELECT CONCAT('salary_adjustments: ', COUNT(*)) FROM salary_adjustments
UNION ALL SELECT CONCAT('attendances: ', COUNT(*)) FROM attendances
UNION ALL SELECT CONCAT('tasks: ', COUNT(*)) FROM tasks;
