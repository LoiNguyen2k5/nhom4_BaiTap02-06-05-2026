# ATRIA HRM — Báo cáo Đối chiếu & Xác minh Kết quả Kiểm thử (Test Cases Verification Report)

**Ngày đối chiếu:** 20/06/2026  
**Môi trường kiểm tra:** Workspace Hiện tại (Nhánh `Loi_Payslip`)  
**Tác giả đối chiếu:** Antigravity (AI Coding Assistant)  
**Mục tiêu:** So sánh 70 test cases trong tài liệu kiểm thử của nhóm (`ATRIA_HRM_TestCases_Nhom11_v5.pdf` / `TEST_RESULTS.md`) với mã nguồn thực tế của hệ thống web để xác minh tính chính xác của các kết quả báo cáo (đúng/sai/chưa hiện thực).

---

## 1. Tóm tắt kết quả đối chiếu chung

Qua quá trình đối chiếu trực tiếp mã nguồn của Backend (routes, controllers, middlewares, validations) và Frontend (React Router, components), chúng tôi phát hiện nhiều điểm **sai lệch nghiêm trọng (Discrepancy)** trong báo cáo kết quả tự động (`TEST_RESULTS.md` / `TEST_CASES` PDF). 

Cụ thể:
- **Số lượng Test Cases báo cáo PASS nhưng thực tế KHÔNG HIỆN THỰC hoặc SAI ENDPOINT:** **11 Test Cases** (Chiếm ~15.7% tổng số test cases). Các tính năng Chấm công (Attendance), Tính toán lương động (Payroll Calculation), và Thêm điều chỉnh lương (Adjustments) hoàn toàn chưa có route/controller xử lý trong nhánh code hiện tại, nhưng báo cáo của thành viên khác vẫn ghi nhận là `✅ PASS`.
- **Số lượng Test Cases báo cáo PASS nhưng logic thực tế bị SAI lệch:** **2 Test Cases** (`TC_011` mật khẩu tối thiểu và `TC_042` phân quyền thăng tiến).
- **Số lượng Test Cases báo cáo FAIL đúng thực tế:** **4 Test Cases** (`TC_037` ngày hợp đồng, `TC_043` phân quyền task, `TC_044` điểm KPI, `TC_062` trùng lịch nghỉ).
- **Số lượng Test Cases báo cáo FAIL sai mô tả kỹ thuật:** **1 Test Case** (`TC_021` giới hạn upload avatar thực chất có cấu hình giới hạn 2MB nhưng thiếu middleware xử lý lỗi JSON).

---

## 2. Bảng đối chiếu chi tiết 70 Test Cases

Dưới đây là danh sách toàn bộ 70 Test Cases kèm trạng thái kiểm tra thực tế:

