const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Chỉ Kế toán hoặc Admin mới được thao tác lương
router.use(authenticateToken, authorizeRoles(['admin', 'accountant']));

// Lấy danh sách lương theo tháng
router.get('/', payrollController.getPayrollsByMonth);

// Kích hoạt tính lương cho một tháng
router.post('/calculate', payrollController.calculatePayroll);

// Duyệt lương cho một tháng
router.put('/approve', payrollController.approvePayroll);

module.exports = router;
