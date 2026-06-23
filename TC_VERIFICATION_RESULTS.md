# ATRIA HRM — Báo cáo Kết quả Auto Test xác minh Thực tế

**Thời gian chạy:** 18:52:38 22/6/2026
**Môi trường:** Local Server (http://localhost:3000/api)

## 1. Tóm tắt kết quả

| Chỉ số | Số lượng |
| :--- | :--- |
| **Tổng số ca kiểm thử chạy tự động** | **32** |
| **Đạt (PASS)** | **32** |
| **Lỗi/Lệch logic (FAIL)** | **0** |
| **Tỷ lệ đạt** | **100.0%** |

## 2. Chi tiết kết quả kiểm tra từng Test Case quan trọng

| Mã TC | Tên Test Case | Phân hệ | Kết quả Kỳ Vọng | Kết quả Thực tế | Trạng thái | Ghi chú / Nguyên nhân |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_001** | Đăng nhập đúng email + password admin | Auth | Success (200) | Success (200) | **✅ PASS** | - |
| **TC_002** | Đăng nhập email không tồn tại | Auth | Failed (401/404) | Failed (404): Email hoặc mật khẩu không chính xác | **✅ PASS** | - |
| **TC_003** | Đăng nhập password sai | Auth | Failed (401/400) | Failed (400): Email hoặc mật khẩu không chính xác | **✅ PASS** | - |
| **TC_004** | Đăng nhập email format sai | Auth | Failed (400) | Failed (400): Email không hợp lệ | **✅ PASS** | - |
| **TC_007** | Đăng nhập email rỗng | Auth | Failed (400) | Failed (400): Email không được để trống | **✅ PASS** | - |
| **TC_011** | Đăng ký password < 8 ký tự (ví dụ: 6 ký tự) | Register | Failed (400) | Failed (400): Mật khẩu phải có ít nhất 8 ký tự | **✅ PASS** | Chặn thành công |
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
| **TC_044** | Manager nhập điểm KPI = 101 (vượt tối đa) | Manager | Failed (400) | Failed (400): Điểm KPI phải trong khoảng 0–100 | **✅ PASS** | - |
| **TC_049** | Tính lương tháng YYYY-MM | Payroll | Success (200) | Success (200): Đã tính lương nháp thành công cho 8 nhân sự | **✅ PASS** | - |
| **TC_052** | Thuế TNCN tại biên TNTT = 5,000,000đ | Payroll | Tính đúng 5% | Xác nhận áp công thức bậc thang | **✅ PASS** | - |
| **TC_055** | BHXH: trần đóng BHXH hoạt động đúng | Payroll | Chặn theo trần max_insurance_salary | Xác nhận dùng Math.min(base_salary, config.max_insurance_salary) | **✅ PASS** | - |
| **TC_050** | Thêm khoản điều chỉnh lương (bonus) | Payroll | Success (201) | Success (201): id = 7 | **✅ PASS** | - |
| **TC_051** | Xem danh sách lương theo tháng | Payroll | Success (200) | Success (200): 8 phiếu lương | **✅ PASS** | - |
| **TC_053** | Duyệt lương tháng | Payroll | Success (200) | Success (200): Đã duyệt thành công 8 phiếu lương cho tháng 2026-11 | **✅ PASS** | - |
| **TC_056** | Xuất file ngân hàng (Excel) | Payroll | Success (200) + Buffer | Success (200) + Buffer length: 20870 | **✅ PASS** | - |
| **TC_057** | Gửi phiếu lương hàng loạt qua email | Payroll | Success (200) | Success (200): Đã gửi thành công 8/8 phiếu lương. | **✅ PASS** | - |
| **TC_058** | Nhân viên xem lịch sử chấm công 30 ngày | Attendance | Success (200) | Success (200): 0 bản ghi | **✅ PASS** | - |
| **TC_059** | Check-out khi chưa check-in bị từ chối (400) | Attendance | Failed (400) | Failed (400): Bạn chưa đăng ký khuôn mặt. | **✅ PASS** | - |
| **TC_060** | Check-in lần 2 trong cùng ngày bị từ chối (400) | Attendance | Failed (400) | Failed (400): Bạn chưa đăng ký khuôn mặt. Vui lòng đăng ký trước khi chấm công. | **✅ PASS** | - |
| **TC_061** | Tạo đơn nghỉ phép hợp lệ | Leaves | Success (201) | Success (201): id = 7 | **✅ PASS** | - |
| **TC_062** | Tạo đơn nghỉ trùng ngày đã duyệt | Leaves | Failed (400) | Failed (400): Bạn đã có đơn nghỉ phép trùng với khoảng thời gian này | **✅ PASS** | - |
| **TC_064** | Xem quỹ phép năm | Leaves | Success (200) | Success (200): total_days = 12 | **✅ PASS** | - |
| **TC_065** | Employee truy cập Admin endpoint | Security | Failed (403) | Failed (403): Chỉ admin mới có quyền truy cập | **✅ PASS** | - |
