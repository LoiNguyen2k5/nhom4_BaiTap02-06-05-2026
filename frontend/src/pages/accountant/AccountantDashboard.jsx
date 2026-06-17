import { useNavigate } from 'react-router-dom';
import { Calendar, AlertTriangle, FileText, Download } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Callout from '../../components/ui/Callout';

const STEPS = [
  { label: 'Cập nhật', done: true },
  { label: 'Tính',     done: false, current: true },
  { label: 'Duyệt',   done: false },
  { label: 'Chuyển',  done: false },
];

const BAR_DATA = [
  { month: 'T6/26', base: 1200, allowance: 520, kpi: 80, bhxh: 55, total: 1855 },
  { month: 'T7/26', base: 1240, allowance: 510, kpi: 90, bhxh: 56, total: 1896 },
  { month: 'T8/26', base: 1210, allowance: 500, kpi: 100, bhxh: 59, total: 1869 },
  { month: 'T9/26', base: 1280, allowance: 510, kpi: 90, bhxh: 56, total: 1936 },
  { month: 'T10/26',base: 1250, allowance: 520, kpi: 100, bhxh: 59, total: 1929 },
  { month: 'T11/26',base: 1300, allowance: 540, kpi: 110, bhxh: 65, total: 2015 },
];

const MAX_TOTAL = Math.max(...BAR_DATA.map((d) => d.total));

const DONUT_SEGMENTS = [
  { label: 'Full-time (198)', pct: 82, color: 'var(--navy-700)' },
  { label: 'Intern (30)',     pct: 9,  color: '#0891B2' },
  { label: 'Freelancer (19)', pct: 9,  color: 'var(--accent-500)' },
];

const TODO_ITEMS = [
  { icon: AlertTriangle, variant: 'warning', title: '3 tạm ứng chờ duyệt', sub: 'Tổng: 15.000.000 đ · Mới nhất: Vũ Minh Khôi', count: '3 đơn', link: '/accountant/advances' },
  { icon: FileText,      variant: 'info',    title: 'Khoản thu nhập / khấu trừ tháng này', sub: 'Xem và quản lý các khoản phát sinh', count: 'Quản lý', link: '/accountant/adjustments' },
  { icon: Download,      variant: 'success', title: 'Xuất file ngân hàng T11', sub: 'Đã chốt · 247 NV · 1.840.500.000 đ', count: 'Sẵn sàng', link: '/accountant/payroll' },
  { icon: AlertTriangle, variant: 'warning', title: '12 hợp đồng sắp hết hạn', sub: 'Cần gia hạn hoặc thông báo trước 31/05', count: '12 HĐ', link: '/hr/contracts' },
];

