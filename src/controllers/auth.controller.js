const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginValidation } = require('../validations/auth.validation');
const login = async (req, res) => {
    try {
        // 1. Validate dữ liệu
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });

        }
        const { email, password } = req.body;
        // 2. Tìm user trong database 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email hoặc password không chính xác'
            })
        }
        // 3. So sánh mật khẩu
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc password không chính xác'
            })
        }
        // 4. Tạo JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key_cua_ban',
            { expiresIn: '24h' }

        );
        //5. Authorization: Xác định URL trả về theo Role
        let redirectUrl = '/user/profile';
        if (user.role === 'admin') {
            redirectUrl = '/admin/profile';
        }

        //6. Trả về Response
        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token: token,
            redirectUrl: redirectUrl,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });
    }
    catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi đăng nhập'
        });
    }
};
module.exports = { login }

