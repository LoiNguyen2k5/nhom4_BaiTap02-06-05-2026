import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BACKEND_URL = 'http://localhost:3000';

const HRDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'employee',
    department_id: ''
  });

  const fetchData = async () => {
    try {
      const [reqRes, depRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/hr/account-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKEND_URL}/api/admin/departments`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      if (reqRes.data.success) {
        setRequests(reqRes.data.data);
      }
      if (depRes.data.success) {
        setDepartments(depRes.data.data.filter(d => d.status === 'active'));
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        department_id: formData.department_id || null
      };
      
      const res = await axios.post(`${BACKEND_URL}/api/hr/account-requests`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setShowModal(false);
        setFormData({ email: '', full_name: '', role: 'employee', department_id: '' });
        fetchData();
        alert('Đã gửi yêu cầu tạo tài khoản thành công!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Yêu cầu Cấp Tài khoản</h1>
          <p className="text-gray-500 text-sm mt-1">Gửi yêu cầu tạo tài khoản cho nhân viên mới lên Admin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tạo Yêu cầu Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ & Tên</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Chưa có yêu cầu nào</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-800">{req.full_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium capitalize">
                      {req.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {req.status === 'pending' && <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-medium">Đang chờ duyệt</span>}
                    {req.status === 'approved' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium">Đã duyệt</span>}
                    {req.status === 'rejected' && <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium">Bị từ chối</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(req.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">Tạo Yêu cầu Cấp Tài khoản</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ & Tên nhân viên mới *</label>
                <input 
                  type="text" 
                  required
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Ví dụ: nva@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vai trò</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="employee">Nhân viên (Employee)</option>
                  <option value="manager">Quản lý (Manager)</option>
                  <option value="accountant">Kế toán (Accountant)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phòng ban</label>
                <select 
                  value={formData.department_id}
                  onChange={e => setFormData({...formData, department_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Chọn phòng ban (Tùy chọn) --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Gửi Yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
