const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getProfileById,
  uploadAvatar,
  getMyActivities,
  markMyActivitiesRead,
} = require('../controllers/profile.controller');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const accountantController = require('../controllers/accountant.controller');

router.get('/', authenticateToken, getProfile);
router.get('/activity', authenticateToken, getMyActivities);
router.post('/activity/read', authenticateToken, markMyActivitiesRead);
router.put('/', authenticateToken, updateProfile);
router.post('/avatar', authenticateToken, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Kích thước ảnh không được vượt quá 2MB' : err.message;
      return res.status(400).json({ success: false, message });
    }
    next();
  });
}, uploadAvatar);
router.get('/my-payslips/list', authenticateToken, accountantController.getMyPayslips);
router.get('/:userId', authenticateToken, authorizeAdmin, getProfileById);

module.exports = router;
