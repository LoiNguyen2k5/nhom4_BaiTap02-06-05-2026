# ATRIA HRM — Báo cáo Đối chiếu Excel Test Cases vs Web Thực tế

**Thời gian đối chiếu:** 18:52:39 22/6/2026
**File Excel:** ATRIA_HRM_TestCases_Nhom11_v5 (1).xlsx

## 1. Tóm tắt đối chiếu

| Chỉ số | Số lượng |
| :--- | :--- |
| **Tổng số ca kiểm thử đối chiếu** | **29** |
| **Trạng thái Khớp (MATCH)** | **28** |
| **Trạng thái Lệch (MISMATCH)** | **1** |

> [!NOTE]
> **Mismatches (Lệch)** xuất hiện khi một testcase được đánh dấu là **Fail** trong Excel (do phát hiện lỗi lúc làm báo cáo thủ công trước đây) nhưng trên Web thực tế hiện tại đã chạy **PASS** (lỗi đã được sửa/bổ sung hoàn thiện).

## 2. Bảng đối chiếu chi tiết

| Mã TC | Tên Test Case | Excel Status | Web Actual | Đối chiếu | Ghi chú & Giải thích |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_001** | Đăng nhập đúng email + password admin | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_002** | Đăng nhập email không tồn tại | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_003** | Đăng nhập password sai | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_004** | Đăng nhập email format sai | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_007** | Đăng nhập email rỗng | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_011** | Đăng ký password < 8 ký tự (ví dụ: 6 ký tự) | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_010** | Đăng ký email đã tồn tại | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_018** | Xem thông tin hồ sơ | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_023** | Admin xem danh sách users | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_029** | Admin xem danh sách phòng ban | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_030** | Admin tạo phòng ban tên trùng | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_033** | HR xem danh sách nhân viên | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_038** | HR xem danh sách hợp đồng | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_037** | HR tạo hợp đồng ngày kết thúc < ngày bắt đầu | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_042** | HR tạo đề xuất thăng tiến | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_043** | Manager tạo task mới cho nhân viên | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_044** | Manager nhập điểm KPI = 101 (vượt tối đa) | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_049** | Tính lương tháng YYYY-MM | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_052** | Thuế TNCN tại biên TNTT = 5,000,000đ | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_055** | BHXH: trần đóng BHXH hoạt động đúng | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_050** | Thêm khoản điều chỉnh lương (bonus) | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_051** | Xem danh sách lương theo tháng | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_053** | Duyệt lương tháng | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_056** | Xuất file ngân hàng (Excel) | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_057** | Gửi phiếu lương hàng loạt qua email | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_058** | Nhân viên xem lịch sử chấm công 30 ngày | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_060** | Check-in lần 2 trong cùng ngày bị từ chối (400) | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_061** | Tạo đơn nghỉ phép hợp lệ | **Pass** | **PASS** | **✅ Khớp** | - |
| **TC_062** | Tạo đơn nghỉ trùng ngày đã duyệt | **Fail** | **PASS** | **⚠️ Lệch** | Trùng lịch xin nghỉ: Excel đánh dấu Fail vì lỗi chưa chặn trùng. Hiện tại Web đã fix thành công (chặn trùng trả về 400). |
