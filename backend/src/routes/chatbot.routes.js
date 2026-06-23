const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const jwt = require('jsonwebtoken');

// Middleware xác thực tùy chọn: nếu có token thì parse, không có thì vẫn tiếp tục
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_cua_ban', (err, user) => {
    req.user = err ? null : user;
    next();
  });
};

// POST /api/chatbot/message
router.post('/message', optionalAuth, chatbotController.chat);

module.exports = router;
