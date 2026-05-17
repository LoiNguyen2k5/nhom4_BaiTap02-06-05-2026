const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
} = require('../controllers/admin.controller');

// Dashboard stats (Nhut)
router.get('/dashboard', authenticateToken, authorizeAdmin, getDashboardStats);

// User management (Tan)
router.get('/users', authenticateToken, authorizeAdmin, getUsers);
router.get('/users/:userId', authenticateToken, authorizeAdmin, getUserById);
router.put('/users/:userId/status', authenticateToken, authorizeAdmin, updateUserStatus);
router.put('/users/:userId/role', authenticateToken, authorizeAdmin, updateUserRole);

module.exports = router;
