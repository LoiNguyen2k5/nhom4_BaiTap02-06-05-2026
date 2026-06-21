import axiosClient from './axiosClient';

// ==========================================
// SERVICE GỌI API NGHỈ PHÉP & OT
// ==========================================

const LeaveService = {
  // 1. DÀNH CHO NHÂN VIÊN
  // ----------------------------------------
  
  // Lấy quỹ phép của tôi năm nay
  getMyLeaveBalance: () => {
    return axiosClient.get('/leaves/my-balance');
  },

  // Lấy lịch sử các đơn tôi đã nộp
  getMyLeaveRequests: () => {
    return axiosClient.get('/leaves/my-requests');
  },

  // Nộp đơn mới (Nghỉ phép hoặc OT)
  createLeaveRequest: (data) => {
    // data bao gồm: type, start_date, end_date, total_days, ot_hours, reason
    return axiosClient.post('/leaves/request', data);
  },

  // 2. DÀNH CHO QUẢN LÝ (MANAGER)
  // ----------------------------------------

  // Lấy danh sách tất cả các đơn đang chờ duyệt
  getPendingRequests: () => {
    return axiosClient.get('/leaves/pending');
  },

  // Duyệt hoặc Từ chối đơn
  approveOrRejectRequest: (id, status, rejectReason = '') => {
    return axiosClient.put(`/leaves/${id}/approve`, {
      status: status, // 'approved' hoặc 'rejected'
      reject_reason: rejectReason
    });
  },

  // Lấy danh sách lịch team (các đơn đã được duyệt)
  getTeamSchedule: () => {
    return axiosClient.get('/leaves/schedule');
  },

  // Lấy lịch sử phê duyệt (manager đã duyệt/từ chối)
  getApprovalHistory: (params = {}) => {
    // params: { status, type, from, to }
    return axiosClient.get('/leaves/approval-history', { params });
  }
};

export default LeaveService;
