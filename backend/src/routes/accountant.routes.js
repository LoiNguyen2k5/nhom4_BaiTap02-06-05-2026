const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountant.controller');
const authMiddleware = require('../middlewares/auth');

// Chỉ cho phép Kế toán (accountant) hoặc Admin truy cập
router.use(authMiddleware.authenticateToken);

const authorizeAccountant = (req, res, next) => {
  if (req.user && (req.user.role === 'accountant' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối. Cần quyền Kế toán.' });
  }
};
router.use(authorizeAccountant);

// Get payrolls
router.get('/payroll', accountantController.getPayrolls);

// Export bank file
router.get('/payroll/export', accountantController.exportBankFile);

// Send payslip single
router.post('/payroll/:id/send-payslip', accountantController.sendPayslip);

// Send payslip batch
router.post('/payroll/send-batch-payslips', accountantController.sendBatchPayslips);

module.exports = router;
