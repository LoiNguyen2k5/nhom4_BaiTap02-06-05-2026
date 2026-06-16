import { useState, useEffect } from 'react';
import { Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import Badge from '../../components/ui/Badge';

export default function UserPayslip() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/profile/my-payslips/list');
      setPayslips(res.data?.payrolls || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (val) => Number(val || 0).toLocaleString('vi-VN');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Phiếu lương</h1>
        <p className="text-sm text-gray-500 mt-0.5">Xem chi tiết phiếu lương các tháng</p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm">Đang tải...</div>
      ) : payslips.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
          <Wallet size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Chưa có phiếu lương nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payslips.map((p) => {
            const isExpanded = expandedId === p.id;
            const grossIncome = Number(p.base_salary) + Number(p.allowances) + Number(p.bonuses);
            const totalDeduct = Number(p.deductions) + Number(p.tax) + Number(p.insurance);
            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all">
                {/* Header row - always visible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                      <Wallet size={18} className="text-navy-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-semibold text-gray-900">Tháng {p.month}/{p.year}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {p.status === 'approved' ? 'Đã duyệt' : p.status === 'paid' ? 'Đã thanh toán' : 'Đang xử lý'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[16px] font-bold text-success-600">{fmt(p.net_salary)} đ</p>
                      <p className="text-[11px] text-gray-400">Thực lãnh</p>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {/* Thu nhập */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 mb-2">Thu nhập</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[13px] text-gray-600">Lương cơ bản</span>
                            <span className="text-[13px] font-medium text-gray-900">{fmt(p.base_salary)} đ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[13px] text-gray-600">Phụ cấp</span>
                            <span className="text-[13px] font-medium text-gray-900">{fmt(p.allowances)} đ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[13px] text-gray-600">Thưởng / KPI</span>
                            <span className="text-[13px] font-medium text-gray-900">{fmt(p.bonuses)} đ</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-100 pt-2">
                            <span className="text-[13px] font-semibold text-gray-900">Tổng thu nhập</span>
                            <span className="text-[13px] font-bold text-gray-900">{fmt(grossIncome)} đ</span>
                          </div>
                        </div>
                      </div>

                      {/* Khấu trừ */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 mb-2">Khấu trừ</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[13px] text-gray-600">Thuế TNCN</span>
                            <span className="text-[13px] font-medium text-danger-600">-{fmt(p.tax)} đ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[13px] text-gray-600">Bảo hiểm</span>
                            <span className="text-[13px] font-medium text-danger-600">-{fmt(p.insurance)} đ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[13px] text-gray-600">Khấu trừ khác</span>
                            <span className="text-[13px] font-medium text-danger-600">-{fmt(p.deductions)} đ</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-100 pt-2">
                            <span className="text-[13px] font-semibold text-gray-900">Tổng khấu trừ</span>
                            <span className="text-[13px] font-bold text-danger-600">-{fmt(totalDeduct)} đ</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Net */}
                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-[14px] font-semibold text-gray-900">💰 Thực lãnh</span>
                      <span className="text-[18px] font-bold text-success-600">{fmt(p.net_salary)} đ</span>
                    </div>

                    {p.is_payslip_sent && (
                      <div className="mt-3">
                        <Badge variant="success" size="sm">✉ Phiếu lương đã được gửi qua email</Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
