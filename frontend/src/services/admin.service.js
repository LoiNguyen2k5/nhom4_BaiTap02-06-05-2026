import axiosClient from './axiosClient';

export const adminService = {
  getUsers: async (params) => {
    const response = await axiosClient.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await axiosClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await axiosClient.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await axiosClient.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
};
