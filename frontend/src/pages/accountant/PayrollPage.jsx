import { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Users, CheckCircle, CheckSquare } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import payrollService from '../../services/payroll.service';

const TYPE_BADGE = {
  'Full-time':  { label: 'Full-time',  variant: 'brand' },
  'Intern':     { label: 'Thực tập',  variant: 'info' },
  'Freelancer': { label: 'Freelancer', variant: 'accent' },
};

const STATUS_BADGE = {
  draft:    { label: 'Nháp',     variant: 'warning' },
  approved: { label: 'Đã duyệt', variant: 'success' },
  paid:     { label: 'Đã trả',   variant: 'neutral' },
};

const formatMoney = (val) =>
  new Intl.NumberFormat('vi-VN').format(Math.round(Number(val)));

export default function PayrollPage() {
  const today = new Date();
  const defaultMonth = today.toISOString().slice(0, 7);
  const [month, setMonth] = useState(defaultMonth);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPayrolls();
  }, [month]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getPayrolls(month);
      if (res.data.success) setPayrolls(res.data.data);
    } catch {
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    const [year, m] = month.split('-');
    if (!window.confirm(`Tính lương nháp cho Tháng ${m}/${year}?\nDữ liệu nháp cũ của tháng này sẽ bị ghi đè.`)) return;
    try {
      setCalculating(true);
      setMessage({ type: '', text: '' });
      const res = await payrollService.calculatePayroll(month);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchPayrolls();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra khi tính lương' });
    } finally {
      setCalculating(false);
    }
  };

  const handleApprove = async () => {
    const [year, m] = month.split('-');
    if (!window.confirm(`Bạn có chắc chắn muốn DUYỆT toàn bộ bảng lương nháp của Tháng ${m}/${year} không?\nSau khi duyệt, nhân viên sẽ xem được phiếu lương.`)) return;
    
    try {
      setApproving(true);
      setMessage({ type: '', text: '' });
      const res = await payrollService.approvePayroll(month);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchPayrolls();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra khi duyệt lương' });
    } finally {
      setApproving(false);
    }
  };

  const [year, m] = month.split('-');
  const monthLabel = `Tháng ${m}/${year}`;

  // Tổng hợp nhanh
  const totalNet = payrolls.reduce((s, p) => s + Number(p.net_salary || 0), 0);
  const totalTax = payrolls.reduce((s, p) => s + Number(p.tax || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Tính lương tháng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Hệ thống tự nhận loại nhân sự và áp dụng công thức tương ứng
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 px-3 text-[13px] border border-gray-300 rounded-md bg-white focus:outline-none focus:border-navy-700"
          />
          <button
            onClick={handleCalculate}
            disabled={calculating || approving}
            className="h-9 px-4 flex items-center gap-1.5 text-[13px] font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-60"
          >
            {calculating ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Calculator size={14} />
            )}
            Tính nháp
          </button>

          <button
            onClick={handleApprove}
            disabled={calculating || approving || payrolls.length === 0}
            className="h-9 px-4 flex items-center gap-1.5 text-[13px] font-semibold bg-navy-700 hover:bg-navy-800 text-white rounded-md transition-colors disabled:opacity-60"
          >
            {approving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <CheckSquare size={14} />
            )}
            Duyệt bảng lương
          </button>
        </div>
      </div>

      {/* Thông báo */}
      {message.text && (
        <div className={`flex items-center gap-2 border-l-[3px] rounded-md px-4 py-3 text-[13px]
          ${message.type === 'success'
            ? 'border-success-500 bg-success-50 text-success-700'
            : 'border-danger-500 bg-danger-50 text-danger-700'}`}>
          {message.type === 'success' && <CheckCircle size={14} strokeWidth={2} />}
          {message.text}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-2">Số nhân viên</p>
          <p className="font-mono tabular-nums text-[32px] font-bold text-gray-900 leading-none">{payrolls.length}</p>
          <p className="text-[12px] text-gray-400 mt-1">nhân sự được tính lương</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-2">Tổng thực nhận</p>
          <p className="font-mono tabular-nums text-[22px] font-bold text-success-700 leading-none">
            {payrolls.length > 0 ? `${formatMoney(totalNet)} đ` : '—'}
          </p>
          <p className="text-[12px] text-gray-400 mt-1">sau khấu trừ thuế & bảo hiểm</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-2">Tổng thuế TNCN</p>
          <p className="font-mono tabular-nums text-[22px] font-bold text-danger-600 leading-none">
            {payrolls.length > 0 ? `${formatMoney(totalTax)} đ` : '—'}
          </p>
          <p className="text-[12px] text-gray-400 mt-1">phải khấu trừ nộp ngân sách</p>
        </div>
      </div>

      {/* Bảng lương */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users size={15} strokeWidth={1.75} className="text-gray-500" />
            <h2 className="text-[15px] font-semibold text-gray-900">Bảng lương {monthLabel}</h2>
          </div>
          <Badge variant="neutral">{payrolls.length} nhân viên</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Nhân viên', 'Loại NS', 'Lương cơ bản', 'BH nhân viên đóng', 'Thuế TNCN', 'Khấu trừ khác', 'Thực nhận', 'Trạng thái']
                  .map((col, i) => (
                    <th key={col} className={`h-11 px-4 text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 whitespace-nowrap ${i > 1 ? 'text-right' : ''}`}>
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-[13px] text-gray-400">
                    <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-gray-300" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-[13px] text-gray-400">
                    Chưa có dữ liệu lương cho {monthLabel}.
                    <br />
                    <span className="text-[12px]">Bấm nút <strong>"Tính lương {monthLabel}"</strong> để hệ thống tự động tính toán.</span>
                  </td>
                </tr>
              ) : (
                payrolls.map((pr) => {
                  const empType = pr.contract_type || 'Full-time';
                  const typeCfg = TYPE_BADGE[empType] || TYPE_BADGE['Full-time'];
                  const statusCfg = STATUS_BADGE[pr.status] || STATUS_BADGE.draft;
                  return (
                    <tr key={pr.id} className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={pr.user?.name || pr.user?.email} size="sm" />
                          <div>
                            <p className="text-[13px] font-medium text-gray-900">{pr.user?.name || 'Chưa có tên'}</p>
                            <p className="text-[11px] text-gray-400">{pr.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <Badge variant={typeCfg.variant}>{typeCfg.label}</Badge>
                      </td>
                      <td className="px-4 text-right font-mono text-[13px] text-gray-700">{formatMoney(pr.base_salary)}</td>
                      <td className="px-4 text-right font-mono text-[13px] text-danger-600">
                        {Number(pr.insurance_employee) > 0 ? `-${formatMoney(pr.insurance_employee)}` : '—'}
                      </td>
                      <td className="px-4 text-right font-mono text-[13px] text-danger-600">
                        {Number(pr.tax) > 0 ? `-${formatMoney(pr.tax)}` : '—'}
                      </td>
                      <td className="px-4 text-right font-mono text-[13px] text-danger-600">
                        {Number(pr.deduction) > 0 ? `-${formatMoney(pr.deduction)}` : '—'}
                      </td>
                      <td className="px-4 text-right font-mono text-[13px] font-semibold text-success-700">
                        {formatMoney(pr.net_salary)} đ
                      </td>
                      <td className="px-4 text-center">
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
