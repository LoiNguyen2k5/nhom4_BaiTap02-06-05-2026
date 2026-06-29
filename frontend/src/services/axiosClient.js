import axios from 'axios';

const axiosClient = axios.create({
 baseURL: 'https://nhom4-baitap02-06-05-2026-7.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Trước khi gửi request, tự động đính kèm Token vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitMsg = retryAfter ? ` Vui lòng chờ ${retryAfter} giây.` : '';
      error.message = `Quá nhiều lần thử.${waitMsg}`;
      error.response.data = {
        ...error.response.data,
        message: error.message,
      };
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
