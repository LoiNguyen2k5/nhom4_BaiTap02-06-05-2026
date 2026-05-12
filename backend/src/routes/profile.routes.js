const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  getProfileById 
} = require('../controllers/profile.controller');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');

// Routes dành cho user
// GET: Lấy profile của user đang đăng nhập
router.get('/', authenticateToken, getProfile);

// PUT: Cập nhật profile của user đang đăng nhập
router.put('/', authenticateToken, updateProfile);

// Routes dành cho admin
// GET: Lấy profile của user theo ID (chỉ admin)
router.get('/:userId', authenticateToken, authorizeAdmin, getProfileById);

module.exports = router;
