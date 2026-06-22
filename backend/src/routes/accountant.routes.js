const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountant.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Chỉ cho phép Kế toán (accountant) hoặc Admin truy cập
router.use(authenticateToken);
router.use(authorizeRoles(['admin', 'accountant']));

// Get payrolls
router.get('/payroll', accountantController.getPayrolls);

// Export bank file
router.get('/payroll/export', accountantController.exportBankFile);

// Send payslip single
router.post('/payroll/:id/send-payslip', accountantController.sendPayslip);

// Send payslip batch
router.post('/payroll/send-batch-payslips', accountantController.sendBatchPayslips);

module.exports = router;
