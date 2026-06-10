import axiosClient from './axiosClient';

export const taskService = {
  getAllTasks: async (params) => {
    const response = await axiosClient.get('/tasks', { params });
    return response.data;
  },

  getMyTasks: async () => {
    const response = await axiosClient.get('/tasks/my');
    return response.data;
  },

  createTask: async (data) => {
    const response = await axiosClient.post('/tasks', data);
    return response.data;
  },

  updateTask: async (taskId, data) => {
    const response = await axiosClient.put(`/tasks/${taskId}`, data);
    return response.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await axiosClient.put(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await axiosClient.delete(`/tasks/${taskId}`);
    return response.data;
  },
};
