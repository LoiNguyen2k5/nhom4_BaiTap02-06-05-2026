const rateLimit = require('express-rate-limit');

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3, 
    message: { message: 'Quá nhiều yêu cầu gửi OTP từ IP này, vui lòng thử lại sau 15 phút.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { forgotPasswordLimiter };