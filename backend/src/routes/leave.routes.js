const express = require('express');
const router = express.Router();

// Import controller mà chúng ta vừa viết
const leaveController = require('../controllers/leave.controller');

// Import middleware xác thực (bắt buộc phải đăng nhập mới được gọi)
const { authenticateToken } = require('../middlewares/auth');

// ==========================================
// API DÀNH CHO NHÂN VIÊN (Dùng chung authenticateToken)
// ==========================================

// Bắt buộc tất cả các route ở dưới đều phải đi qua bước kiểm tra đăng nhập
router.use(authenticateToken);

// [GET] /api/leaves/my-balance -> Xem quỹ phép năm nay của tôi
router.get('/my-balance', leaveController.getMyLeaveBalance);

// [GET] /api/leaves/my-requests -> Xem lịch sử các đơn tôi đã nộp
router.get('/my-requests', leaveController.getMyLeaveRequests);

// [POST] /api/leaves/request -> Nộp đơn xin nghỉ phép hoặc xin OT
router.post('/request', leaveController.createLeaveRequest);

// ==========================================
// API DÀNH CHO QUẢN LÝ (MANAGER)
// ==========================================

// [GET] /api/leaves/pending -> Lấy danh sách đơn đang chờ duyệt
router.get('/pending', leaveController.getPendingRequests);

// [PUT] /api/leaves/:id/approve -> Quản lý Duyệt hoặc Từ chối đơn (kèm lý do)
router.put('/:id/approve', leaveController.approveOrRejectRequest);

// [GET] /api/leaves/schedule -> Lấy danh sách đơn đã duyệt để hiển thị lên Lịch
router.get('/schedule', leaveController.getTeamSchedule);

// [GET] /api/leaves/approval-history -> Lịch sử phê duyệt (Manager xem đã duyệt/từ chối gì)
router.get('/approval-history', leaveController.getApprovalHistory);

module.exports = router;
