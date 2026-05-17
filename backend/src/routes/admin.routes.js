const express = require('express');
const router = express.Router();

// Middleware xác thực token và kiểm tra quyền admin (đã có sẵn)
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');

// Controller vừa tạo
const { getDashboardStats } = require('../controllers/admin.controller');

// GET /api/admin/dashboard
// - authenticateToken : kiểm tra token JWT hợp lệ
// - authorizeAdmin    : kiểm tra role === 'admin'
// - getDashboardStats : xử lý và trả về số liệu
router.get('/dashboard', authenticateToken, authorizeAdmin, getDashboardStats);

module.exports = router;
