# AUDIT REPORT — feature-8
> Ngày kiểm tra: 22/06/2026 | Người thực hiện: BaoCool-dev | Nhánh: `feature-8`

---

## 1. Tóm tắt

| Hạng mục | Số lượng |
|---|---|
| Nhánh được merge | 3 |
| Files thay đổi tổng cộng | ~60 files |
| Lỗi CRITICAL tìm được | 2 |
| Lỗi SECURITY tìm được | 4 |
| Bug tìm được | 8 |
| Vấn đề config tìm được | 4 |
| **Tổng đã fix** | **18** |
| Issues còn tồn tại (thấp ưu tiên) | 5 |

**Trạng thái tổng thể:** ✅ Sẵn sàng test nội bộ — chưa sẵn sàng production

---

## 2. Danh sách nhánh được merge

| Nhánh | Tác giả | Nội dung chính | Commit cuối |
|---|---|---|---|
| `origin/tan_quanLy_keToan` | Tân | Kế toán, quản lý task (manager role), lịch sử phê duyệt, seedData | `d742119` |
| `origin/Loi_Check_HR` | Lợi | HR fixes, chốt công, hợp đồng, tuyển dụng kanban, test results | `e13d273` |
| `origin/Nhut_check_Admin_NhanVien` | Nhựt | Admin dashboard, FaceID chấm công, PDF payslip, activity logs | `5f6a759` |

---

## 3. Issues đã fix

### 🔴 CRITICAL

| # | File | Lỗi | Fix |
|---|---|---|---|
| C1 | `frontend/src/App.jsx` | Import `ApprovalHistory` bị khai báo 2 lần → build error | Xóa dòng import trùng |
| C2 | `backend/src/controllers/attendance.controller.js` | Conflict merge giữa AttendanceLock (Loi) và FaceID (Nhut) → server crash | Merge thủ công giữ cả 2 tính năng, fix cấu trúc try/catch |

### 🔴 SECURITY

| # | File | Lỗi | Fix |
|---|---|---|---|
| S1 | `backend/src/routes/leave.routes.js` | `GET /approval-history` không có role guard → mọi user đều xem được | Thêm `authorizeRoles(['admin', 'manager', 'hr'])` |
| S2 | `backend/src/controllers/task.controller.js` | Manager có thể update task của phòng ban khác | Thêm department scope check: so sánh `department_id` của assignee và manager |
| S3 | `backend/src/controllers/admin.controller.js` | Mật khẩu reset dạng `[EmailPrefix]@123456` — dễ đoán (3 chỗ: createUser, approveAccountRequest, resetUserPassword) | Thay bằng `crypto.randomBytes(8).toString('hex') + '@Tmp1'` |
| S4 | `backend/src/controllers/attendance.controller.js` | Face descriptor không validate độ dài (phải đúng 128 chiều) | Thêm `face_descriptor.length !== 128` vào điều kiện check |

### 🟠 BUG

| # | File | Lỗi | Fix |
|---|---|---|---|
| B1 | `frontend/src/App.jsx` | Import `ApprovalHistory` trùng (từ merge conflict) | Xóa dòng thừa |
| B2 | `backend/src/utils/seedData.js` | `now.getMonth() || 12` → tháng 1 (getMonth()=0) bị hiểu là 12 | Sửa thành `(now.getMonth() + 1) \|\| 12` cho tất cả 8 entry kpiData |
| B3 | `backend/src/validations/auth.validation.js` | Password tối thiểu 6 ký tự — quá ngắn | Tăng lên `min(8)`, cập nhật message |
| B4 | `backend/src/controllers/performance.controller.js` | Không validate `kpi_score` — chấp nhận giá trị > 100 | Thêm check: `kpi_score < 0 \|\| kpi_score > 100 → 400` |
| B5 | `backend/src/controllers/hr.controller.js` | Không validate ngày hợp đồng — cho phép `end_date < start_date` | Thêm check trong `createContract` và `renewContract` |
| B6 | `backend/src/controllers/leave.controller.js` | Không kiểm tra trùng lịch nghỉ phép — tạo được 2 đơn cùng ngày | Thêm `LeaveRequest.findOne` overlap check trước khi tạo đơn |
| B7 | `backend/src/controllers/performance.controller.js` | Import thiếu `Op` sau merge | Thêm `const { Op } = require('sequelize')` |
| B8 | `backend/src/controllers/admin.controller.js` | Comment trong conflict resolution tham chiếu code cũ | Dọn dẹp khi merge |

