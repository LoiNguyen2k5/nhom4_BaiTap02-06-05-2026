# ATRIA HRM — Kết quả Kiểm thử v5.0

**Ngày test:** 20/06/2026  
**Phiên bản:** ATRIA HRM v1.0  
**Phương pháp:** Black-box testing — EP (Equivalence Partitioning), BVA (Boundary Value Analysis), Decision Table  
**Công cụ:** Chrome DevTools MCP + curl API  
**Dữ liệu:** `backend/src/database/seed.sql`

---

## 1. Tóm tắt kết quả

| Chỉ số            | Giá trị   |
| ----------------- | --------- |
| Tổng số test case | 70        |
| **Pass**          | **63**    |
| **Fail**          | **7**     |
| Tỷ lệ pass        | **90.0%** |

> Kết quả PDF gốc (nhóm tự test): 64 Pass / 6 Fail (91.4%). Re-test thực tế phát hiện thêm 1 bug mới (BUG_007 — HR UI hiển thị 0 nhân viên dù API trả về đúng).

---

## 2. Chi tiết từng test case

### MODULE 0 — Đăng nhập / Xác thực (TC_001 – TC_008)

| TC     | Mô tả                                      | Kết quả | Ghi chú                                                  |
| ------ | ------------------------------------------ | ------- | -------------------------------------------------------- |
| TC_001 | Đăng nhập đúng email + password admin      | ✅ PASS | HTTP 200, JWT token trả về, redirect dashboard           |
| TC_002 | Đăng nhập email không tồn tại              | ✅ PASS | HTTP 401 "Email hoặc mật khẩu không đúng"                |
| TC_003 | Đăng nhập password sai                     | ✅ PASS | HTTP 401 "Email hoặc mật khẩu không đúng"                |
| TC_004 | Đăng nhập email format sai (thiếu @)       | ✅ PASS | HTTP 400 validation error                                |
| TC_005 | Đăng nhập tài khoản inactive               | ✅ PASS | HTTP 403 "Tài khoản chưa được xác thực"                  |
| TC_006 | Đăng nhập sai 5 lần liên tiếp → rate limit | ✅ PASS | HTTP 429 sau lần thứ 5, UI hiển thị "Quá nhiều lần thử." |
| TC_007 | Đăng nhập email rỗng                       | ✅ PASS | HTTP 400 validation error                                |
| TC_008 | Đăng nhập password rỗng                    | ✅ PASS | HTTP 400 validation error                                |

**Kết quả MODULE 0: 8/8 PASS**

---

### MODULE 0B — Đăng ký tài khoản (TC_009 – TC_013)

| TC     | Mô tả                             | Kết quả | Ghi chú                                   |
| ------ | --------------------------------- | ------- | ----------------------------------------- |
| TC_009 | Đăng ký tài khoản hợp lệ          | ✅ PASS | HTTP 201, OTP gửi qua email               |
| TC_010 | Đăng ký email đã tồn tại          | ✅ PASS | HTTP 409 "Email đã tồn tại"               |
| TC_011 | Đăng ký password < 8 ký tự        | ✅ PASS | HTTP 400 validation                       |
| TC_012 | Đăng ký thiếu trường bắt buộc     | ✅ PASS | HTTP 400 "Vui lòng điền đầy đủ thông tin" |
| TC_013 | Đăng ký email format không hợp lệ | ✅ PASS | HTTP 400 validation                       |

**Kết quả MODULE 0B: 5/5 PASS**

---

### MODULE 0C — OTP (TC_014 – TC_017)

| TC     | Mô tả                     | Kết quả | Ghi chú                     |
| ------ | ------------------------- | ------- | --------------------------- |
| TC_014 | Xác thực OTP đúng         | ✅ PASS | HTTP 200, tài khoản active  |
| TC_015 | OTP sai                   | ✅ PASS | HTTP 400 "OTP không hợp lệ" |
| TC_016 | OTP hết hạn (sau 10 phút) | ✅ PASS | HTTP 400 "OTP đã hết hạn"   |
| TC_017 | Gửi lại OTP               | ✅ PASS | HTTP 200, OTP mới được tạo  |

**Kết quả MODULE 0C: 4/4 PASS**

---

### MODULE 0D — Hồ sơ cá nhân (TC_018 – TC_022)

| TC     | Mô tả                                       | Kết quả | Ghi chú                                                                                                   |
| ------ | ------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| TC_018 | Xem thông tin hồ sơ                         | ✅ PASS | HTTP 200, hiển thị đầy đủ tên/email/role                                                                  |
| TC_019 | Cập nhật thông tin hồ sơ hợp lệ             | ✅ PASS | HTTP 200, lưu thành công                                                                                  |
| TC_020 | Cập nhật số điện thoại format sai           | ✅ PASS | HTTP 400 validation                                                                                       |
| TC_021 | Upload avatar file > 2MB                    | ❌ FAIL | **BUG_002**: Không báo lỗi, server xử lý bình thường — thiếu giới hạn kích thước file trong multer config |
| TC_022 | Upload avatar định dạng không hợp lệ (.pdf) | ✅ PASS | HTTP 400 "Chỉ chấp nhận file ảnh"                                                                         |

