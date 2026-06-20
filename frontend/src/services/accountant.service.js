import axiosClient from './axiosClient';

const accountantService = {
  getPayrolls(month, year) {
    return axiosClient.get('/accountant/payroll', { params: { month, year } });
  },
  exportBankFile(month, year) {
    return axiosClient.get('/accountant/payroll/export', {
      params: { month, year },
      responseType: 'blob', // Important for file download
    });
  },
  sendPayslip(id) {
    return axiosClient.post(`/accountant/payroll/${id}/send-payslip`);
  },
  sendBatchPayslips(month, year) {
    return axiosClient.post('/accountant/payroll/send-batch-payslips', { month, year });
  },
};

export default accountantService;
