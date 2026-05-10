const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const { sendEmailOTP } = require('../utils/mailer');

exports.generateAndSendOTP = async (email) => {
    const user = await User.findByEmail(email);
    if (!user) {
        throw { status: 404, message: 'Không tìm thấy người dùng với email này.' };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.saveOTP(email, otpCode);
    await sendEmailOTP(email, otpCode);

    return { message: 'Mã OTP đã được gửi đến email của bạn.' };
};

exports.verifyOTPAndResetPassword = async (email, otp, newPassword) => {
    const otpRecord = await OTP.verifyOTP(email, otp);
    
    if (!otpRecord) {
        throw { status: 400, message: 'OTP không hợp lệ hoặc đã quá hạn 5 phút.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updatePassword(email, hashedPassword);
    await OTP.deleteOTP(email);

    return { message: 'Đổi mật khẩu thành công!' };
};