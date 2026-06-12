import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Clock } from 'lucide-react';
import LeaveService from '../../services/leave.service';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const TYPE_CONFIG = {
  leave: { label: 'Nghỉ phép', variant: 'warning' },
  ot:    { label: 'Làm OT',    variant: 'info' },
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const TeamSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => { fetchSchedule(); }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await LeaveService.getTeamSchedule();
      setSchedules(res.data.data || []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = schedules.filter(req => {
    if (!filterMonth) return true;
    const start = new Date(req.start_date);
    const end = new Date(req.end_date);
    const [year, month] = filterMonth.split('-').map(Number);
    const filterStart = new Date(year, month - 1, 1);
    const filterEnd = new Date(year, month, 0);
    return start <= filterEnd && end >= filterStart;
  });

  const totalDaysOff = filteredSchedules.filter(r => r.type === 'leave').reduce((s, r) => s + (r.total_days || 0), 0);
  const totalOtHours = filteredSchedules.filter(r => r.type === 'ot').reduce((s, r) => s + (r.ot_hours || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Lịch làm việc team</h1>
          <p className="text-sm text-gray-500 mt-0.5">Theo dõi lịch nghỉ phép và OT của các thành viên</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Calendar size={14} strokeWidth={1.75} className="text-gray-400" />
          <input
            type="month"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="h-9 px-3 text-[13px] border border-gray-300 rounded-md focus:outline-none focus:border-navy-700 transition-colors"
          />
        </div>
      </div>

      {/* KPI mini */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Hoạt động tháng này',  value: filteredSchedules.length, icon: Calendar },
          { label: 'Tổng ngày nghỉ phép',  value: `${totalDaysOff} ngày`,    icon: Sun,   warning: totalDaysOff > 0 },
          { label: 'Tổng giờ OT',          value: `${totalOtHours} giờ`,     icon: Clock, info: totalOtHours > 0 },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 shrink-0">
                <Icon size={16} strokeWidth={1.75} className={k.warning ? 'text-warning-600' : k.info ? 'text-info-600' : 'text-gray-500'} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{k.label}</p>
                <p className={`font-mono tabular-nums text-[20px] font-bold leading-none mt-0.5
                  ${k.warning ? 'text-warning-600' : k.info ? 'text-info-700' : 'text-gray-900'}`}>
                  {k.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            <div className="h-10 bg-gray-50 border-b border-gray-200 animate-pulse" />
            {[1,2,3].map(i => (
              <div key={i} className="h-14 border-b border-gray-100 px-4 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-2.5 w-20 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <Calendar size={32} strokeWidth={1.25} className="text-gray-300 mb-3" />
            <p className="text-[14px] font-medium text-gray-500">Tháng này không có lịch nào</p>
            <p className="text-[12px] text-gray-400 mt-1">Chưa có nhân viên nào nghỉ phép hoặc đăng ký OT.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Nhân viên', 'Loại', 'Thời gian', 'Số ngày / giờ', 'Lý do'].map(col => (
                    <th key={col} className="h-10 px-4 text-left text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((req) => {
                  const typeCfg = TYPE_CONFIG[req.type] || TYPE_CONFIG.leave;
                  const displayName = req.requester?.name || '(Chưa cập nhật)';
                  const isLeave = req.type === 'leave';
                  return (
                    <tr key={req.id} className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={displayName} size="sm" />
                          <div>
                            <p className="text-[13px] font-medium text-gray-900">{displayName}</p>
                            <p className="text-[12px] text-gray-400 mt-0.5">{req.requester?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <Badge variant={typeCfg.variant} size="sm">{typeCfg.label}</Badge>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono tabular-nums text-[12px] text-gray-700">{fmt(req.start_date)}</span>
                          {req.start_date !== req.end_date && (
                            <>
                              <span className="text-gray-400 text-[11px]">→</span>
                              <span className="font-mono tabular-nums text-[12px] text-gray-700">{fmt(req.end_date)}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4">
                        <span className="font-mono tabular-nums text-[13px] font-semibold text-gray-900">
                          {isLeave ? `${req.total_days || 0} ngày` : `${req.ot_hours || 0} giờ`}
                        </span>
                      </td>
                      <td className="px-4 max-w-52">
                        <p className="text-[12px] text-gray-600 truncate" title={req.reason}>{req.reason || '—'}</p>
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
