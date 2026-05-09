const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { loginValidation, registerValidation, verifyOtpValidation } = require('../validations/auth.validation');
const { generateOTP, getOTPExpiryDate } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/email');

// ============================================================
// DANG NHAP
// ============================================================
const login = async (req, res) => {
  try {
    // Buoc 1: Validate du lieu dau vao
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    // Buoc 2: Tim user trong database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email hoac password khong chinh xac',
      });
    }

    // Buoc 3: So sanh mat khau da ma hoa
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email hoac password khong chinh xac',
      });
    }

    // Buoc 4: Tao JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key_cua_ban',
      { expiresIn: '24h' }
    );

    // Buoc 5: Xac dinh URL chuyen huong theo Role
    let redirectUrl = '/user/profile';
    if (user.role === 'admin') {
      redirectUrl = '/admin/profile';
    }

    // Buoc 6: Tra ve Response thanh cong
    return res.status(200).json({
      success: true,
      message: 'Dang nhap thanh cong',
      token: token,
      redirectUrl: redirectUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Loi server khi dang nhap',
    });
  }
};

// ============================================================
// DANG KY
// ============================================================
const register = async (req, res) => {
  try {
    // Buoc 1: Validate du lieu dau vao (name >= 2 ky tu, email hop le, password >= 6 ky tu)
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email, password } = req.body;

    // Buoc 2: Kiem tra email da ton tai trong database chua
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email nay da duoc dang ky, vui long su dung email khac',
      });
    }

    // Buoc 3: Ma hoa mat khau bang bcrypt voi 10 rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buoc 4: Luu user moi vao database voi status = 'inactive'
    // (chua kich hoat, cho xac thuc OTP)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      status: 'inactive',
    });

    // Buoc 5: Tao ma OTP 6 chu so, het han sau 10 phut
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiryDate(10);

    // Buoc 6: Luu OTP vao bang otps
    await OTP.create({
      user_id: newUser.id,
      code: otpCode,
      expires_at: expiresAt,
      is_used: false,
    });

    // Buoc 7: Gui ma OTP qua email bang Nodemailer
    await sendOTPEmail(email, name, otpCode);

    // Buoc 8: Tra ve Response 201 thanh cong
    return res.status(201).json({
      success: true,
      message: 'Dang ky thanh cong! Vui long kiem tra email de lay ma OTP xac thuc tai khoan.',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Loi server khi dang ky',
    });
  }
};

// ============================================================
// XAC THUC OTP
// ============================================================
const verifyOtp = async (req, res) => {
  try {
    // Buoc 1: Validate du lieu dau vao
    const { error } = verifyOtpValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, otp } = req.body;

    // Buoc 2: Tim user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay tai khoan voi email nay',
      });
    }

    // Buoc 3: Kiem tra tai khoan da duoc kich hoat chua
    if (user.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Tai khoan nay da duoc xac thuc truoc do',
      });
    }

    // Buoc 4: Tim ban ghi OTP hop le (dung user, dung ma, chua su dung)
    const otpRecord = await OTP.findOne({
      where: {
        user_id: user.id,
        code: otp,
        is_used: false,
      },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Ma OTP khong chinh xac hoac da duoc su dung',
      });
    }

    // Buoc 5: Kiem tra OTP chua het han
    if (otpRecord.expires_at <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Ma OTP da het han, vui long dang ky lai de nhan OTP moi',
      });
    }

    // Buoc 6: Danh dau OTP da duoc su dung
    await otpRecord.update({ is_used: true });

    // Buoc 7: Cap nhat trang thai user thanh active
    await user.update({ status: 'active' });

    // Buoc 8: Tra ve Response thanh cong
    return res.status(200).json({
      success: true,
      message: 'Xac thuc OTP thanh cong! Tai khoan cua ban da duoc kich hoat.',
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Loi server khi xac thuc OTP',
    });
  }
};

module.exports = { login, register, verifyOtp };
