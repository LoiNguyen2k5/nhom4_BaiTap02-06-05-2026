const express = require('express');
const router = express.Router();
const adjustmentController = require('../controllers/adjustment.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Tất cả route cần đăng nhập
router.use(authenticateToken);

const authorizeAccountant = authorizeRoles(['admin', 'accountant']);

// Danh sách nhân viên (để chọn khi tạo khoản) — accountant/admin
router.get('/employees', authorizeAccountant, adjustmentController.getEmployees);

// CRUD khoản
router.get('/',    authorizeAccountant, adjustmentController.getAll);
router.post('/',   authorizeAccountant, adjustmentController.create);
router.patch('/:id/status', authorizeAccountant, adjustmentController.updateStatus);
router.delete('/:id',       authorizeAccountant, adjustmentController.remove);

module.exports = router;
