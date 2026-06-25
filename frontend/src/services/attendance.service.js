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
  },
  // HR: đăng ký khuôn mặt cho nhân viên cụ thể
  registerFaceForEmployee: (userId, data) => {
    return axiosClient.post(`/attendance/register-face/${userId}`, data);
  },
  checkFaceRegisteredForEmployee: (userId) => {
    return axiosClient.get(`/attendance/check-face-registered/${userId}`);
  },
};

export default attendanceService;
