const Joi = require('joi');

// Validation cho dang nhap
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email khong hop le',
      'any.required': 'Vui long nhap email',
      'string.empty': 'Email khong duoc de trong',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password phai co it nhat 6 ky tu',
      'any.required': 'Vui long nhap mat khau',
      'string.empty': 'Mat khau khong duoc de trong',
    }),
  });
  return schema.validate(data);
};

// Validation cho dang ky tai khoan moi
const registerValidation = (data) => {
  const schema = Joi.object({
    // Ten nguoi dung: toi thieu 2 ky tu
    name: Joi.string().min(2).required().messages({
      'string.min': 'Ten phai co it nhat 2 ky tu',
      'any.required': 'Vui long nhap ten',
      'string.empty': 'Ten khong duoc de trong',
    }),
    // Email hop le
    email: Joi.string().email().required().messages({
      'string.email': 'Email khong hop le',
      'any.required': 'Vui long nhap email',
      'string.empty': 'Email khong duoc de trong',
    }),
    // Mat khau: toi thieu 6 ky tu
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password phai co it nhat 6 ky tu',
      'any.required': 'Vui long nhap mat khau',
      'string.empty': 'Mat khau khong duoc de trong',
    }),
  });
  return schema.validate(data);
};

// Validation cho xac thuc OTP
const verifyOtpValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email khong hop le',
      'any.required': 'Vui long nhap email',
      'string.empty': 'Email khong duoc de trong',
    }),
    // OTP phai la chuoi 6 chu so (dung string de giu so 0 dau)
    otp: Joi.string().pattern(/^\d{6}$/).required().messages({
      'string.pattern.base': 'Ma OTP phai la 6 chu so',
      'any.required': 'Vui long nhap ma OTP',
      'string.empty': 'Ma OTP khong duoc de trong',
    }),
  });
  return schema.validate(data);
};

module.exports = { loginValidation, registerValidation, verifyOtpValidation };
