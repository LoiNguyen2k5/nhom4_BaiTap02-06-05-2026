import React, { useState, useEffect } from 'react';
import LeaveService from '../../services/leave.service';
import { 
  Plus, 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText 
} from 'lucide-react';

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
    start_time: '',
    end_time: '',
    reason: ''
  });

  // Tự động tính số ngày nghỉ
  useEffect(() => {
    if (formData.type === 'leave' && formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        setFormData(prev => ({ ...prev, total_days: diffDays }));
      } else {
        setFormData(prev => ({ ...prev, total_days: 0 }));
      }
    }
  }, [formData.start_date, formData.end_date, formData.type]);

  // Tự động tính số giờ OT
  useEffect(() => {
    if (formData.type === 'ot' && formData.start_time && formData.end_time) {
      const start = formData.start_time.split(':');
      const end = formData.end_time.split(':');
      const startMs = (+start[0]) * 60 * 60 * 1000 + (+start[1]) * 60 * 1000;
      const endMs = (+end[0]) * 60 * 60 * 1000 + (+end[1]) * 60 * 1000;
      if (endMs > startMs) {
        const diffHours = (endMs - startMs) / (1000 * 60 * 60);
        setFormData(prev => ({ ...prev, ot_hours: Math.round(diffHours * 10) / 10 }));
      } else {
        setFormData(prev => ({ ...prev, ot_hours: 0 }));
      }
    }
  }, [formData.start_time, formData.end_time, formData.type]);

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
      setBalance(balanceRes.data?.data || null);
      setRequests(requestsRes.data?.data || []);
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
      const submitData = { ...formData };
      if (submitData.type === 'ot') {
        submitData.reason = `[OT: ${submitData.start_time} - ${submitData.end_time}] ${submitData.reason}`;
      }
      await LeaveService.createLeaveRequest(submitData);
      alert('Đã gửi đơn thành công!');
      setShowModal(false);
      // Reset form
      setFormData({ type: 'leave', start_date: '', end_date: '', total_days: '', ot_hours: '', start_time: '', end_time: '', reason: '' });
      // Tải lại danh sách
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi nộp đơn');
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Nghỉ Phép & OT Của Tôi
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Quản lý quỹ phép cá nhân và theo dõi trạng thái các đơn yêu cầu.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5" /> Nộp Đơn Mới
        </button>
      </div>

      {/* Hiển thị Quỹ Phép */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative z-10">
              <p className="text-blue-600/80 font-bold text-xs uppercase tracking-wider mb-1">Tổng quỹ phép ({balance.year})</p>
              <p className="text-4xl font-black text-gray-800">{balance.total_days} <span className="text-lg font-semibold text-gray-500">ngày</span></p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative z-10">
              <p className="text-red-600/80 font-bold text-xs uppercase tracking-wider mb-1">Đã nghỉ</p>
              <p className="text-4xl font-black text-red-600">{balance.used_days} <span className="text-lg font-semibold text-red-400">ngày</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative z-10">
              <p className="text-orange-600/80 font-bold text-xs uppercase tracking-wider mb-1">Đang chờ duyệt</p>
              <p className="text-4xl font-black text-orange-500">{balance.pending_days} <span className="text-lg font-semibold text-orange-300">ngày</span></p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl shadow-lg shadow-green-500/20 flex items-center justify-between relative overflow-hidden group hover:shadow-green-500/40 transition-shadow">
            <div className="relative z-10">
              <p className="text-green-50 font-bold text-xs uppercase tracking-wider mb-1">Còn lại</p>
              <p className="text-4xl font-black text-white">
                {balance.total_days - balance.used_days - balance.pending_days} <span className="text-lg font-semibold text-green-200">ngày</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách Đơn */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Lịch sử Yêu cầu</h2>
      <div className="bg-white rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700">Chưa có dữ liệu</h3>
            <p className="text-gray-500">Bạn chưa nộp đơn nghỉ phép hay OT nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày gửi</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thời lượng</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {requests.map((req, index) => (
                  <tr key={req.id} className={`hover:bg-blue-50/40 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-600">
                      {new Date(req.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${req.type === 'leave' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-purple-50 text-purple-700 ring-purple-600/20'}`}>
                        {req.type === 'leave' ? '🏖️ Nghỉ phép' : '⏰ Làm OT'}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">
                      {req.start_date === req.end_date ? (
                        <span className="font-semibold">{req.start_date}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{req.start_date}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-semibold">{req.end_date}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-800">
                      {req.type === 'leave' ? `${req.total_days} ngày` : `${req.ot_hours} giờ`}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          req.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {req.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : 
                           req.status === 'rejected' ? <XCircle className="w-4 h-4" /> : 
                           <Clock className="w-4 h-4" />}
                          {req.status === 'approved' ? 'Đã duyệt' : req.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                        </span>
                        {req.status === 'rejected' && req.reject_reason && (
                          <span className="text-xs text-red-500 whitespace-normal max-w-[200px] mt-1 bg-red-50 px-2 py-1 rounded">
                            Lý do: {req.reject_reason}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nộp đơn */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform transition-all scale-100 opacity-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-extrabold text-gray-900">Nộp Đơn Mới</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Loại đơn</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                >
                  <option value="leave">🏖️ Nghỉ phép (Leave)</option>
                  <option value="ot">⏰ Làm thêm giờ (OT)</option>
                </select>
              </div>
              
              {formData.type === 'leave' ? (
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Từ ngày</label>
                      <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 p-3 outline-none transition-all" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Đến ngày</label>
                      <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 p-3 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tổng số ngày nghỉ (Tự động tính)</label>
                    <input type="number" readOnly name="total_days" value={formData.total_days} className="w-full bg-gray-100 border border-gray-200 text-gray-600 font-bold rounded-xl p-3 cursor-not-allowed" />
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ngày làm OT</label>
                    <input type="date" name="start_date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value, end_date: e.target.value})} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 p-3 outline-none transition-all" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Từ giờ</label>
                      <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 p-3 outline-none transition-all" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Đến giờ</label>
                      <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 p-3 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tổng số giờ OT (Tự động tính)</label>
                    <input type="number" readOnly name="ot_hours" value={formData.ot_hours} className="w-full bg-gray-100 border border-gray-200 text-gray-600 font-bold rounded-xl p-3 cursor-not-allowed" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lý do chi tiết</label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} required rows="3" placeholder="Ghi rõ lý do xin nghỉ hoặc làm thêm giờ..." className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 p-3 outline-none transition-all resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all">
                  Gửi Đơn Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
