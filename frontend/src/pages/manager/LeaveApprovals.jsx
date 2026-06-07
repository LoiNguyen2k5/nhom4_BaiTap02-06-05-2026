import React, { useState, useEffect } from 'react';
import LeaveService from '../../services/leave.service';

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
      setRequests(res.data);
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

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Duyệt Đơn Nghỉ Phép & OT</h1>

      <div className="bg-white rounded shadow overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tuyệt vời! Không có đơn nào đang chờ duyệt.
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lý do</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{req.requester?.name}</div>
                    <div className="text-sm text-gray-500">{req.requester?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${req.type === 'leave' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {req.type === 'leave' ? 'Nghỉ phép' : 'Làm OT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>Từ: {req.start_date}</div>
                    <div>Đến: {req.end_date}</div>
                    <div className="font-bold text-gray-700 mt-1">
                      {req.type === 'leave' ? `(${req.total_days} ngày)` : `(${req.ot_hours} giờ)`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleApprove(req.id)} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 mr-2">
                      Duyệt
                    </button>
                    <button onClick={() => openRejectModal(req.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal nhập lý do từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">Từ chối đơn</h2>
            <form onSubmit={handleReject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối (bắt buộc)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                  rows="3"
                  className="w-full border p-2 rounded"
                  placeholder="Nhập lý do để nhân viên biết..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Xác nhận Từ chối</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;