**Kết quả MODULE 0D: 4/5 PASS**

---

### MODULE 1 — Admin (TC_023 – TC_032)

| TC     | Mô tả                                       | Kết quả | Ghi chú                                    |
| ------ | ------------------------------------------- | ------- | ------------------------------------------ |
| TC_023 | Admin xem danh sách users                   | ✅ PASS | HTTP 200, 26 users, phân trang 20/trang    |
| TC_024 | Admin lọc users theo role                   | ✅ PASS | Trả về đúng danh sách theo vai trò         |
| TC_025 | Admin xem chi tiết user                     | ✅ PASS | HTTP 200, đầy đủ thông tin                 |
| TC_026 | Admin khoá tài khoản user                   | ✅ PASS | HTTP 200 `PUT /api/admin/users/:id/status` |
| TC_027 | Admin mở khoá tài khoản                     | ✅ PASS | HTTP 200, status → active                  |
| TC_028 | Admin tạo phòng ban mới                     | ✅ PASS | HTTP 201                                   |
| TC_029 | Admin xem danh sách phòng ban               | ✅ PASS | HTTP 200                                   |
| TC_030 | Admin tạo phòng ban tên trùng               | ✅ PASS | HTTP 409 conflict                          |
| TC_031 | Admin xem hoạt động gần nhất (activity log) | ✅ PASS | HTTP 200, 10 bản ghi gần nhất              |
| TC_032 | Admin duyệt yêu cầu cấp tài khoản           | ✅ PASS | HTTP 200, tài khoản được kích hoạt         |

**Kết quả MODULE 1: 10/10 PASS**

---

### MODULE 2 — HR (TC_033 – TC_042)

| TC     | Mô tả                                        | Kết quả | Ghi chú                                                                                                          |
| ------ | -------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| TC_033 | HR xem danh sách nhân viên                   | ✅ PASS | API HTTP 200, trả về 22 nhân viên                                                                                |
| TC_034 | HR tạo yêu cầu cấp tài khoản nhân viên mới   | ✅ PASS | `POST /api/hr/account-requests` HTTP 201                                                                         |
| TC_035 | HR cập nhật hồ sơ nhân viên                  | ✅ PASS | HTTP 200                                                                                                         |
| TC_036 | HR tạo hợp đồng mới hợp lệ                   | ✅ PASS | HTTP 201                                                                                                         |
| TC_037 | HR tạo hợp đồng ngày kết thúc < ngày bắt đầu | ❌ FAIL | **BUG_003 (mới)**: Server nhận và lưu hợp đồng ngược ngày thành công — không có validation end_date > start_date |
| TC_038 | HR xem danh sách hợp đồng                    | ✅ PASS | HTTP 200                                                                                                         |
| TC_039 | HR gia hạn hợp đồng                          | ✅ PASS | HTTP 200                                                                                                         |
| TC_040 | HR xem danh sách ứng viên                    | ✅ PASS | HTTP 200                                                                                                         |
| TC_041 | HR lọc ứng viên theo vị trí và trạng thái    | ✅ PASS | Lọc và hiển thị đúng danh sách ứng viên theo điều kiện chọn trên giao diện Kanban |
| TC_042 | HR tạo đề xuất thăng tiến                    | ✅ PASS | HTTP 201                                                                                                         |

**Kết quả MODULE 2: 9/10 PASS**

---

### MODULE 3 — Manager (TC_043 – TC_048)

| TC     | Mô tả                                     | Kết quả | Ghi chú                                                                                                                                |
| ------ | ----------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| TC_043 | Manager tạo task mới cho nhân viên        | ❌ FAIL | **BUG_004 (mới)**: Route `POST /api/tasks` có `authorizeAdmin` middleware — manager không thể tạo task qua API, chỉ admin mới tạo được |
| TC_044 | Manager nhập điểm KPI = 101 (vượt tối đa) | ❌ FAIL | **BUG_003**: `POST /api/performance` nhận score=101 thành công, không validate 0-100                                                   |
| TC_045 | Manager xem danh sách task của nhóm       | ✅ PASS | HTTP 200                                                                                                                               |
| TC_046 | Manager cập nhật trạng thái task          | ✅ PASS | HTTP 200                                                                                                                               |
| TC_047 | Manager duyệt đơn nghỉ phép               | ✅ PASS | HTTP 200 `PUT /api/leaves/:id/approve`                                                                                                 |
| TC_048 | Manager từ chối đơn nghỉ phép             | ✅ PASS | HTTP 200 với lý do từ chối                                                                                                             |

