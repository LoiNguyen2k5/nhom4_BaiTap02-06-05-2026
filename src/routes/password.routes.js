const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const passwordController = require('../controllers/password.controller');
const { forgotPasswordLimiter } = require('../middlewares/rateLimit');

router.post('/forgot-password', 
    forgotPasswordLimiter,
    [
        body('email').isEmail().withMessage('Email không hợp lệ.')
    ], 
    passwordController.requestOTP
);

router.post('/reset-password', 
    [
        body('email').isEmail().withMessage('Email không hợp lệ.'),
        body('otp').not().isEmpty().withMessage('OTP không được để trống.'),
        body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải từ 6 ký tự.')
    ], 
    passwordController.resetPassword
);

module.exports = router;