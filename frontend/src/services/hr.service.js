import axiosClient from './axiosClient';

const hrService = {
  // [GET] Lấy danh sách lịch sử hợp đồng của một nhân viên
  getEmployeeContracts: (userId) => {
    return axiosClient.get(`/hr/contracts/${userId}`);
  },

  // [POST] Tạo hợp đồng mới (thử việc hoặc chính thức)
  createContract: (contractData) => {
    // contractData bao gồm: user_id, contract_number, contract_type, start_date, end_date, basic_salary
    return axiosClient.post('/hr/contracts', contractData);
  },

  // [PUT] Cập nhật, gia hạn hợp đồng (ví dụ: chuyển từ thử việc sang chính thức, đổi mức lương)
  extendContract: (contractId, updateData) => {
    return axiosClient.put(`/hr/contracts/${contractId}`, updateData);
  }
};

export default hrService;
