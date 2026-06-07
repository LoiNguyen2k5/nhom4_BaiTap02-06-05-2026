import React, { useState, useEffect } from 'react';
import LeaveService from '../../services/leave.service';

const TeamSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await LeaveService.getTeamSchedule();
      setSchedules(res.data);
    } catch (error) {
      console.error('Lỗi tải lịch team:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lọc các đơn nằm trong tháng đang chọn
  const filteredSchedules = schedules.filter(req => {
    if (!filterMonth) return true;
    const start = new Date(req.start_date);
    const end = new Date(req.end_date);
    const [year, month] = filterMonth.split('-').map(Number);
    const filterStart = new Date(year, month - 1, 1);
    const filterEnd = new Date(year, month, 0);
    return start <= filterEnd && end >= filterStart;
  });

  const totalDaysOff = filteredSchedules
    .filter(req => req.type === 'leave')
    .reduce((sum, req) => sum + req.total_days, 0);

  const totalOtHours = filteredSchedules
    .filter(req => req.type === 'ot')
    .reduce((sum, req) => sum + req.ot_hours, 0);

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lịch Làm Việc Team</h1>

      {/* Bộ lọc và thống kê nhanh */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Xem tháng:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border p-2 rounded text-sm"
          />
        </div>
        <div className="flex gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded px-4 py-2 text-center">
            <p className="text-xs text-orange-600 font-medium">Tổng ngày nghỉ</p>
            <p className="text-xl font-bold text-orange-700">{totalDaysOff}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded px-4 py-2 text-center">
            <p className="text-xs text-purple-600 font-medium">Tổng giờ OT</p>
            <p className="text-xl font-bold text-purple-700">{totalOtHours}</p>
          </div>
        </div>
      </div>

      {/* Bảng lịch */}
      <div className="bg-white rounded shadow overflow-hidden">
        {filteredSchedules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có lịch nghỉ hoặc OT nào trong tháng này.
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lý do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSchedules.map(req => (
                <tr key={req.id} className={req.type === 'leave' ? 'bg-orange-50' : 'bg-purple-50'}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{req.requester?.name}</p>
                    <p className="text-xs text-gray-500">{req.requester?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${req.type === 'leave' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>
                      {req.type === 'leave' ? '🏖️ Nghỉ phép' : '⏰ Làm OT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{req.start_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{req.end_date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {req.type === 'leave' ? `${req.total_days} ngày` : `${req.ot_hours} giờ`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs" title={req.reason}>
                    {req.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamSchedule;
