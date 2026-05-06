const Joi = require('joi');
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Email không hợp lệ',
            'any.required': 'Vui lòng nhập email'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password phải có ít nhất 6 ký tự',
            'any.required': 'Vui lòng nhập mật khẩu'
        })

    });
    return schema.validate(data);
};
module.exports = { loginValidation };
