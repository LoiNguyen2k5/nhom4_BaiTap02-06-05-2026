import React, { useState, useEffect } from 'react';
import LeaveService from '../../services/leave.service';
import { Calendar, Sun, Clock, User } from 'lucide-react';

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
      setSchedules(res.data.data || []);
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

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Lịch Làm Việc Team
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Theo dõi lịch nghỉ phép và lịch làm thêm giờ của tất cả thành viên trong tháng.</p>
      </div>

      {/* Bộ lọc và thống kê nhanh */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <Calendar className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="pr-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Chọn Tháng</label>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-transparent border-none p-0 text-gray-900 font-semibold focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none flex items-center gap-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50 rounded-2xl p-4 shadow-sm">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Sun className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Tổng Ngày Nghỉ</p>
              <p className="text-2xl font-black text-orange-700">{totalDaysOff} <span className="text-sm font-semibold">ngày</span></p>
            </div>
          </div>
          <div className="flex-1 lg:flex-none flex items-center gap-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100/50 rounded-2xl p-4 shadow-sm">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Tổng Giờ OT</p>
              <p className="text-2xl font-black text-purple-700">{totalOtHours} <span className="text-sm font-semibold">giờ</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng lịch */}
      <div className="bg-white rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        {filteredSchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <Calendar className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Tháng này team rất chăm chỉ!</h3>
            <p className="text-gray-500 max-w-sm">Không có thành viên nào nghỉ phép hoặc đăng ký làm thêm giờ trong tháng này.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hoạt động</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian chi tiết</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSchedules.map((req, index) => {
                  const displayName = req.requester?.name || '(Chưa cập nhật tên)';
                  const isLeave = req.type === 'leave';
                  return (
                    <tr key={req.id} className={`transition-colors duration-200 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-blue-50/40`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white ${isLeave ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                            <User className="w-5 h-5 opacity-80" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{displayName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{req.requester?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${
                          isLeave 
                            ? 'bg-orange-50 text-orange-700 ring-orange-600/20' 
                            : 'bg-purple-50 text-purple-700 ring-purple-600/20'
                        }`}>
                          {isLeave ? '🏖️ Nghỉ phép' : '⏰ Làm OT'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          {req.start_date === req.end_date ? (
                            <span className="text-sm font-semibold text-gray-900">{req.start_date}</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">{req.start_date}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-sm font-semibold text-gray-900">{req.end_date}</span>
                            </div>
                          )}
                          <span className={`inline-block mt-1 text-xs font-bold px-2 py-1 rounded w-max ${isLeave ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>
                            {isLeave ? `${req.total_days} ngày` : `${req.ot_hours} giờ`}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm text-gray-600 max-w-xs line-clamp-2" title={req.reason}>
                          {req.reason}
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
    </div>
  );
};

export default TeamSchedule;
