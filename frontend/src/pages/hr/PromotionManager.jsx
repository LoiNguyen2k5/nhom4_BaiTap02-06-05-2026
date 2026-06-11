import React, { useState, useEffect } from 'react';
import performanceService from '../../services/performance.service';
import { useSelector } from 'react-redux';

const PromotionManager = () => {
  const user = useSelector(state => state.auth.user);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    current_position: '',
    proposed_position: '',
    reason: ''
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchProposals();
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

  const fetchProposals = async () => {
    try {
      const res = await performanceService.getPromotions();
      setProposals(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      await performanceService.createPromotion(formData);
      setShowForm(false);
      setFormData({ user_id: '', current_position: '', proposed_position: '', reason: '' });
      fetchProposals();
    } catch (error) {
      console.error(error);
      alert('Lỗi tạo đề xuất');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await performanceService.updatePromotionStatus(id, status);
      fetchProposals();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Lỗi duyệt đề xuất. Hãy mở tab Console (F12) để xem chi tiết.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Đề xuất Thăng chức / Tăng lương</h2>
        {user?.role === 'manager' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            {showForm ? 'Đóng' : '+ Tạo đề xuất mới'}
          </button>
        )}
      </div>

      {showForm && user?.role === 'manager' && (
        <form onSubmit={handleCreateProposal} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl">
          <h3 className="text-lg font-bold mb-4">Tạo Đề xuất mới</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nhân viên</label>
              <select name="user_id" value={formData.user_id} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.username} ({emp.email}) - ID: {emp.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chức vụ hiện tại</label>
              <input type="text" name="current_position" value={formData.current_position} onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Chức vụ đề xuất (hoặc mức lương mới)</label>
            <input type="text" name="proposed_position" value={formData.proposed_position} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Lý do đề xuất (dựa trên KPI)</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} required rows="3" className="w-full p-2 border rounded"></textarea>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Gửi Đề Xuất</button>
        </form>
      )}

      {loading ? (
        <p>Đang tải danh sách đề xuất...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nhân viên</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Từ -&gt; Đến</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lý do</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map(p => (
                <tr key={p.id}>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{p.user?.name || p.user?.username} (ID: {p.user_id})</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{p.current_position} <br/><span className="text-green-600 font-bold">-&gt; {p.proposed_position}</span></p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap truncate max-w-xs" title={p.reason}>{p.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">Người đề xuất: {p.proposer?.username}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                      p.status === 'Approved' ? 'bg-green-200 text-green-900' : 
                      p.status === 'Rejected' ? 'bg-red-200 text-red-900' : 'bg-yellow-200 text-yellow-900'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {p.status === 'Pending' && (user?.role === 'admin' || user?.role === 'hr') && (
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateStatus(p.id, 'Approved')} className="text-green-600 hover:text-green-900 font-bold">Duyệt</button>
                        <button onClick={() => handleUpdateStatus(p.id, 'Rejected')} className="text-red-600 hover:text-red-900 font-bold">Từ chối</button>
                      </div>
                    )}
                    {p.status === 'Pending' && user?.role === 'manager' && (
                      <span className="text-gray-500 italic">Chờ duyệt</span>
                    )}
                  </td>
                </tr>
              ))}
              {proposals.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-5 border-b border-gray-200 text-center text-gray-500">
                    Chưa có đề xuất nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromotionManager;
