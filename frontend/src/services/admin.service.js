import axiosClient from './axiosClient';

export const adminService = {
  getUsers: async (params) => {
    const response = await axiosClient.get('/admin/users', { params });
    return response.data;
  },
};