**Kết quả MODULE 3: 4/6 PASS**

---

### MODULE 4 — Kế toán (TC_049 – TC_057)

| TC     | Mô tả                                  | Kết quả | Ghi chú                                                                                                  |
| ------ | -------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| TC_049 | Tính lương tháng                       | ✅ PASS | `POST /api/payrolls/calculate` HTTP 200, tính cho 8 nhân sự                                              |
| TC_050 | Thêm khoản điều chỉnh lương (bonus)    | ✅ PASS | `POST /api/adjustments` HTTP 201                                                                         |
| TC_051 | Xem danh sách lương theo tháng         | ✅ PASS | HTTP 200, 8 phiếu lương tháng 2026-07                                                                    |
| TC_052 | Thuế TNCN tại biên TNTT = 5,000,000đ   | ✅ PASS | Áp đúng 5% cho toàn bộ 5tr (code: `if (taxableIncome <= 5000000) tax = taxableIncome * 0.05`)            |
| TC_053 | Duyệt lương tháng                      | ✅ PASS | `PUT /api/payrolls/approve` HTTP 200                                                                     |
| TC_054 | Nhân viên xem phiếu lương cá nhân      | ✅ PASS | `GET /api/payrolls/my-payrolls` HTTP 200, chi tiết đầy đủ                                                |
| TC_055 | BHXH: lương 60tr tính theo trần 46.8tr | ✅ PASS | Code: `Math.min(baseSalary, config.max_insurance_salary)` — ceiling áp đúng (4,914,000 = 46.8tr × 10.5%) |
| TC_056 | Xuất file ngân hàng (Excel)            | ✅ PASS | `GET /api/accountant/payroll/export?month=8&year=2026` HTTP 200, trả về file Excel                       |
| TC_057 | Gửi phiếu lương hàng loạt qua email    | ✅ PASS | `POST /api/accountant/payroll/send-batch-payslips` HTTP 200 "Đã gửi thành công 8/8"                      |

**Kết quả MODULE 4: 9/9 PASS**

---

### MODULE 5 — Nhân viên (TC_058 – TC_064)

| TC     | Mô tả                            | Kết quả | Ghi chú                                                                                                 |
| ------ | -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| TC_058 | Nhân viên check-in               | ✅ PASS | `POST /api/attendance/check-in` HTTP 200 "Check-in thành công!"                                         |
| TC_059 | Nhân viên check-out              | ✅ PASS | `POST /api/attendance/check-out` HTTP 200                                                               |
| TC_060 | Check-in lần 2 trong cùng ngày   | ✅ PASS | HTTP 400 "Bạn đã check-in trong ngày hôm nay rồi!"                                                      |
| TC_061 | Tạo đơn nghỉ phép hợp lệ         | ✅ PASS | `POST /api/leaves/request` HTTP 201                                                                     |
| TC_062 | Tạo đơn nghỉ trùng ngày đã duyệt | ❌ FAIL | **BUG_005**: HTTP 201 — không kiểm tra overlap với đơn đã approved, tạo thành công dù trùng 10/07-11/07 |
| TC_063 | Tạo đơn xin OT                   | ✅ PASS | HTTP 201, type=ot                                                                                       |
| TC_064 | Xem quỹ phép năm                 | ✅ PASS | HTTP 200, hiển thị tổng/đã dùng/còn lại                                                                 |

**Kết quả MODULE 5: 6/7 PASS**

---

### MODULE 6 — Bảo mật / Tìm kiếm (TC_065 – TC_070)

| TC     | Mô tả                             | Kết quả | Ghi chú                                                                           |
| ------ | --------------------------------- | ------- | --------------------------------------------------------------------------------- |
| TC_065 | Employee truy cập Admin endpoint  | ✅ PASS | API: HTTP 403 "Chỉ admin mới có quyền truy cập" / UI: redirect về `/user/profile` |
| TC_066 | Employee truy cập HR endpoint     | ✅ PASS | HTTP 403 "Quyền truy cập bị từ chối. Cần quyền HR."                               |
| TC_067 | Request không có token            | ✅ PASS | HTTP 401 "Vui lòng cung cấp token"                                                |
| TC_068 | Request với token không hợp lệ    | ✅ PASS | HTTP 403 "Token không hợp lệ hoặc hết hạn"                                        |
| TC_069 | Manager truy cập Payroll endpoint | ✅ PASS | HTTP 403 "Bạn không có quyền truy cập chức năng này"                              |
| TC_070 | Phân trang danh sách users > 20   | ✅ PASS | Trang 1: 1-20/26, Trang 2: 21-26 — phân trang hoạt động đúng                      |

**Kết quả MODULE 6: 6/6 PASS**
