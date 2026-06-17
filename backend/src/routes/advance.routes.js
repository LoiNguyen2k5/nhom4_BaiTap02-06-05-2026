const express = require('express');
const router = express.Router();
const advanceController = require('../controllers/advance.controller');
const { authenticateToken } = require('../middlewares/auth');

// Tất cả route cần đăng nhập
router.use(authenticateToken);

// Middleware: accountant hoặc admin
const authorizeAccountant = (req, res, next) => {
  if (req.user && (req.user.role === 'accountant' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Quyền truy cập bị từ chối. Cần quyền Kế toán.',
  });
};

// ── Stats (phải khai báo trước /:id để không bị nhầm route)
router.get('/stats',     authorizeAccountant, advanceController.getStats);
router.get('/employees', authorizeAccountant, advanceController.getEmployees);

// ── CRUD
router.get('/',    authorizeAccountant, advanceController.getAll);
router.get('/:id', authorizeAccountant, advanceController.getOne);
router.post('/',   authorizeAccountant, advanceController.create);

// ── Actions
router.post('/:id/approve',  authorizeAccountant, advanceController.approve);
router.post('/:id/reject',   authorizeAccountant, advanceController.reject);
router.post('/:id/disburse', authorizeAccountant, advanceController.disburse);

module.exports = router;
