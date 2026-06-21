const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  createUser,
  getPendingAccountRequests,
  approveAccountRequest,
  rejectAccountRequest,
  resetUserPassword,
  getActivityLogs,
} = require('../controllers/admin.controller');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  updateDepartmentStatus,
} = require('../controllers/department.controller');

// Dashboard stats
router.get('/dashboard', authenticateToken, authorizeAdmin, getDashboardStats);

// Activity Logs
router.get('/activity-logs', authenticateToken, authorizeAdmin, getActivityLogs);

// User management
router.get('/users', authenticateToken, authorizeAdmin, getUsers);
router.post('/users', authenticateToken, authorizeAdmin, createUser);  // Tạo user mới
router.get('/users/:userId', authenticateToken, authorizeAdmin, getUserById);
router.put('/users/:userId/status', authenticateToken, authorizeAdmin, updateUserStatus);
router.put('/users/:userId/role', authenticateToken, authorizeAdmin, updateUserRole);
router.put('/users/:userId/reset-password', authenticateToken, authorizeAdmin, resetUserPassword);

// Yêu cầu cấp tài khoản
router.get('/account-requests/pending', authenticateToken, authorizeAdmin, getPendingAccountRequests);
router.post('/account-requests/:id/approve', authenticateToken, authorizeAdmin, approveAccountRequest);
router.post('/account-requests/:id/reject', authenticateToken, authorizeAdmin, rejectAccountRequest);

// ---- Department Management ----
// Lấy danh sách phòng ban (Admin + HR đều dùng)
router.get('/departments', authenticateToken, getDepartments);
// Tạo mới phòng ban (chỉ Admin)
router.post('/departments', authenticateToken, authorizeAdmin, createDepartment);
// Sửa tên/mô tả phòng ban (chỉ Admin)
router.put('/departments/:id', authenticateToken, authorizeAdmin, updateDepartment);
// Kích hoạt / Vô hiệu hóa phòng ban (chỉ Admin)
router.put('/departments/:id/status', authenticateToken, authorizeAdmin, updateDepartmentStatus);

module.exports = router;
