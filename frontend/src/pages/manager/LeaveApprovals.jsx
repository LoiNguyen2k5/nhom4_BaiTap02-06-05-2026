import React, { useState, useEffect } from 'react';
import LeaveService from '../../services/leave.service';
import { CheckCircle, XCircle, Inbox, User } from 'lucide-react';

const LeaveApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal từ chối
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await LeaveService.getPendingRequests();
      setRequests(res.data.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn DUYỆT đơn này?')) return;
    try {
      await LeaveService.approveOrRejectRequest(id, 'approved');
      alert('Đã duyệt đơn thành công!');
      fetchPendingRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const openRejectModal = (id) => {
    setSelectedRequestId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      await LeaveService.approveOrRejectRequest(selectedRequestId, 'rejected', rejectReason);
      alert('Đã từ chối đơn!');
      setShowRejectModal(false);
      fetchPendingRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Duyệt Đơn Nghỉ Phép & OT
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Quản lý và phê duyệt các yêu cầu từ nhân viên trong team.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-700">{requests.length} đơn đang chờ</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <Inbox className="h-16 w-16 text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tuyệt vời! Bạn đã xử lý xong mọi thứ.</h3>
            <p className="text-gray-500 max-w-sm">Hiện tại không có đơn xin nghỉ phép hay OT nào đang chờ duyệt. Hãy dành thời gian nghỉ ngơi nhé!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map(req => {
                  const displayName = req.requester?.name || '(Chưa cập nhật tên)';
                  return (
                    <tr key={req.id} className="hover:bg-blue-50/40 transition-colors duration-200 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center text-indigo-700 font-bold shadow-sm ring-2 ring-white">
                            <User className="w-5 h-5 opacity-80" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{displayName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{req.requester?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ring-inset ${
                          req.type === 'leave' 
                            ? 'bg-blue-50 text-blue-700 ring-blue-600/20' 
                            : 'bg-purple-50 text-purple-700 ring-purple-600/20'
                        }`}>
                          {req.type === 'leave' ? '🏖️ Nghỉ phép' : '⏰ Làm OT'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-gray-700">Từ: <span className="font-semibold text-gray-900">{req.start_date}</span></span>
                          <span className="text-sm font-medium text-gray-700">Đến: <span className="font-semibold text-gray-900">{req.end_date}</span></span>
                          <span className="inline-block mt-1 text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 w-max">
                            Tổng cộng: {req.type === 'leave' ? `${req.total_days} ngày` : `${req.ot_hours} giờ`}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm text-gray-600 max-w-xs line-clamp-2" title={req.reason}>
                          {req.reason}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleApprove(req.id)} 
                            className="flex items-center gap-1.5 bg-white border border-green-200 text-green-700 px-4 py-2 rounded-xl hover:bg-green-50 hover:border-green-300 hover:shadow-sm transition-all font-medium text-sm"
                          >
                            <CheckCircle className="w-5 h-5" /> Duyệt
                          </button>
                          <button 
                            onClick={() => openRejectModal(req.id)} 
                            className="flex items-center gap-1.5 bg-white border border-red-200 text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all font-medium text-sm"
                          >
                            <XCircle className="w-5 h-5" /> Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal nhập lý do từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100 opacity-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Từ chối đơn</h2>
            </div>
            <form onSubmit={handleReject}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lý do từ chối (bắt buộc)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                  rows="4"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none text-sm"
                  placeholder="Nhập chi tiết lý do để nhân viên có thể điều chỉnh lại yêu cầu..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowRejectModal(false)} 
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl hover:from-red-700 hover:to-rose-600 shadow-md shadow-red-500/30 transition-all"
                >
                  Xác nhận Từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;
