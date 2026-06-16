import axiosClient from './axiosClient';

const payrollService = {
  getPayrolls: (month) => {
    return axiosClient.get('/payrolls', { params: { month } });
  },
  calculatePayroll: (month) => {
    return axiosClient.post('/payrolls/calculate', { month });
  },
  getMyPayrolls: () => {
    return axiosClient.get('/payrolls/my-payrolls');
  }
};

export default payrollService;
