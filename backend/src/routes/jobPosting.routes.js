const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdminOrHR } = require('../middlewares/auth');
const {
  getJobPostings,
  getJobPostingById,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
} = require('../controllers/jobPosting.controller');

router.use(authenticateToken, authorizeAdminOrHR);

router.get('/job-postings', getJobPostings);
router.get('/job-postings/:id', getJobPostingById);
router.post('/job-postings', createJobPosting);
router.put('/job-postings/:id', updateJobPosting);
router.delete('/job-postings/:id', deleteJobPosting);

module.exports = router;
