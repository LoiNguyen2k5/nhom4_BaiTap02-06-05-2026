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

router.get('/my', authenticateToken, getMyTasks);
router.get('/', authenticateToken, authorizeRoles(['admin', 'manager']), getAllTasks);
router.post('/', authenticateToken, authorizeRoles(['admin', 'manager']), createTask);
router.put('/:taskId', authenticateToken, authorizeRoles(['admin', 'manager']), updateTask);
router.put('/:taskId/status', authenticateToken, updateTaskStatus);
router.delete('/:taskId', authenticateToken, authorizeRoles(['admin', 'manager']), deleteTask);

module.exports = router;