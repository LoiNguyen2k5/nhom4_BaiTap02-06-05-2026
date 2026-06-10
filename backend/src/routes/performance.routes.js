const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performance.controller');
const { authenticateToken } = require('../middlewares/auth');

// Dashboard data
router.get('/dashboard', authenticateToken, performanceController.getDashboardData);
router.get('/dashboard/:userId', authenticateToken, performanceController.getDashboardData);

// Performance reviews (HR/Manager)
router.post('/reviews', authenticateToken, performanceController.submitReview);

// Promotion proposals (HR/Manager)
router.get('/promotions', authenticateToken, performanceController.getPromotionProposals);
router.post('/promotions', authenticateToken, performanceController.createPromotionProposal);
router.patch('/promotions/:id/status', authenticateToken, performanceController.updatePromotionStatus);

// Employees list
router.get('/employees', authenticateToken, performanceController.getAllEmployees);

module.exports = router;
