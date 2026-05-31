const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  getCandidates,
  getCandidateById,
  createCandidate,
  moveStage,
  updateCandidate,
  deleteCandidate,
  getStats,
  getPositions,
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

module.exports = router;
