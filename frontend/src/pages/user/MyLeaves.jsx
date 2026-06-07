import React, { useState, useEffect } from 'react';
import LeaveService from '../../services/leave.service';

const MyLeaves = () => {
  const [balance, setBalance] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'leave',
    start_date: '',
    end_date: '',
    total_days: '',
    ot_hours: '',
    reason: ''
  });

  // Gọi API lấy dữ liệu lúc mới vào trang
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balanceRes, requestsRes] = await Promise.all([
        LeaveService.getMyLeaveBalance(),
        LeaveService.getMyLeaveRequests()
      ]);
      setBalance(balanceRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
      alert('Không thể tải dữ liệu nghỉ phép');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LeaveService.createLeaveRequest(formData);
      alert('Đã gửi đơn thành công!');
      setShowModal(false);
      // Reset form
      setFormData({ type: 'leave', start_date: '', end_date: '', total_days: '', ot_hours: '', reason: '' });
      // Tải lại danh sách
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi nộp đơn');
    }
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nghỉ Phép & OT Của Tôi</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Nộp Đơn Mới
        </button>
      </div>

      {/* Hiển thị Quỹ Phép */}
      {balance && (
        <div className="bg-white p-6 rounded shadow mb-6 flex gap-8">
          <div>
            <p className="text-gray-500 text-sm">Tổng quỹ phép ({balance.year})</p>
            <p className="text-2xl font-bold">{balance.total_days} ngày</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Đã nghỉ</p>
            <p className="text-2xl font-bold text-red-600">{balance.used_days} ngày</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Đang chờ duyệt</p>
            <p className="text-2xl font-bold text-orange-500">{balance.pending_days} ngày</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Còn lại</p>
            <p className="text-2xl font-bold text-green-600">
              {balance.total_days - balance.used_days - balance.pending_days} ngày
            </p>
          </div>
        </div>
      )}

      {/* Danh sách Đơn */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày gửi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Từ ngày - Đến ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(req => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(req.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${req.type === 'leave' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {req.type === 'leave' ? 'Nghỉ phép' : 'Làm OT'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {req.start_date} -> {req.end_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {req.type === 'leave' ? `${req.total_days} ngày` : `${req.ot_hours} giờ`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full 
                    ${req.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      req.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-orange-100 text-orange-800'}`}>
                    {req.status === 'approved' ? 'Đã duyệt' : req.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nộp đơn */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Nộp Đơn Mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại đơn</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                >
                  <option value="leave">Nghỉ phép (Leave)</option>
                  <option value="ot">Làm thêm giờ (OT)</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="mt-1 block w-full border p-2 rounded" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
                  <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="mt-1 block w-full border p-2 rounded" />
                </div>
              </div>

              {formData.type === 'leave' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số ngày nghỉ (VD: 0.5, 1, 2)</label>
                  <input type="number" step="0.5" name="total_days" value={formData.total_days} onChange={handleChange} required className="mt-1 block w-full border p-2 rounded" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số giờ làm thêm</label>
                  <input type="number" step="0.5" name="ot_hours" value={formData.ot_hours} onChange={handleChange} required className="mt-1 block w-full border p-2 rounded" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Lý do chi tiết</label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} required rows="3" className="mt-1 block w-full border p-2 rounded"></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Gửi Đơn</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
