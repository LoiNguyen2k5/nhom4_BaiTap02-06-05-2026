const bcrypt = require('bcrypt');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmailOTP } = require('../utils/mailer');

exports.generateAndSendOTP = async (email) => {
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { status: 404, message: 'Không tìm thấy người dùng với email này.' };
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Calculate expiry time (5 minutes from now)
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP to database
    await OTP.create({
      user_id: user.id,
      otp_code: otpCode,
      type: 'forgot_password',
      expired_at: expiryTime
    });

    // Send email
    await sendEmailOTP(email, otpCode);

    return { 
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra trong 5 phút.' 
    };
  } catch (error) {
    throw error;
  }
};

exports.verifyOTPAndResetPassword = async (email, otp, newPassword) => {
  try {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { status: 404, message: 'Không tìm thấy người dùng.' };
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      where: { 
        user_id: user.id,
        otp_code: otp,
        type: 'forgot_password'
      }
    });

    if (!otpRecord) {
      throw { status: 400, message: 'Mã OTP không hợp lệ.' };
    }

    // Check if OTP has expired
    if (new Date() > new Date(otpRecord.expired_at)) {
      await otpRecord.destroy();
      throw { status: 400, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu OTP mới.' };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await user.update({ password: hashedPassword });

    // Delete OTP
    await otpRecord.destroy();

    return { 
      success: true,
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' 
    };
  } catch (error) {
    throw error;
  }
};