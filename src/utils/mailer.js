const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendEmailOTP = async (email, otp) => {
    const mailOptions = {
        from: `"HR Management System" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🔐 Mã OTP Khôi Phục Mật Khẩu',
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f9f9f9; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 32px 24px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 8px;">🔐</div>
                <h1 style="color: #fff; margin: 0; font-size: 22px;">Khôi Phục Mật Khẩu</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">HR Management System</p>
            </div>
            <div style="padding: 32px 24px;">
                <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">Xin chào,</p>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                    Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Dưới đây là mã OTP của bạn:
                </p>
                <div style="background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #4f46e5; font-family: monospace;">${otp}</div>
                </div>
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
                    <p style="color: #92400e; font-size: 13px; margin: 0;">⏰ Mã này sẽ <strong>hết hạn sau 5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                </div>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
            <div style="border-top: 1px solid #e5e7eb; padding: 16px 24px; text-align: center;">
                <p style="color: #d1d5db; font-size: 12px; margin: 0;">© 2024 HR Management System. All rights reserved.</p>
            </div>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmailOTP };