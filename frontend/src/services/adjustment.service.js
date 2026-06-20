import axiosClient from './axiosClient';

// Lấy danh sách khoản thu nhập / khấu trừ
// params: { kind, apply_month, status, search }
export const getAdjustments = (params = {}) =>
  axiosClient.get('/adjustments', { params });

// Lấy danh sách nhân viên để chọn khi tạo khoản
export const getAdjustmentEmployees = () =>
  axiosClient.get('/adjustments/employees');

// Tạo khoản mới
// body: { kind, user_id, category, amount, apply_month, reason, recurring }
export const createAdjustment = (data) =>
  axiosClient.post('/adjustments', data);

// Cập nhật trạng thái khoản: 'pending' | 'applied'
export const updateAdjustmentStatus = (id, status) =>
  axiosClient.patch(`/adjustments/${id}/status`, { status });

// Xóa khoản (chỉ xóa được khoản chưa áp dụng)
export const deleteAdjustment = (id) =>
  axiosClient.delete(`/adjustments/${id}`);
