const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// GET /api/config/tax-insurance (Public hoặc Private đều được, nhưng Private an toàn hơn)
router.get('/tax-insurance', authenticateToken, configController.getConfig);

// PUT /api/config/tax-insurance (Cho phép Admin và Accountant)
router.put('/tax-insurance', authenticateToken, authorizeRoles(['admin', 'accountant']), configController.updateConfig);

module.exports = router;
