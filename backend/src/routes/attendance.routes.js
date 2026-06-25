const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticateToken } = require('../middlewares/auth');

// Mọi user đã đăng nhập đều có thể chấm công
router.use(authenticateToken);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/my-history', attendanceController.getMyHistory);
router.get('/check-face-registered', attendanceController.checkFaceRegistered);
router.post('/register-face', attendanceController.registerFace);

// HR: Đăng ký / kiểm tra khuôn mặt cho nhân viên cụ thể
router.get('/check-face-registered/:userId', attendanceController.checkFaceRegisteredForEmployee);
router.post('/register-face/:userId', attendanceController.registerFaceForEmployee);

module.exports = router;