### 🟡 CONFIG

| # | File | Vấn đề | Fix |
|---|---|---|---|
| CF1 | `backend/src/controllers/attendance.controller.js` | Face threshold `0.55` hardcode | Đọc từ `process.env.FACE_MATCH_THRESHOLD`, fallback `0.55` |
| CF2 | `backend/.env` | Thiếu biến `FACE_MATCH_THRESHOLD` | Thêm `FACE_MATCH_THRESHOLD=0.55` |
| CF3 | `.gitignore` | Model files face-api (~9MB) bị commit vào git | Thêm `frontend/public/models/` vào `.gitignore`, chạy `git rm --cached` |
| CF4 | `backend/src/routes/task.routes.js` | Import `authorizeAdmin` thừa sau merge | Xóa import không dùng, giữ `authorizeRoles` |

---

## 4. Issues còn tồn tại (chưa fix — ưu tiên thấp)

| # | Mức độ | File | Vấn đề | Gợi ý xử lý |
|---|---|---|---|---|
| R1 | 🟡 Medium | `frontend/src/pages/manager/ApprovalHistory.jsx` | Search input gọi API mỗi keystroke — không có debounce | Thêm `useDebounce` hook hoặc `setTimeout` 400ms |
| R2 | 🟡 Medium | `backend/src/controllers/admin.controller.js` | Login chart fetch toàn bộ 24h logs rồi bucket trong memory | Dùng `DATE_FORMAT()` + `GROUP BY` ở DB level |
| R3 | 🟡 Medium | `backend/src/controllers/hr.controller.js` | N+1 query trong `getAllContracts` — không có pagination limit | Thêm `limit/offset`, optimize include attributes |
| R4 | 🟡 Medium | `backend/src/controllers/admin.controller.js` | Password reset không gửi email thông báo cho user (TODO comment còn đó) | Implement `sendMail` sau khi update password |
| R5 | 🔵 Low | `backend/src/utils/seedData.js` | Không có transaction — nếu fail giữa chừng data bị partial | Wrap toàn bộ trong `sequelize.transaction()` |

---

## 5. Ghi chú kiến trúc

### Luồng FaceID (mới từ Nhut)
```
Frontend AttendancePage
  → camera stream (face-api.js)
  → detect + extract 128-dim descriptor
  → POST /api/attendance/check-in { face_descriptor: [...128 số] }
  → Backend: validate length 128
  → Query Profile.face_descriptor (stored as JSON string)
  → euclideanDistance(input, saved) < FACE_MATCH_THRESHOLD (0.55)
  → Kiểm tra AttendanceLock tháng hiện tại (từ Loi)
  → Tạo/update Attendance record
```

### Middleware chain (task routes)
```
authenticateToken → authorizeRoles(['admin', 'manager']) → controller
```
Manager chỉ được thao tác task trong phòng ban của mình (department scope check trong controller).

### Routes mới sau merge

**Backend:**
- `GET /api/leaves/approval-history` — Lịch sử phê duyệt (admin/manager/hr)
- `GET /api/leaves/history` — Alias cùng chức năng
- `PUT /api/admin/users/:userId/reset-password` — Reset mật khẩu random
- `GET /api/admin/activity-logs` — Nhật ký hệ thống có phân trang
- `POST /api/attendance/register-face` — Đăng ký khuôn mặt
- `GET /api/attendance/check-face-registered` — Kiểm tra đã đăng ký chưa

**Frontend routes:**
- `/manager/approval-history` → `ApprovalHistory`
- `/manager/tasks` → `ManagerTasks`
- `/admin/activity-logs` → `ActivityLogs`
- `/hr/reports` → `HRAttendanceReport`

### Files mới thêm vào feature-8
- `backend/src/entities/` — 19 entity files (layer định nghĩa schema)
- `backend/src/database/seed.sql` — SQL seed đầy đủ cho dev (cần chạy sau `sync()`)
- `backend/src/utils/helpers.js` — `roleNames`, `mapEmployeeProfile` utilities
- `frontend/src/utils/constants.js` — `ROLE_BADGE` mapping

---

## 6. Phân tích hiệu suất

