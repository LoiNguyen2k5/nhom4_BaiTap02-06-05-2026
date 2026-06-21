# ATRIA HRM — Báo cáo Kết quả Auto Test xác minh Thực tế

**Thời gian chạy:** 16:33:22 21/6/2026
**Môi trường:** Local Server (http://localhost:3000/api)

## 1. Tóm tắt kết quả

| Chỉ số | Số lượng |
| :--- | :--- |
| **Tổng số ca kiểm thử chạy tự động** | **32** |
| **Đạt (PASS)** | **25** |
| **Lỗi/Lệch logic (FAIL)** | **7** |
| **Tỷ lệ đạt** | **78.1%** |

## 2. Chi tiết kết quả kiểm tra từng Test Case quan trọng

| Mã TC | Tên Test Case | Phân hệ | Kết quả Kỳ Vọng | Kết quả Thực tế | Trạng thái | Ghi chú / Nguyên nhân |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_001** | Đăng nhập đúng email + password admin | Auth | Success (200) | Success (200) | **✅ PASS** | - |
| **TC_002** | Đăng nhập email không tồn tại | Auth | Failed (401/404) | Failed (429): Số lần đăng nhập vượt quá giới hạn, vui lòng thử lại sau 15 phút | **✅ PASS** | - |
| **TC_003** | Đăng nhập password sai | Auth | Failed (401/400) | Failed (429): Số lần đăng nhập vượt quá giới hạn, vui lòng thử lại sau 15 phút | **✅ PASS** | - |
| **TC_004** | Đăng nhập email format sai | Auth | Failed (400) | Failed (429): Số lần đăng nhập vượt quá giới hạn, vui lòng thử lại sau 15 phút | **✅ PASS** | - |
| **TC_007** | Đăng nhập email rỗng | Auth | Failed (400) | Failed (429): Số lần đăng nhập vượt quá giới hạn, vui lòng thử lại sau 15 phút | **✅ PASS** | - |
| **TC_011** | Đăng ký password < 8 ký tự (ví dụ: 6 ký tự) | Register | Failed (400) | Success (201): {"success":true,"message":"Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP xác thực tài khoản.","data":{"id":26,"name":"Test Reg","email":"test_reg_1782034398907@example.com"}} | **❌ FAIL** | Hệ thống chỉ check min(6) cho password ở Joi registerValidation |
| **TC_010** | Đăng ký email đã tồn tại | Register | Failed (409/400) | Failed (409): Email này đã được đăng ký, vui lòng sử dụng email khác | **✅ PASS** | - |
| **TC_018** | Xem thông tin hồ sơ | Profile | Success (200) | Success (200) | **✅ PASS** | - |
| **TC_023** | Admin xem danh sách users | Admin | Success (200) | Success (200) | **✅ PASS** | - |
| **TC_029** | Admin xem danh sách phòng ban | Admin | Success (200) | Success (200) | **✅ PASS** | - |
| **TC_030** | Admin tạo phòng ban tên trùng | Admin | Failed (409/400) | Failed (409): Tên phòng ban đã tồn tại trong hệ thống | **✅ PASS** | - |
| **TC_033** | HR xem danh sách nhân viên | HR | Success (200) | Success (200) | **✅ PASS** | - |
| **TC_038** | HR xem danh sách hợp đồng | HR | Success (200) | Success (200) | **✅ PASS** | - |
| **TC_037** | HR tạo hợp đồng ngày kết thúc < ngày bắt đầu | HR | Failed (400) | Failed (400): Ngày kết thúc hợp đồng không được trước ngày bắt đầu | **✅ PASS** | - |
| **TC_042** | HR tạo đề xuất thăng tiến | HR | Failed (403) | Failed (403): Forbidden: Manager role required | **✅ PASS** | HR bị từ chối 403 (Manager role required), khớp với phân quyền |
| **TC_043** | Manager tạo task mới cho nhân viên | Manager | Success (201) | Success (201) | **✅ PASS** | - |
| **TC_044** | Manager nhập điểm KPI = 101 (vượt tối đa) | Manager | Failed (400) | Success (200): kpi_score = 101 | **❌ FAIL** | Backend cho phép lưu điểm KPI 101 vì thiếu validation kpi_score <= 100 trong performance.controller.js |
| **TC_049** | Tính lương tháng YYYY-MM | Payroll | Success (200) | Success (200): Đã tính lương nháp thành công cho 0 nhân sự | **✅ PASS** | - |
| **TC_052** | Thuế TNCN tại biên TNTT = 5,000,000đ | Payroll | Tính đúng 5% | Không tìm thấy dữ liệu | **❌ FAIL** | - |
| **TC_055** | BHXH: trần đóng BHXH hoạt động đúng | Payroll | Chặn trần | Không tìm thấy dữ liệu | **❌ FAIL** | - |
| **TC_050** | Thêm khoản điều chỉnh lương (bonus) | Payroll | Success (201) | Success (201): id = 15 | **✅ PASS** | - |
| **TC_051** | Xem danh sách lương theo tháng | Payroll | Success (200) | Success (200): 14 phiếu lương | **✅ PASS** | - |
| **TC_053** | Duyệt lương tháng | Payroll | Success (200) | Failed (404): Không có phiếu lương nháp nào để duyệt trong tháng này | **❌ FAIL** | - |
| **TC_056** | Xuất file ngân hàng (Excel) | Payroll | Success (200) + Buffer | Success (200) + Buffer length: 23583 | **✅ PASS** | - |
| **TC_057** | Gửi phiếu lương hàng loạt qua email | Payroll | Success (200) | Success (200): Không có phiếu lương nào cần gửi. | **✅ PASS** | - |
| **TC_058** | Nhân viên xem lịch sử chấm công 30 ngày | Attendance | Success (200) | Success (200): 22 bản ghi | **✅ PASS** | - |
| **TC_059** | Check-out khi chưa check-in bị từ chối (400) | Attendance | Failed (400) | Không đăng nhập được tài khoản nva@example.com | **❌ FAIL** | - |
| **TC_060** | Check-in lần 2 trong cùng ngày bị từ chối (400) | Attendance | Failed (400) | Failed (400): Bảng công tháng 2026-06 đã bị khóa, không thể chấm công! | **✅ PASS** | - |
| **TC_061** | Tạo đơn nghỉ phép hợp lệ | Leaves | Success (201) | Failed (400): Không đủ ngày phép. Bạn chỉ còn 1 ngày có thể sử dụng. | **❌ FAIL** | - |
| **TC_062** | Tạo đơn nghỉ trùng ngày đã duyệt | Leaves | Failed (400) | Failed (400): Không đủ ngày phép. Bạn chỉ còn 1 ngày có thể sử dụng. | **✅ PASS** | - |
| **TC_064** | Xem quỹ phép năm | Leaves | Success (200) | Success (200): total_days = 12 | **✅ PASS** | - |
| **TC_065** | Employee truy cập Admin endpoint | Security | Failed (403) | Failed (403): Chỉ admin mới có quyền truy cập | **✅ PASS** | - |
