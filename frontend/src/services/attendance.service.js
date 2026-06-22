import axiosClient from './axiosClient';

const attendanceService = {
  checkIn: (data) => {
    return axiosClient.post('/attendance/check-in', data);
  },
  checkOut: (data) => {
    return axiosClient.post('/attendance/check-out', data);
  },
  getMyHistory: () => {
    return axiosClient.get('/attendance/my-history');
  },
  checkFaceRegistered: () => {
    return axiosClient.get('/attendance/check-face-registered');
  },
  registerFace: (data) => {
    return axiosClient.post('/attendance/register-face', data);
  }
};

export default attendanceService;
