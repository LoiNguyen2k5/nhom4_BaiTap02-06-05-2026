const { Op } = require('sequelize');
const { Task, User } = require('../models');

const TASK_INCLUDE = [
  { model: User, as: 'assignee', attributes: ['id', 'name', 'email', 'role', 'status'] },
  { model: User, as: 'assigner', attributes: ['id', 'name', 'email', 'role'] },
];

const isValidTaskStatus = (status) => ['todo', 'in_progress', 'review', 'done', 'cancelled'].includes(status);
const isValidTaskPriority = (priority) => ['low', 'medium', 'high', 'urgent'].includes(priority);

const normalizeTask = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  priority: task.priority,
  status: task.status,
  due_date: task.due_date,
  completed_at: task.completed_at,
  created_at: task.created_at,
  updated_at: task.updated_at,
  assigned_to_id: task.assigned_to_id,
  assigned_by_id: task.assigned_by_id,
  assignee: task.assignee,
  assigner: task.assigner,
});

const ensureAssignableUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return { error: 'Không tìm thấy nhân viên được giao việc' };
  if (user.role === 'admin') return { error: 'Không thể giao việc cho admin' };
  return { user };
};

const getAllTasks = async (req, res) => {
  try {
    const { search, status, priority, assigned_to_id } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status && isValidTaskStatus(status)) whereClause.status = status;
    if (priority && isValidTaskPriority(priority)) whereClause.priority = priority;
    if (assigned_to_id) whereClause.assigned_to_id = assigned_to_id;

    const tasks = await Task.findAll({
      where: whereClause,
      include: TASK_INCLUDE,
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({ success: true, data: tasks.map(normalizeTask) });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách task' });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assigned_to_id: req.user.id },
      include: TASK_INCLUDE,
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({ success: true, data: tasks.map(normalizeTask) });
  } catch (error) {
    console.error('Get My Tasks Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi lấy task của bạn' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date, assigned_to_id } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Tiêu đề task không được để trống' });
    }
    if (!assigned_to_id) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn nhân viên được giao việc' });
    }
    if (priority && !isValidTaskPriority(priority)) {
      return res.status(400).json({ success: false, message: 'Mức độ ưu tiên không hợp lệ' });
    }

    const assigneeCheck = await ensureAssignableUser(assigned_to_id);
    if (assigneeCheck.error) {
      return res.status(400).json({ success: false, message: assigneeCheck.error });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      priority: priority || 'medium',
      due_date: due_date || null,
      assigned_to_id,
      assigned_by_id: req.user.id,
      status: 'todo',
    });

    const createdTask = await Task.findByPk(task.id, { include: TASK_INCLUDE });
    return res.status(201).json({ success: true, message: 'Giao task thành công', data: normalizeTask(createdTask) });
  } catch (error) {
    console.error('Create Task Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi tạo task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, due_date, status, assigned_to_id } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task không tồn tại' });
    }

    if (assigned_to_id) {
      const assigneeCheck = await ensureAssignableUser(assigned_to_id);
      if (assigneeCheck.error) {
        return res.status(400).json({ success: false, message: assigneeCheck.error });
      }
      task.assigned_to_id = assigned_to_id;
    }

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Tiêu đề task không được để trống' });
      }
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description ? description.trim() : null;
    if (priority !== undefined) {
      if (!isValidTaskPriority(priority)) {
        return res.status(400).json({ success: false, message: 'Mức độ ưu tiên không hợp lệ' });
      }
      task.priority = priority;
    }
    if (due_date !== undefined) task.due_date = due_date || null;
    if (status !== undefined) {
      if (!isValidTaskStatus(status)) {
        return res.status(400).json({ success: false, message: 'Trạng thái task không hợp lệ' });
      }
      task.status = status;
      task.completed_at = status === 'done' ? new Date() : null;
    }

    await task.save();

    const updatedTask = await Task.findByPk(task.id, { include: TASK_INCLUDE });
    return res.status(200).json({ success: true, message: 'Cập nhật task thành công', data: normalizeTask(updatedTask) });
  } catch (error) {
    console.error('Update Task Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật task' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!isValidTaskStatus(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái task không hợp lệ' });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task không tồn tại' });
    }

    const isOwner = task.assigned_to_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isManager = req.user.role === 'manager';
    if (!isOwner && !isAdmin && !isManager) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật task này' });
    }

    task.status = status;
    task.completed_at = status === 'done' ? new Date() : null;
    await task.save();

    const updatedTask = await Task.findByPk(task.id, { include: TASK_INCLUDE });
    return res.status(200).json({ success: true, message: 'Đã cập nhật trạng thái task', data: normalizeTask(updatedTask) });
  } catch (error) {
    console.error('Update Task Status Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task không tồn tại' });
    }

    await task.destroy();
    return res.status(200).json({ success: true, message: 'Đã xoá task' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xoá task' });
  }
};

module.exports = {
  getAllTasks,
  getMyTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};