| Mã TC | Phân hệ (Module) | Mô tả Test Case | Kết quả Báo cáo | Thực tế tại Mã Nguồn | Đánh giá & Phát hiện |
|---|---|---|---|---|---|
| **TC_001** | MODULE 0 (Auth) | Đăng nhập đúng email + password admin | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/auth/login` hoạt động đúng. |
| **TC_002** | MODULE 0 (Auth) | Đăng nhập email không tồn tại | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 404 với thông báo ẩn bảo mật. |
| **TC_003** | MODULE 0 (Auth) | Đăng nhập password sai | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 400 với thông báo ẩn bảo mật. |
| **TC_004** | MODULE 0 (Auth) | Đăng nhập email format sai (thiếu @) | ✅ PASS | Hoạt động | **ĐÚNG**. Bị chặn bởi Joi validation ở backend. |
| **TC_005** | MODULE 0 (Auth) | Đăng nhập tài khoản inactive | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 403 "Tài khoản chưa được xác thực". |
| **TC_006** | MODULE 0 (Auth) | Đăng nhập sai 5 lần liên tiếp → rate limit | ✅ PASS | Hoạt động | **ĐÚNG**. Middleware `loginLimiter` giới hạn 5 lần/15 phút. |
| **TC_007** | MODULE 0 (Auth) | Đăng nhập email rỗng | ✅ PASS | Hoạt động | **ĐÚNG**. Joi validation chặn ở backend. |
| **TC_008** | MODULE 0 (Auth) | Đăng nhập password rỗng | ✅ PASS | Hoạt động | **ĐÚNG**. Joi validation chặn ở backend. |
| **TC_009** | MODULE 0B (Register) | Đăng ký tài khoản hợp lệ | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/auth/register` hoạt động đúng. |
| **TC_010** | MODULE 0B (Register) | Đăng ký email đã tồn tại | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 409 "Email này đã được đăng ký". |
| **TC_011** | MODULE 0B (Register) | Đăng ký password < 8 ký tự | ✅ PASS | **Khác biệt** | **SAI BÁO CÁO**. Joi schema `registerValidation` chỉ chặn `min(6)` ký tự. Nên mật khẩu 7 ký tự (vẫn < 8) vẫn đăng ký thành công (HTTP 201). |
| **TC_012** | MODULE 0B (Register) | Đăng ký thiếu trường bắt buộc | ✅ PASS | Hoạt động | **ĐÚNG**. Joi validation chặn và trả về HTTP 400. |
| **TC_013** | MODULE 0B (Register) | Đăng ký email format không hợp lệ | ✅ PASS | Hoạt động | **ĐÚNG**. Joi validation chặn và trả về HTTP 400. |
| **TC_014** | MODULE 0C (OTP) | Xác thực OTP đúng | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/auth/verify-otp` hoạt động đúng. |
| **TC_015** | MODULE 0C (OTP) | OTP sai | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 400. |
| **TC_016** | MODULE 0C (OTP) | OTP hết hạn (sau 10 phút) | ✅ PASS | Hoạt động | **ĐÚNG**. Kiểm tra cột `expires_at` hoạt động đúng. |
| **TC_017** | MODULE 0C (OTP) | Gửi lại OTP | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/auth/resend-otp` hoạt động đúng. |
| **TC_018** | MODULE 0D (Profile) | Xem thông tin hồ sơ | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/profile` hoạt động đúng. |
| **TC_019** | MODULE 0D (Profile) | Cập nhật thông tin hồ sơ hợp lệ | ✅ PASS | Hoạt động | **ĐÚNG**. Lưu thông tin vào bảng `profiles` thành công. |
| **TC_020** | MODULE 0D (Profile) | Cập nhật số điện thoại format sai | ✅ PASS | Hoạt động | **ĐÚNG**. Joi validation chặn SĐT không đủ 10-11 số (HTTP 400). |
| **TC_021** | MODULE 0D (Profile) | Upload avatar file > 2MB | ❌ FAIL | **Khác biệt** | **SAI MÔ TẢ LỖI**. Báo cáo ghi "thiếu giới hạn kích thước trong multer". Thực tế `limits: { fileSize: 2 * 1024 * 1024 }` **đã có**. Lỗi thực sự là server trả về trang lỗi HTML mặc định của Express thay vì JSON do thiếu error-handling middleware. |
| **TC_022** | MODULE 0D (Profile) | Upload avatar định dạng không hợp lệ (.pdf) | ✅ PASS | Hoạt động | **ĐÚNG**. `fileFilter` chặn định dạng lạ thành công (HTTP 400). |
| **TC_023** | MODULE 1 (Admin) | Admin xem danh sách users | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/admin/users` hoạt động đúng. |
| **TC_024** | MODULE 1 (Admin) | Admin lọc users theo role | ✅ PASS | Hoạt động | **ĐÚNG**. Lọc thông qua sequelize query options thành công. |
| **TC_025** | MODULE 1 (Admin) | Admin xem chi tiết user | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/admin/users/:userId` hoạt động đúng. |
| **TC_026** | MODULE 1 (Admin) | Admin khoá tài khoản user | ✅ PASS | Hoạt động | **ĐÚNG**. Cập nhật cột `status = 'inactive'` thành công. |
| **TC_027** | MODULE 1 (Admin) | Admin mở khoá tài khoản | ✅ PASS | Hoạt động | **ĐÚNG**. Cập nhật cột `status = 'active'` thành công. |
| **TC_028** | MODULE 1 (Admin) | Admin tạo phòng ban mới | ✅ PASS | Hoạt động | **ĐÚNG**. Tạo phòng ban thành công. |
| **TC_029** | MODULE 1 (Admin) | Admin xem danh sách phòng ban | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/admin/departments` hoạt động đúng. |
| **TC_030** | MODULE 1 (Admin) | Admin tạo phòng ban tên trùng | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 409 conflict thành công. |
| **TC_031** | MODULE 1 (Admin) | Admin xem hoạt động gần nhất (activity log) | ✅ PASS | Hoạt động | **ĐÚNG**. Xem nhật ký log thành công. |
| **TC_032** | MODULE 1 (Admin) | Admin duyệt yêu cầu cấp tài khoản | ✅ PASS | Hoạt động | **ĐÚNG**. Tạo tài khoản từ bảng `account_requests` thành công. |
| **TC_033** | MODULE 2 (HR) | HR xem danh sách nhân viên | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/hr/employees` hoạt động đúng. |
| **TC_034** | MODULE 2 (HR) | HR tạo yêu cầu cấp tài khoản nhân viên mới | ✅ PASS | Hoạt động | **ĐÚNG**. Lưu thông tin vào bảng `account_requests` thành công. |
| **TC_035** | MODULE 2 (HR) | HR cập nhật hồ sơ nhân viên | ✅ PASS | Hoạt động | **ĐÚNG**. Cập nhật hồ sơ thành công. |
| **TC_036** | MODULE 2 (HR) | HR tạo hợp đồng mới hợp lệ | ✅ PASS | Hoạt động | **ĐÚNG**. Tạo hợp đồng thành công. |
| **TC_037** | MODULE 2 (HR) | HR tạo hợp đồng ngày kết thúc < ngày bắt đầu | ❌ FAIL | **FAIL Đúng** | **BUG XÁC NHẬN**. Hệ thống không kiểm tra tính hợp lệ của ngày, cho phép tạo hợp đồng ngược ngày. |
| **TC_038** | MODULE 2 (HR) | HR xem danh sách hợp đồng | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/hr/contracts` hoạt động đúng. |
| **TC_039** | MODULE 2 (HR) | HR gia hạn hợp đồng | ✅ PASS | Hoạt động | **ĐÚNG**. Cập nhật ngày kết thúc hợp đồng thành công. |
| **TC_040** | MODULE 2 (HR) | HR xem danh sách ứng viên | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/recruitment/candidates` hoạt động đúng. |
| **TC_041** | MODULE 2 (HR) | HR cập nhật trạng thái ứng viên | ✅ PASS | Hoạt động | **ĐÚNG**. Cập nhật trạng thái ứng viên thành công. |
| **TC_042** | MODULE 2 (HR) | HR tạo đề xuất thăng tiến | ✅ PASS | **Khác biệt** | **SAI BÁO CÁO**. API `/api/performance/promotions` có kiểm tra phân quyền cứng `if (req.user.role !== 'manager')` nên HR gửi request sẽ bị trả về HTTP 403 Forbidden chứ không thể PASS. |
| **TC_043** | MODULE 3 (Manager) | Manager tạo task mới cho nhân viên | ❌ FAIL | **FAIL Đúng** | **BUG XÁC NHẬN**. Route `POST /api/tasks` áp dụng middleware `authorizeAdmin` nên Manager bị chặn quyền tạo task. |
| **TC_044** | MODULE 3 (Manager) | Manager nhập điểm KPI = 101 (vượt tối đa) | ❌ FAIL | **Khác biệt** | **UI chặn đúng (PASS) nhưng API thiếu chặn (FAIL)**. Trên UI giao diện, trường nhập có thuộc tính `max={100}` nên trình duyệt chặn hiển thị lỗi "Giá trị phải nhỏ hơn hoặc bằng 100" (Đúng kỳ vọng). Nhưng ở Backend API vẫn lưu được điểm 101 (thiếu validation ở Backend). |
| **TC_045** | MODULE 3 (Manager) | Manager xem danh sách task của nhóm | ✅ PASS | Hoạt động | **ĐÚNG**. Manager xem các task được giao đúng vai trò. |
| **TC_046** | MODULE 3 (Manager) | Manager cập nhật trạng thái task | ✅ PASS | Hoạt động | **ĐÚNG**. Cập nhật trạng thái task thành công. |
| **TC_047** | MODULE 3 (Manager) | Manager duyệt đơn nghỉ phép | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/leaves/:id/approve` hoạt động đúng. |
| **TC_048** | MODULE 3 (Manager) | Manager từ chối đơn nghỉ phép | ✅ PASS | Hoạt động | **ĐÚNG**. Từ chối kèm theo lý do thành công. |
| **TC_049** | MODULE 4 (Accountant) | Tính lương tháng | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Route `POST /api/payrolls/calculate` không tồn tại. |
| **TC_050** | MODULE 4 (Accountant) | Thêm khoản điều chỉnh lương (bonus) | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Route `POST /api/adjustments` không tồn tại. |
| **TC_051** | MODULE 4 (Accountant) | Xem danh sách lương theo tháng | ✅ PASS | Hoạt động | **ĐÚNG**. Route `GET /api/accountant/payroll` có tồn tại (tuy nhiên dữ liệu trống do chưa có tính năng tính lương). |
| **TC_052** | MODULE 4 (Accountant) | Thuế TNCN tại biên TNTT = 5,000,000đ | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Không có logic tính thuế TNCN nào trong nhánh mã nguồn hiện tại. |
| **TC_053** | MODULE 4 (Accountant) | Duyệt lương tháng | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Route `PUT /api/payrolls/approve` không tồn tại. |
| **TC_054** | MODULE 4 (Accountant) | Nhân viên xem phiếu lương cá nhân | ✅ PASS | **Khác biệt** | **SAI BÁO CÁO**. Route `GET /api/payrolls/my-payrolls` không tồn tại. Endpoint thực tế là `GET /api/profile/my-payslips/list`. |
| **TC_055** | MODULE 4 (Accountant) | BHXH: lương 60tr tính theo trần 46.8tr | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Không có logic tính đóng bảo hiểm nào trong nhánh mã nguồn hiện tại. |
| **TC_056** | MODULE 4 (Accountant) | Xuất file ngân hàng (Excel) | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/accountant/payroll/export` có xuất file. |
| **TC_057** | MODULE 4 (Accountant) | Gửi phiếu lương hàng loạt qua email | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/accountant/payroll/send-batch-payslips` có gửi email. |
| **TC_058** | MODULE 5 (Employee) | Nhân viên check-in | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Route `POST /api/attendance/check-in` không tồn tại. |
| **TC_059** | MODULE 5 (Employee) | Nhân viên check-out | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Route `POST /api/attendance/check-out` không tồn tại. |
| **TC_060** | MODULE 5 (Employee) | Check-in lần 2 trong cùng ngày | ✅ PASS | **Chưa hiện thực** | **SAI BÁO CÁO**. Logic chấm công không tồn tại. |
| **TC_061** | MODULE 5 (Employee) | Tạo đơn nghỉ phép hợp lệ | ✅ PASS | Hoạt động | **ĐÚNG**. Tạo đơn nghỉ phép thành công. |
| **TC_062** | MODULE 5 (Employee) | Tạo đơn nghỉ trùng ngày đã duyệt | ❌ FAIL | **FAIL Đúng** | **BUG XÁC NHẬN**. Đơn nghỉ trùng ngày được lưu thành công do hệ thống thiếu hàm kiểm tra khoảng ngày (overlap validation). |
| **TC_063** | MODULE 5 (Employee) | Tạo đơn xin OT | ✅ PASS | Hoạt động | **ĐÚNG**. Lưu đơn OT với `type = 'ot'` thành công. |
| **TC_064** | MODULE 5 (Employee) | Xem quỹ phép năm | ✅ PASS | Hoạt động | **ĐÚNG**. Route `/api/leaves/my-balance` trả về đúng dữ liệu. |
| **TC_065** | MODULE 6 (Security) | Employee truy cập Admin endpoint | ✅ PASS | Hoạt động | **ĐÚNG**. Bị React Router `ProtectedRoute` chặn và đẩy về `/user/profile`. |
| **TC_066** | MODULE 6 (Security) | Employee truy cập HR endpoint | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 403 "Quyền truy cập bị từ chối. Cần quyền HR." |
| **TC_067** | MODULE 6 (Security) | Request không có token | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 401 "Vui lòng cung cấp token". |
| **TC_068** | MODULE 6 (Security) | Request với token không hợp lệ | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về HTTP 403 "Token không hợp lệ hoặc hết hạn". |
| **TC_069** | MODULE 6 (Security) | Manager truy cập Payroll endpoint | ✅ PASS | Hoạt động | **ĐÚNG**. Chỉ Accountant/Admin/HR được cấp quyền tùy endpoint. |
| **TC_070** | MODULE 6 (Security) | Phân trang danh sách users > 20 | ✅ PASS | Hoạt động | **ĐÚNG**. Trả về thông tin phân trang chuẩn Sequelize offset/limit. |

