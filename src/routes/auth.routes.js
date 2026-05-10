const express = require('express');
const router = express.Router();
const { login, register, verifyOtp } = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimiter');

// API dang nhap: POST /api/auth/login
router.post('/login', loginLimiter, login);

// API dang ky: POST /api/auth/register
router.post('/register', registerLimiter, register);

// API xac thuc OTP: POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

module.exports = router;
