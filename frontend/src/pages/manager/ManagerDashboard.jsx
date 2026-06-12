import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle, Star } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Callout from '../../components/ui/Callout';

const TODAY_ITEMS = [
  { icon: AlertCircle, color: 'text-warning-600', text: 'Đơn xin nghỉ phép của Vũ Minh Khôi (26/05–28/05) chờ phê duyệt', time: '2 giờ trước', path: '/manager/leave-approvals' },
  { icon: AlertCircle, color: 'text-warning-600', text: 'Task "Optimize API response time" của Lê Văn Tùng đến hạn 21/05/2026', time: '4 giờ trước', path: '/manager/tasks' },
  { icon: AlertCircle, color: 'text-danger-600',  text: 'KPI tháng 5/2026: còn 7 đánh giá chưa hoàn thành. Hạn chốt: 25/05', time: 'hôm nay', path: '/manager/kpi' },
  { icon: AlertCircle, color: 'text-info-600',    text: '2 nhân viên của team sẽ đi khỏi văn phòng vào buổi chiều hôm nay', time: 'hôm nay', path: '/manager/team-schedule' },
];

const TEAM_TASKS = [
  { name: 'Nguyễn Văn An',   task: 'Optimize API response time',         progress: 85, status: 'success', deadline: '21/05' },
  { name: 'Lý Văn Tùng',     task: 'Hoc cấu trúc dự án Backend',         progress: 60, status: 'warning', deadline: '22/05' },
  { name: 'Lê Minh Khối',    task: 'Implement OAuth2 flow',               progress: 40, status: 'warning', deadline: '23/05' },
  { name: 'Trần Văn Đức',    task: 'Setup Monitoring Dashboard',          progress: 20, status: 'danger',  deadline: '20/05' },
  { name: 'Nguyễn Minh Tuấn', task: 'Phạm Quỳnh Anh task migrate to TS', progress: 70, status: 'success', deadline: '24/05' },
];

const MINI_CAL_DAYS = [27,28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const LEAVE_DAYS = new Set([5, 13, 21]);
const OT_DAYS    = new Set([5, 12, 21]);

const progressColor = { success: 'bg-success-600', warning: 'bg-warning-600', danger: 'bg-danger-600' };

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const displayName = user?.name || 'Nguyễn Văn An';
  const today = new Date();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">
            Xin chào, <span className="text-navy-700">{displayName}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.75">
            {today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            {' · '}Team Backend · 12 nhân viên
          </p>
        </div>
        <Badge variant="brand">Manager</Badge>
      </div>

      {/* Việc cần làm hôm nay */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">Cần xử lý hôm nay</h2>
          <button className="text-[12px] text-accent-600 hover:underline">Xem tất cả →</button>
        </div>
        <div className="divide-y divide-gray-100">
          {TODAY_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <Icon size={16} strokeWidth={1.75} className={`${item.color} mt-0.5 shrink-0`} />
                <p className="text-[13px] text-gray-700 flex-1 leading-relaxed">{item.text}</p>
                <span className="text-[11px] text-gray-400 shrink-0 mt-0.5">{item.time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 KPI nhỏ */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Task đang làm', value: '23', sub: '31 tổng', bar: 74, color: 'bg-navy-700', icon: Clock },
          { label: 'Hoàn thành', value: '18', sub: '58% tháng này', bar: 58, color: 'bg-success-600', icon: CheckCircle },
          { label: 'KPI trung bình', value: '8,4', sub: '+0.3 vs tháng trước', bar: 84, color: 'bg-accent-500', icon: Star },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500">{kpi.label}</p>
                <Icon size={16} strokeWidth={1.75} className="text-gray-400" />
              </div>
              <p className="font-mono tabular-nums text-[32px] font-bold text-gray-900 leading-none tracking-[-0.02em] mb-2">
                {kpi.value}
              </p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                <div className={`h-full ${kpi.color} rounded-full`} style={{ width: `${kpi.bar}%` }} />
              </div>
              <p className="text-[11px] text-gray-500">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* 2 col: tiến độ task team + lịch team */}
      <div className="grid grid-cols-2 gap-4">
        {/* Task team */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-[15px] font-semibold text-gray-900">Tiến độ task team</h2>
            <div className="flex gap-1 text-[11px] font-medium">
              {['Hôm nay', 'Tuần', 'Tháng'].map((t) => (
                <button key={t} className="px-2 py-1 rounded-sm first:bg-gray-100 first:text-gray-900 text-gray-500 hover:bg-gray-100 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Nhân viên', 'Task', 'Tiến độ', 'Hạn'].map((col) => (
                  <th key={col} className="h-10 px-4 text-left text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_TASKS.map((row) => (
                <tr key={row.name} className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={row.name} size="sm" />
                      <span className="text-[13px] font-medium text-gray-700 truncate max-w-24">{row.name.split(' ').at(-1)}</span>
                    </div>
                  </td>
                  <td className="px-4">
                    <p className="text-[12px] text-gray-700 truncate max-w-40">{row.task}</p>
                  </td>
                  <td className="px-4 w-28">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                      <div className={`h-full ${progressColor[row.status]} rounded-full`} style={{ width: `${row.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-gray-500">{row.progress}%</span>
                  </td>
                  <td className="px-4">
                    <span className={`text-[12px] font-mono tabular-nums ${row.status === 'danger' ? 'text-danger-600 font-semibold' : 'text-gray-500'}`}>
                      {row.deadline}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mini calendar */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900">Lịch team tuần này</h2>
            <button onClick={() => navigate('/manager/team-schedule')} className="text-[12px] text-accent-600 hover:underline">
              Lịch đầy đủ →
            </button>
          </div>
          {/* Legend */}
          <div className="flex gap-3 mb-3 flex-wrap">
            {[['bg-success-600', 'Đúng giờ'], ['bg-warning-600', 'Đi trễ'], ['bg-info-600', 'OT'], ['bg-success-100', 'Nghỉ phép']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[11px] text-gray-500">{label}</span>
              </div>
            ))}
          </div>
          {/* Grid 7 cols */}
          <div className="grid grid-cols-7 gap-px text-center">
            {['T2','T3','T4','T5','T6','T7','CN'].map((d) => (
              <div key={d} className="text-[10px] font-semibold text-gray-400 pb-1">{d}</div>
            ))}
            {MINI_CAL_DAYS.slice(0, 35).map((day, i) => {
              const isToday = day === today.getDate();
              const hasLeave = LEAVE_DAYS.has(day);
              const hasOT = OT_DAYS.has(day);
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-[12px] rounded-md cursor-pointer transition-colors
                    ${isToday ? 'bg-navy-700 text-white font-semibold' : hasLeave ? 'bg-success-100 text-success-700' : 'hover:bg-gray-100 text-gray-700'}
                  `}
                >
                  {day}
                  {hasOT && !isToday && <span className="absolute w-1 h-1 rounded-full bg-accent-500 -bottom-0.5" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
