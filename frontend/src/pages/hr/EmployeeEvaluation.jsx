import React, { useState, useEffect } from 'react';
import performanceService from '../../services/performance.service';

const EmployeeEvaluation = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    rating: 'A',
    kpi_score: '',
    comments: ''
  });
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await performanceService.getAllEmployees();
      if (res.data?.employees) {
        setEmployees(res.data.employees);
      } else if (res.data?.success && Array.isArray(res.data.data)) {
        setEmployees(res.data.data);
      } else if (Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await performanceService.submitReview({
        ...formData,
        user_id: parseInt(formData.user_id),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        kpi_score: parseFloat(formData.kpi_score)
      });
      setMessage('Đánh giá thành công!');
      // Reset form
      setFormData({
        ...formData,
        user_id: '',
        kpi_score: '',
        comments: ''
      });
    } catch (error) {
      console.error(error);
      setMessage('Có lỗi xảy ra khi đánh giá.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Đánh giá Hiệu quả nhân viên (KPI)</h2>
      
      {message && <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name || emp.username} ({emp.email}) - ID: {emp.id}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
            <input
              type="number"
              name="month"
              min="1" max="12"
              value={formData.month}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xếp loại</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="A">Loại A (Xuất sắc)</option>
              <option value="B">Loại B (Tốt)</option>
              <option value="C">Loại C (Khá)</option>
              <option value="D">Loại D (Cần cố gắng)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm KPI</label>
            <input
              type="number"
              name="kpi_score"
              min="0" max="100" step="0.1"
              value={formData.kpi_score}
              onChange={handleChange}
              required
              placeholder="VD: 95.5"
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nhận xét của Quản lý</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ghi chú điểm mạnh, điểm yếu, cần khắc phục..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition"
        >
          Lưu Đánh Giá
        </button>
      </form>
    </div>
  );
};

export default EmployeeEvaluation;
