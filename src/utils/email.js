const nodemailer = require('nodemailer');

// Khoi tao transporter Gmail SMTP mot lan khi module duoc load
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  // Port 587 dung STARTTLS nen secure: false
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ham gui email chua ma OTP xac thuc tai khoan
const sendOTPEmail = async (toEmail, userName, otpCode) => {
  const mailOptions = {
    from: `"Nhom 4 App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Ma xac thuc OTP - Dang ky tai khoan',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Xac thuc tai khoan</h2>
        <p>Xin chao <strong>${userName}</strong>,</p>
        <p>Cam on ban da dang ky tai khoan. Vui long su dung ma OTP duoi day de xac thuc tai khoan cua ban:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4CAF50;
            background-color: #f5f5f5;
            padding: 15px 25px;
            border-radius: 8px;
            border: 2px dashed #4CAF50;
            display: inline-block;
          ">
            ${otpCode}
          </span>
        </div>
        <p style="color: #666;">Ma OTP nay co hieu luc trong <strong>10 phut</strong>.</p>
        <p style="color: #666;">Neu ban khong thuc hien dang ky nay, vui long bo qua email nay.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">Day la email tu dong, vui long khong tra loi.</p>
      </div>
    `,
  };

  // Nem loi neu gui that bai de controller xu ly
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