---

## 3. Các điểm phát hiện quan trọng (Key Discrepancies)

### 3.1. Phân hệ Chấm công (Attendance - MODULE 5)
- **Vấn đề:** Báo cáo ghi nhận `TC_058`, `TC_059`, `TC_060` đều `PASS` qua các endpoint `/api/attendance/check-in` và `/api/attendance/check-out`.
- **Thực tế:** 
  - Backend **không có route** hay controller nào xử lý chấm công. Bảng `attendances` trong database có tồn tại cột nhưng không có API tương tác.
  - Frontend có hiển thị mục "Chấm công" trên Sidebar với path `/user/attendance`, nhưng route này **không được đăng ký** trong file `App.jsx` và thư mục `pages/user` không có component `Attendance.jsx`. Nếu người dùng click vào sẽ gặp màn hình trống (blank screen).

### 3.2. Phân hệ Lương & Tính thuế (Payroll & Tax - MODULE 4)
- **Vấn đề:** Báo cáo khẳng định việc tính lương (`TC_049`), thêm khoản điều chỉnh (`TC_050`), duyệt lương (`TC_053`), tính thuế TNCN (`TC_052`), tính chặn trần đóng BHXH (`TC_055`) và xem phiếu lương của nhân viên (`TC_054`) đều `PASS`.
- **Thực tế:**
  - Route tính lương `/api/payrolls/calculate`, điều chỉnh `/api/adjustments`, duyệt `/api/payrolls/approve` và xem lương `/api/payrolls/my-payrolls` **hoàn toàn không tồn tại** trong backend.
  - Logic tính thuế và trần bảo hiểm hoàn toàn chưa được viết (không có controller hay utility class nào thực hiện việc này).
  - Đối với phiếu lương nhân viên, endpoint thực tế là `GET /api/profile/my-payslips/list` chứ không phải `/api/payrolls/my-payrolls`.

### 3.3. Ràng buộc độ dài Mật khẩu khi Đăng ký (MODULE 0B - TC_011)
- **Vấn đề:** Báo cáo ghi nhận mật khẩu `< 8` ký tự bị từ chối (`✅ PASS`).
- **Thực tế:** Validation Joi tại `backend/src/validations/auth.validation.js` chỉ yêu cầu mật khẩu tối thiểu 6 ký tự: `Joi.string().min(6).required()`. Do đó, mật khẩu 7 ký tự (vẫn nhỏ hơn 8) vẫn đăng ký thành công. Báo cáo này là **sai lệch**.

### 3.4. Phân quyền tạo đề xuất thăng tiến (MODULE 2 - TC_042)
- **Vấn đề:** Báo cáo ghi nhận HR tạo đề xuất thăng tiến thành công (`✅ PASS`).
- **Thực tế:** Controller `createPromotionProposal` trong `performance.controller.js` kiểm tra cứng vai trò:
  ```javascript
  if (req.user.role !== 'manager') {
    return res.status(403).json({ success: false, message: 'Forbidden: Manager role required' });
  }
  ```
  HR có vai trò là `hr`, do đó request của HR sẽ bị trả về HTTP 403 Forbidden thay vì thành công.

---

## 4. Đánh giá tính chính xác của các Bug Report (Danh sách lỗi)

