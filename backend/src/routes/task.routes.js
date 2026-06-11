const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');
const {
  getAllTasks,
  getMyTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/task.controller');

router.get('/my', authenticateToken, getMyTasks);
router.get('/', authenticateToken, authorizeAdmin, getAllTasks);
router.post('/', authenticateToken, authorizeAdmin, createTask);
router.put('/:taskId', authenticateToken, authorizeAdmin, updateTask);
router.put('/:taskId/status', authenticateToken, updateTaskStatus);
router.delete('/:taskId', authenticateToken, authorizeAdmin, deleteTask);

module.exports = router;