| Điểm | Mức độ | Mô tả |
|---|---|---|
| N+1 query trong getAllContracts | 🟠 Cao | Include User + Profile không có attributes limit |
| Login chart bucket trong memory | 🟡 Trung bình | OK với <1000 logins/ngày, cần DB aggregation khi scale |
| Face-api models load không retry | 🟡 Trung bình | Nếu model load fail, toàn bộ trang attendance crash |
| Search không debounce | 🟡 Trung bình | Mỗi keystroke gọi 1 API request |
| ActivityLog không có index | 🟡 Trung bình | Query `WHERE action LIKE '%...'` sẽ chậm khi log nhiều |
| `sequelize.sync({ alter: false })` | 🟢 OK | Đúng cho production — không tự sửa schema |

---

## 7. Hướng dẫn setup sau merge

### Biến `.env` mới cần thêm
```bash
# backend/.env
FACE_MATCH_THRESHOLD=0.55
```

### Download face-api models (bắt buộc sau clone)
```bash
cd /path/to/project
node download-models.js
# Models sẽ được tải về frontend/public/models/
```

### Seed database
**Cách 1 — Tự động qua initDb (khuyên dùng):**
```bash
cd backend
node src/config/initDb.js
# Tạo database + sync schema + seed toàn bộ dữ liệu mẫu
```

**Cách 2 — SQL thuần (nếu cần reset nhanh):**
```bash
# Chạy backend 1 lần trước để Sequelize tạo tables, sau đó:
mysql -u root nhom4_baitap < backend/src/database/seed.sql
# ⚠️ TRUNCATE toàn bộ data — CHỈ dùng cho môi trường DEV
```

### Tài khoản test sau seed
| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin@123456 |
| HR | hr1@example.com | User@123456 |
| Manager | manager1@example.com | User@123456 |
| Kế toán | accountant@example.com | User@123456 |
| Nhân viên | emp1@example.com | User@123456 |

---

## 8. Checklist kiểm tra thủ công

### ✅ Đã fix — cần verify

- [ ] **C1** — `npm run build` frontend không báo lỗi duplicate import
- [ ] **S1** — `GET /api/leaves/approval-history` với token employee → 403
- [ ] **S1** — `GET /api/leaves/approval-history` với token manager → 200
- [ ] **S2** — Manager update task phòng ban khác → 403
- [ ] **S2** — Manager update task phòng ban mình → 200
- [ ] **S3** — Reset password 2 lần cho cùng 1 user → 2 password khác nhau
- [ ] **S4** — Check-in với face_descriptor có 10 phần tử → 400
- [ ] **B2** — KPI month trong seed: tháng 6 → lưu `month=6` (không phải 0 hay 12)
- [ ] **B3** — Đăng ký password 6 ký tự → 400 validation error
- [ ] **B4** — Submit KPI score = 150 → 400; score = 85 → 200
- [ ] **B5** — Tạo hợp đồng với `end_date < start_date` → 400
- [ ] **B6** — Tạo 2 đơn nghỉ phép cùng ngày → lần 2 trả về 400 trùng lịch
- [ ] **CF3** — `git ls-files frontend/public/models/` → trống

### 🔄 Chưa fix — cần test thêm

- [ ] **R1** — Gõ nhanh vào search ApprovalHistory → kiểm tra số request gửi đi (chấp nhận nếu <5/giây)
- [ ] **R4** — Reset password → user có nhận email không (hiện tại: chưa, cần implement)

### 🆕 Tính năng mới cần test

- [ ] FaceID — Đăng ký khuôn mặt thành công
- [ ] FaceID — Check-in/out bằng khuôn mặt
- [ ] PDF — Xuất phiếu lương dạng PDF
- [ ] Activity Logs — Admin xem nhật ký hệ thống
- [ ] Approval History — Manager xem lịch sử phê duyệt với filter ngày/loại
- [ ] Kanban Recruitment — HR kéo thả ứng viên qua các cột
- [ ] Excel export — HR xuất báo cáo chấm công dạng .xlsx
- [ ] Đề xuất thăng chức — Manager tạo → HR/Admin duyệt

---

## 9. Git log tóm tắt (feature-8)

```
189b62f  fix: security, bug fixes, config sau merge 3 nhanh vao feature-8
c3f84a3  merge: Nhut_check_Admin_NhanVien - admin dashboard, FaceID attendance, PDF payslip, activity logs
767ceaf  merge: Loi_Check_HR - HR module fixes, attendance lock, recruitment kanban, test results
2d8d62c  merge: tan_quanLy_keToan - quan ly ke toan, task manager, approval history
2b09481  chore: xoa file Figma, database.sql, design.md, migration files khoi repo
d742119  feat: Thêm script reset database và tự động khởi tạo dữ liệu mẫu phong phú  (base from main)
```
