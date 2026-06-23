const express = require('express');
const router = express.Router();
const uploadCV = require('../middlewares/uploadCV');
const { getPublicJobs, getPublicJobById, applyToJob } = require('../controllers/publicJob.controller');

// Không dùng authenticateToken — routes công khai cho ứng viên bên ngoài
router.get('/jobs', getPublicJobs);
router.get('/jobs/:id', getPublicJobById);
router.post('/jobs/:id/apply', uploadCV.single('cv_file'), applyToJob);

module.exports = router;
