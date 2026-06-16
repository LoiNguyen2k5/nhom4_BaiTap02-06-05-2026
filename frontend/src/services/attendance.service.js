import axiosClient from './axiosClient';

const attendanceService = {
  checkIn: () => {
    return axiosClient.post('/attendance/check-in');
  },
  checkOut: () => {
    return axiosClient.post('/attendance/check-out');
  },
  getMyHistory: () => {
    return axiosClient.get('/attendance/my-history');
  }
};

export default attendanceService;
