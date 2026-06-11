import axiosClient from './axiosClient';

const getDashboardData = (userId = '') => {
  const url = userId ? `/performance/dashboard/${userId}` : `/performance/dashboard`;
  return axiosClient.get(url);
};

const submitReview = (data) => {
  return axiosClient.post(`/performance/reviews`, data);
};

const getPromotions = () => {
  return axiosClient.get(`/performance/promotions`);
};

const createPromotion = (data) => {
  return axiosClient.post(`/performance/promotions`, data);
};

const updatePromotionStatus = (id, status) => {
  return axiosClient.patch(`/performance/promotions/${id}/status`, { status });
};

const getAllEmployees = () => {
  return axiosClient.get(`/performance/employees`);
};

export default {
  getDashboardData,
  submitReview,
  getPromotions,
  createPromotion,
  updatePromotionStatus,
  getAllEmployees
};