export default function AccountantDashboard() {
  const navigate = useNavigate();
  const currentMonth = 'Tháng 11/2026';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.75">Tổng quan chu kỳ lương · {currentMonth}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="h-9 px-3 flex items-center gap-1.5 text-[13px] font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar size={14} strokeWidth={1.75} />
            Lịch kỳ lương
          </button>
          <button className="h-9 px-4 text-[13px] font-semibold bg-accent-600 hover:bg-accent-700 text-white rounded-md transition-colors active:scale-[.98]">
            → Tiếp tục xử lý
          </button>
        </div>
      </div>

      {/* Stepper kỳ lương */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Calendar size={16} strokeWidth={1.75} className="text-navy-700" />
            <span className="text-[15px] font-semibold text-gray-900">Ký lương {currentMonth}</span>
            <Badge variant="brand">01–30/11/2026</Badge>
            <Badge variant="warning" dot>Đang tính lương</Badge>
          </div>
          <button className="h-8 px-3 text-[13px] font-medium bg-navy-700 hover:bg-navy-800 text-white rounded-md transition-colors">
            → Tiếp tục
          </button>
        </div>
        {/* Stepper */}
        <div className="relative flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold
                  ${step.done ? 'bg-success-600 text-white' : step.current ? 'bg-navy-700 text-white ring-4 ring-navy-100' : 'bg-gray-200 text-gray-500'}`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <span className={`text-[11px] mt-1.5 ${step.current ? 'font-semibold text-gray-900' : step.done ? 'text-success-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {/* Line */}
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-14px] ${step.done ? 'bg-success-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-3">Tổng quỹ lương tháng</p>
          <p className="font-mono tabular-nums text-[28px] font-bold text-gray-900 leading-none tracking-[-0.02em]">
            1.840.500.000
          </p>
          <p className="text-[12px] text-gray-400 mt-1">VND</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-success-600">↑+6,2%</span>
            <span className="text-xs text-gray-500">so với T10</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-3">Số NV được trả</p>
          <p className="font-mono tabular-nums text-[36px] font-bold text-gray-900 leading-none tracking-[-0.02em]">247</p>
          <p className="text-[11px] text-gray-500 mt-2">Full-time 198 · Intern 30 · Freelancer 19</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-3">Tạm ứng đã duyệt</p>
          <p className="font-mono tabular-nums text-[36px] font-bold text-gray-900 leading-none tracking-[-0.02em]">12</p>
          <p className="text-[11px] text-gray-500 mt-2">
            <span className="text-warning-700 font-medium">đơn</span> · Tổng 85.000.000 đ
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-3">Phụ cấp + KPI</p>
          <p className="font-mono tabular-nums text-[28px] font-bold text-gray-900 leading-none tracking-[-0.02em]">
            245.000.000
          </p>
          <p className="text-[12px] text-gray-400 mt-1">VND</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-success-600">↑+8,5%</span>
            <span className="text-xs text-gray-500">so với T10</span>
          </div>
        </div>
      </div>

      {/* Chart + Donut */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stacked bar chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900">Chi phí lương 6 tháng qua</h2>
            <span className="text-[11px] text-gray-400">T6–T11/2026 · Triệu đ</span>
          </div>
          <div className="space-y-2">
            {BAR_DATA.map((row) => (
              <div key={row.month} className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 w-10 shrink-0">{row.month}</span>
                <div className="flex-1 h-5 flex rounded-sm overflow-hidden">
                  <div className="bg-navy-700" style={{ width: `${(row.base / MAX_TOTAL) * 100}%` }} />
                  <div className="bg-navy-300" style={{ width: `${(row.allowance / MAX_TOTAL) * 100}%` }} />
                  <div className="bg-accent-500" style={{ width: `${(row.kpi / MAX_TOTAL) * 100}%` }} />
                  <div className="bg-info-600" style={{ width: `${(row.bhxh / MAX_TOTAL) * 100}%` }} />
                </div>
                <span className="text-[11px] font-mono tabular-nums text-gray-500 w-12 text-right shrink-0">
                  {(row.total / 1000).toFixed(3)}M
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            {[['bg-navy-700','Lương cơ bản'],['bg-navy-300','Phụ cấp'],['bg-accent-500','KPI/Thưởng'],['bg-info-600','BHXH công ty']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                <span className="text-[11px] text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut + Việc cần làm */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-gray-900">Phân bổ theo loại NS</h2>
              <span className="text-[11px] text-gray-400">T11/2026</span>
            </div>
            <div className="flex items-center gap-6">
              {/* Simple donut placeholder */}
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--gray-100)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--navy-700)" strokeWidth="4"
                    strokeDasharray="72.6 27.4" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#0891B2" strokeWidth="4"
                    strokeDasharray="8 92" strokeDashoffset="-72.6" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--accent-500)" strokeWidth="4"
                    strokeDasharray="8 92" strokeDashoffset="-80.6" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono tabular-nums text-[14px] font-bold text-gray-900">247</span>
                  <span className="text-[9px] text-gray-400">NV</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {DONUT_SEGMENTS.map((seg) => (
                  <div key={seg.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                      <span className="text-[12px] text-gray-700">{seg.label}</span>
                    </div>
                    <span className="font-mono tabular-nums text-[12px] font-medium text-gray-900">{seg.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Việc cần làm */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-[15px] font-semibold text-gray-900">Việc cần làm</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {TODO_ITEMS.map((item) => {
            const Icon = item.icon;
            const iconColors = { warning: 'text-warning-600', info: 'text-info-600', success: 'text-success-600', danger: 'text-danger-600' };
            return (
              <div key={item.title} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 shrink-0`}>
                  <Icon size={15} strokeWidth={1.75} className={iconColors[item.variant]} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900">{item.title}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{item.sub}</p>
                </div>
                <span className="text-[12px] text-gray-400 shrink-0">{item.count}</span>
                <button
                  onClick={() => navigate(item.link)}
                  className="text-[12px] font-medium text-accent-600 hover:underline shrink-0"
                >
                  Xem →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