Trong tài liệu của nhóm có liệt kê 6 Bug (BUG_001 đến BUG_006). Dưới đây là đánh giá thực tế của từng bug:

1. **BUG_001 (Không rate limit đăng nhập sai):** **SAI**. Thực tế hệ thống có rate limit 5 lần/15 phút hoạt động tốt nhờ middleware `loginLimiter`.
2. **BUG_002 (Không giới hạn dung lượng avatar > 2MB):** **ĐÚNG MỘT PHẦN**. Dung lượng 2MB thực tế có giới hạn trong Multer config, nhưng khi lỗi xảy ra, server trả về HTML crash page thay vì JSON error API (do thiếu middleware xử lý lỗi).
3. **BUG_003 (KPI Score > 100):** **ĐÚNG MỘT PHẦN**. Trên giao diện người dùng (Frontend) đã chặn thành công nhờ HTML5 validation (`max="100"`). Tuy nhiên, lỗi nằm ở Backend khi API chưa có validation kiểm tra khoảng điểm `0-100` trong controller/Joi, cho phép bypass Frontend để gửi request lưu điểm 101.
4. **BUG_004 (Lỗi thuế TNCN tại mốc 5 triệu):** **SAI**. Tính năng tính lương chưa được hiện thực nên bug này không tồn tại trong code hiện tại (chỉ là giả định hoặc viết trên bản mock khác).
5. **BUG_005 (Lỗi trần BHXH):** **SAI**. Lý do tương tự như BUG_004, tính năng chưa được hiện thực.
6. **BUG_006 (Không chặn đơn nghỉ trùng lịch):** **ĐÚNG**. Đơn nghỉ trùng lịch tạo thành công do thiếu overlap validation.

