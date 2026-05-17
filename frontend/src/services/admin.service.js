import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin';

export const adminService = {
  getUsers: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/users`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
