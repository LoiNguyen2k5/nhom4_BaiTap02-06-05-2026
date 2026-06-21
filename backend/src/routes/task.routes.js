const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const {
  getAllTasks,
  getMyTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/task.controller');

const authorizeManagerOrAdmin = authorizeRoles(['admin', 'manager']);

router.get('/my', authenticateToken, getMyTasks);
router.get('/', authenticateToken, authorizeManagerOrAdmin, getAllTasks);
router.post('/', authenticateToken, authorizeManagerOrAdmin, createTask);
router.put('/:taskId', authenticateToken, authorizeManagerOrAdmin, updateTask);
router.put('/:taskId/status', authenticateToken, updateTaskStatus);
router.delete('/:taskId', authenticateToken, authorizeManagerOrAdmin, deleteTask);

module.exports = router;