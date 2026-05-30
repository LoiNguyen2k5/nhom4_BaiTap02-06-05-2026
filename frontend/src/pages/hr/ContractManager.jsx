import React, { useState } from 'react';
import hrService from '../../services/hr.service';

const ContractManager = () => {
  const [userId, setUserId] = useState('');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State quản lý Form thêm mới
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contract_number: '',
    contract_type: 'probation',
    start_date: '',
    end_date: '',
    basic_salary: ''
  });

  // Hàm lấy danh sách hợp đồng
  const fetchContracts = async (e) => {
    if (e) e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await hrService.getEmployeeContracts(userId);
      setContracts(res.data.contracts || []);
      if(res.data.contracts.length === 0) {
        setMessage({ type: 'info', text: 'Nhân viên này chưa có hợp đồng nào.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi khi tải hợp đồng' });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý tạo mới hợp đồng
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await hrService.createContract({ ...formData, user_id: userId });
      setMessage({ type: 'success', text: 'Tạo hợp đồng thành công!' });
      setShowForm(false);
      setFormData({
        contract_number: '', contract_type: 'probation', start_date: '', end_date: '', basic_salary: ''
      });
      fetchContracts(); // Cập nhật lại danh sách
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi tạo hợp đồng' });
    }
  };

  // Hàm xử lý gia hạn hợp đồng (Demo đơn giản dùng Prompt)
  const handleExtend = async (contractId) => {
    const newEndDate = window.prompt('Nhập ngày kết thúc mới (Định dạng: YYYY-MM-DD):');
    if (!newEndDate) return;
    try {
      await hrService.extendContract(contractId, { end_date: newEndDate });
      setMessage({ type: 'success', text: 'Gia hạn thành công!' });
      fetchContracts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi gia hạn hợp đồng' });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Hợp đồng lao động</h1>

      {/* Box Tìm kiếm nhân viên */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={fetchContracts} className="flex gap-4">
          <input
            type="number"
            placeholder="Nhập Mã/ID Nhân viên..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition" disabled={loading}>
            {loading ? 'Đang tìm...' : 'Tra cứu Hợp đồng'}
          </button>
        </form>
      </div>

      {/* Hiển thị thông báo */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Danh sách hợp đồng */}
      {contracts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700">Lịch sử Hợp đồng</h2>
            <button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
              {showForm ? 'Đóng form' : '+ Tạo hợp đồng mới'}
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-4">Số HĐ</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Ngày bắt đầu</th>
                <th className="py-3 px-4">Ngày kết thúc</th>
                <th className="py-3 px-4">Lương cơ bản</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{c.contract_number}</td>
                  <td className="py-3 px-4">{c.contract_type === 'probation' ? 'Thử việc' : 'Chính thức'}</td>
                  <td className="py-3 px-4">{c.start_date}</td>
                  <td className="py-3 px-4">{c.end_date || 'Không thời hạn'}</td>
                  <td className="py-3 px-4">{c.basic_salary.toLocaleString()} đ</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleExtend(c.id)} className="text-blue-600 hover:underline">Gia hạn</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Tạo hợp đồng */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">Tạo hợp đồng lao động mới</h2>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2">Số hợp đồng</label>
              <input type="text" className="w-full border rounded px-3 py-2" required
                value={formData.contract_number} onChange={e => setFormData({...formData, contract_number: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-2">Loại hợp đồng</label>
              <select className="w-full border rounded px-3 py-2"
                value={formData.contract_type} onChange={e => setFormData({...formData, contract_type: e.target.value})}
              >
                <option value="probation">Thử việc</option>
                <option value="official">Chính thức</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-2">Ngày bắt đầu</label>
              <input type="date" className="w-full border rounded px-3 py-2" required
                value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-2">Ngày kết thúc</label>
              <input type="date" className="w-full border rounded px-3 py-2"
                value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 text-sm mb-2">Mức lương cơ bản (VND)</label>
              <input type="number" className="w-full border rounded px-3 py-2" required
                value={formData.basic_salary} onChange={e => setFormData({...formData, basic_salary: e.target.value})}
              />
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu hợp đồng</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContractManager;