---

## 5. Khuyến nghị hành động tiếp theo (Next Actions)

Để chuẩn bị tốt nhất cho bài báo cáo và kiểm thử của nhóm, chúng tôi đề xuất các bước xử lý sau:
1. **Đoàn kết và đồng bộ hóa các endpoint của Phân hệ Lương (Module 4):**
   - Viết các API: `POST /api/payrolls/calculate`, `POST /api/adjustments`, `PUT /api/payrolls/approve` nếu nhóm muốn hiện thực đầy đủ.
   - Hoặc cập nhật lại tài liệu test case để ghi nhận trạng thái **Chưa hiện thực (Not Implemented)** để tránh bị giảng viên chấm sai khi kiểm tra chéo (cross-verify).
2. **Hiện thực logic Chấm công (Module 5):**
   - Đăng ký route `/user/attendance` trong `App.jsx`.
   - Bổ sung controller xử lý check-in/check-out để khớp với các test cases `TC_058 - TC_060`.
3. **Sửa các lỗi logic đã xác minh (Bug Fixes):**
   - Thêm kiểm tra trùng ngày (overlap validation) cho đơn xin nghỉ phép trong `leave.controller.js`.
   - Giới hạn điểm KPI trong khoảng `0 - 100` tại `performance.controller.js`.
   - Sửa validation đăng ký mật khẩu tối thiểu thành `8` trong `auth.validation.js` để khớp với mô tả kiểm thử.
