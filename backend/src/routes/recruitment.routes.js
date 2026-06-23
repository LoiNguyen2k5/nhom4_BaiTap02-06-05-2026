const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload.middleware');
const {
  getCandidates,
  getCandidateById,
  createCandidate,
  moveStage,
  updateCandidate,
  deleteCandidate,
  getStats,
  getPositions,
  analyzeCV,
} = require('../controllers/candidate.controller');

// Tất cả route đều yêu cầu đăng nhập
router.use(authenticateToken);

router.get('/stats',        getStats);
router.get('/positions',    getPositions);
router.get('/candidates',   getCandidates);
router.get('/candidates/:id',  getCandidateById);
router.post('/candidates',     createCandidate);
router.put('/candidates/:id',  updateCandidate);
router.put('/candidates/:id/stage', moveStage);
router.delete('/candidates/:id',    deleteCandidate);

// ── AI: Phân tích CV tự động ────────────────────────────────
router.post('/candidates/:id/analyze-cv', upload.single('cv'), analyzeCV);

module.exports = router;
