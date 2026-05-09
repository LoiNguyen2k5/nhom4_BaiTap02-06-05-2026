const rateLimit = require('express-rate-limit');

// Gioi han dang nhap: 5 lan / 15 phut moi IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'So lan dang nhap vuot qua gioi han, vui long thu lai sau 15 phut',
  },
});

// Gioi han dang ky: 5 lan / 15 phut moi IP (chong spam tai khoan)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'So lan dang ky vuot qua gioi han, vui long thu lai sau 15 phut',
  },
});

module.exports = { loginLimiter, registerLimiter };
