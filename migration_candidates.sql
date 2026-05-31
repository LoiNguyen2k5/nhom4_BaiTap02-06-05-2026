-- ================================================
-- MIGRATION: Thêm bảng candidates (Module Tuyển dụng)
-- Chạy file này sau khi đã có database nhom4_baitap
-- ================================================

USE nhom4_baitap;

CREATE TABLE IF NOT EXISTS candidates (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    email               VARCHAR(150) DEFAULT NULL,
    phone               VARCHAR(20)  DEFAULT NULL,
    position            VARCHAR(100) NOT NULL,
    skills              TEXT         DEFAULT NULL,         -- JSON array, e.g. '["React","TypeScript"]'
    experience_years    INT          DEFAULT 0,
    expected_salary     BIGINT       DEFAULT NULL,
    source              ENUM('LinkedIn','TopCV','Referral','Direct','Other') DEFAULT 'Other',
    current_company     VARCHAR(100) DEFAULT NULL,
    note                TEXT         DEFAULT NULL,
    stage               ENUM('new','screening','iv1','iv2','offer','hired','rejected') NOT NULL DEFAULT 'new',
    match_score         FLOAT        DEFAULT 3.5,
    onboard_date        DATE         DEFAULT NULL,
    created_by          INT          DEFAULT NULL,        -- FK tới users.id (nullable)
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_stage   (stage),
    INDEX idx_position(position),
    INDEX idx_email   (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu để test giao diện Kanban
INSERT INTO candidates (name, email, phone, position, skills, experience_years, source, stage, match_score) VALUES
('Nguyễn Thị Linh',  'linh.nguyen@example.com',  '0901234567', 'Frontend Developer', '["React","TypeScript","Next.js"]',     3, 'LinkedIn', 'new',       3.8),
('Trần Văn Bảo',     'bao.tran@example.com',      '0912345678', 'Backend Engineer',   '["Go","gRPC","Redis"]',                 4, 'TopCV',    'new',       4.0),
('Lê Thanh Tùng',    'tung.le@example.com',        NULL,         'iOS Developer',      '["Swift","SwiftUI","Combine"]',         2, 'Direct',   'new',       3.5),
('Phạm Mỹ Linh',     'linh.pham@example.com',      NULL,         'DevOps Engineer',    '["AWS","Terraform","Kubernetes"]',      5, 'Referral', 'new',       4.3),
('Đặng Thu Hà',      'ha.dang@example.com',        '0934567890', 'Frontend Lead',      '["React","Redux","GraphQL","Architecture"]', 7, 'LinkedIn', 'screening', 4.6),
('Phan Văn Đạt',     'dat.phan@example.com',       NULL,         'Backend Engineer',   '["Python","FastAPI","PostgreSQL"]',    4, 'TopCV',    'screening', 4.1),
('Lý Thị Mai',       'mai.ly@example.com',         '0967890123', 'QA Engineer',        '["Cypress","Playwright","Jenkins"]',   3, 'Direct',   'screening', 3.8),
('Hoàng Minh Tâm',   'tam.hoang@example.com',      NULL,         'iOS Developer',      '["Swift","SwiftUI","Combine"]',         6, 'LinkedIn', 'iv1',       4.4),
('Trần Quốc Anh',    'anh.tran@example.com',       '0978901234', 'Backend Engineer',   '["Go","gRPC","Microservices"]',        5, 'Referral', 'iv1',       4.3),
('Nguyễn Thị Mai',   'mai.nguyen@example.com',     NULL,         'Data Engineer',      '["Spark","Airflow","dbt"]',            4, 'LinkedIn', 'iv2',       4.4),
('Vũ Anh Khoa',      'khoa.vu@example.com',        '0989012345', 'Backend Engineer',   '["Java","Spring","Kafka"]',            5, 'TopCV',    'iv2',       4.2),
('Phạm Hồng Nhung',  'nhung.pham@example.com',     NULL,         'Senior Frontend',    '["React","Vue","Performance"]',        6, 'LinkedIn', 'offer',     4.7),
('Lê Văn Sơn',       'son.le@example.com',          '0991234567', 'Senior Backend',    '["Java","Go","Architecture"]',         8, 'Referral', 'offer',     4.8),
('Đinh Văn Sơn',     'son.dinh@example.com',        NULL,         'Backend Engineer',  '["Java","Spring","PostgreSQL"]',       4, 'Direct',   'hired',     4.5);
