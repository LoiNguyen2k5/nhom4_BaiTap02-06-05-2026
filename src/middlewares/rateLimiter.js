const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 phút
    max: 5, // tối đa 5 lần cho mỗi IP trong 15 phút
    message: {
        success: false,
        message: 'Số lần đăng nhập vượt quá giới hạn, vui lòng thử lại sau 15 phút',
    },
});
module.exports = { loginLimiter };