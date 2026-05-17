const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Route Danh sách tài khoản
router.get('/users', adminController.getUsers);

module.exports = router;
