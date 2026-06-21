const express = require('express');
const router = express.Router();
const adjustmentController = require('../controllers/adjustment.controller');
const { authenticateToken } = require('../middlewares/auth');

// Tất cả route cần đăng nhập
router.use(authenticateToken);

// Chỉ accountant và admin được phép quản lý khoản
const authorizeAccountant = (req, res, next) => {
  if (req.user && (req.user.role === 'accountant' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Quyền truy cập bị từ chối. Cần quyền Kế toán.',
  });
};

// Danh sách nhân viên (để chọn khi tạo khoản) — accountant/admin
router.get('/employees', authorizeAccountant, adjustmentController.getEmployees);

// CRUD khoản
router.get('/',    authorizeAccountant, adjustmentController.getAll);
router.post('/',   authorizeAccountant, adjustmentController.create);
router.patch('/:id/status', authorizeAccountant, adjustmentController.updateStatus);
router.delete('/:id',       authorizeAccountant, adjustmentController.remove);

module.exports = router;
