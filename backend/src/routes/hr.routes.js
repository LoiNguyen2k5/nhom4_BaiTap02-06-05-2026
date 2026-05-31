const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hr.controller');
const hrContractController = require('../controllers/hr.contract.controller');
const authMiddleware = require('../middlewares/auth');

// Apply middleware to all routes in this file
// Chỉ role hr hoặc admin được phép truy cập
router.use(authMiddleware.authenticateToken);
// Tạm thời dùng authorizeAdminOrManager hoặc viết 1 middleware riêng authorizeHR
// Do hệ thống cũ chưa có authorizeHR, ta có thể tự bắt ở đây hoặc tạo middleware mới
const authorizeHR = (req, res, next) => {
  if (req.user && (req.user.role === 'hr' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối. Cần quyền HR.' });
  }
};
router.use(authorizeHR);

// Account Requests
router.post('/account-requests', hrController.createAccountRequest);
router.get('/account-requests', hrController.getMyAccountRequests);

// Update User Profile (Promotion/Transfer)
router.put('/users/:id/profile', hrController.updateUserProfile);

// Contracts (hr.controller - legacy)
router.post('/contracts', hrContractController.createContract);
router.get('/contracts', hrContractController.getAllContracts);
router.get('/contracts/:user_id', hrContractController.getEmployeeContracts);
router.put('/contracts/:contract_id', hrContractController.extendContract);
router.delete('/contracts/:contract_id', hrContractController.deleteContract);
router.put('/contracts/:id/renew', hrController.renewContract);

// Employees list
router.get('/employees', hrContractController.getAllEmployees);

module.exports = router;
