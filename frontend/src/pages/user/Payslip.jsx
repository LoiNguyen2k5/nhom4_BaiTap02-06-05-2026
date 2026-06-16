import { useState, useEffect } from 'react';
import { Wallet, Calendar, AlertTriangle, FileText, CheckCircle, Receipt, Download } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import payrollService from '../../services/payroll.service';

const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(Number(val)));

export default function Payslip() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchMyPayrolls();
  }, []);

  const fetchMyPayrolls = async () => {
    try {
      const res = await payrollService.getMyPayrolls();
      if (res.data.success) {
        setPayrolls(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedId(res.data.data[0].id); // Chọn tháng gần nhất mặc định
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPr = payrolls.find(p => p.id === selectedId);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Phiếu lương của tôi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Xem chi tiết các khoản thu nhập, khấu trừ và thuế hàng tháng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Cột trái: Lịch sử các tháng */}
        <div className="col-span-1 space-y-3">
          <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wider">Lịch sử phiếu lương</h2>
          
          {loading ? (
            <div className="p-5 text-center text-[13px] text-gray-500 bg-white border border-gray-200 rounded-lg">
              Đang tải dữ liệu...
            </div>
          ) : payrolls.length === 0 ? (
            <div className="p-5 text-center text-[13px] text-gray-500 bg-white border border-gray-200 rounded-lg flex flex-col items-center">
              <Receipt size={24} className="text-gray-300 mb-2" />
              Bạn chưa có phiếu lương nào được duyệt.
            </div>
          ) : (
            <div className="space-y-2">
              {payrolls.map((pr) => {
                const isSelected = pr.id === selectedId;
                const [year, m] = pr.month.split('-');
                return (
                  <div
                    key={pr.id}
                    onClick={() => setSelectedId(pr.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors flex items-center justify-between
                      ${isSelected 
                        ? 'bg-navy-50 border-navy-200' 
                        : 'bg-white border-gray-200 hover:border-navy-200 hover:bg-gray-50'
                      }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className={isSelected ? 'text-navy-600' : 'text-gray-400'} />
                        <span className={`text-[14px] font-semibold ${isSelected ? 'text-navy-900' : 'text-gray-900'}`}>
                          Tháng {m}/{year}
                        </span>
                      </div>
                      <div className={`text-[12px] mt-1 ${isSelected ? 'text-navy-600' : 'text-gray-500'}`}>
                        Thực nhận: <span className="font-semibold">{formatMoney(pr.net_salary)} đ</span>
                      </div>
                    </div>
                    <Badge variant={pr.status === 'paid' ? 'neutral' : 'success'}>
                      {pr.status === 'paid' ? 'Đã nhận' : 'Đã duyệt'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cột phải: Chi tiết phiếu lương */}
        <div className="col-span-1 lg:col-span-2">
          {!selectedPr ? (
            <div className="h-full min-h-[300px] flex items-center justify-center bg-white border border-gray-200 rounded-lg border-dashed">
              <p className="text-[13px] text-gray-400">Chọn một tháng ở cột bên để xem chi tiết</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet size={16} className="text-navy-600" />
                    <h2 className="text-[16px] font-bold text-gray-900">Chi tiết lương Tháng {selectedPr.month.split('-').reverse().join('/')}</h2>
                  </div>
                  <p className="text-[12px] text-gray-500">Mã phiếu: #PR{selectedPr.id.toString().padStart(5, '0')}</p>
                </div>
                <button className="h-8 px-3 flex items-center gap-1.5 text-[12px] font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  <Download size={14} />
                  Xuất PDF
                </button>
              </div>

              <div className="p-6">
                {/* Thu nhập */}
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">I. Thu nhập (Gross)</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Lương cơ bản theo hợp đồng</span>
                    <span className="font-mono text-gray-900">{formatMoney(selectedPr.base_salary)} đ</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Phụ cấp</span>
                    <span className="font-mono text-gray-900">{formatMoney(selectedPr.allowance)} đ</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Thưởng (KPI / Khác)</span>
                    <span className="font-mono text-gray-900">{formatMoney(selectedPr.bonus)} đ</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-semibold pt-2 border-t border-dashed">
                    <span className="text-gray-900">Tổng thu nhập</span>
                    <span className="font-mono text-gray-900">
                      {formatMoney(Number(selectedPr.base_salary) + Number(selectedPr.allowance) + Number(selectedPr.bonus))} đ
                    </span>
                  </div>
                </div>

                {/* Khấu trừ */}
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">II. Khấu trừ</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Bảo hiểm bắt buộc (NV đóng)</span>
                    <span className="font-mono text-danger-600">-{formatMoney(selectedPr.insurance_employee)} đ</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Thuế Thu nhập cá nhân (TNCN)</span>
                    <span className="font-mono text-danger-600">-{formatMoney(selectedPr.tax)} đ</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Tạm ứng đã rút</span>
                    <span className="font-mono text-danger-600">-{formatMoney(selectedPr.advance)} đ</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Phạt / Khấu trừ khác</span>
                    <span className="font-mono text-danger-600">-{formatMoney(selectedPr.deduction)} đ</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-semibold pt-2 border-t border-dashed">
                    <span className="text-gray-900">Tổng khấu trừ</span>
                    <span className="font-mono text-danger-600">
                      -{formatMoney(Number(selectedPr.insurance_employee) + Number(selectedPr.tax) + Number(selectedPr.advance) + Number(selectedPr.deduction))} đ
                    </span>
                  </div>
                </div>

                {/* Thực nhận */}
                <div className="bg-success-50 rounded-lg p-5 flex items-center justify-between border border-success-100">
                  <div>
                    <h3 className="text-[14px] font-bold text-success-900">III. Thực lãnh (Net Salary)</h3>
                    <p className="text-[12px] text-success-700 mt-0.5">Số tiền sẽ được chuyển khoản vào tài khoản của bạn</p>
                  </div>
                  <div className="text-[28px] font-mono font-bold text-success-700">
                    {formatMoney(selectedPr.net_salary)} <span className="text-[20px]">đ</span>
                  </div>
                </div>
                
                {selectedPr.status === 'paid' && (
                  <div className="mt-4 flex items-center justify-end gap-1.5 text-[12px] font-medium text-gray-500">
                    <CheckCircle size={14} className="text-success-500" />
                    Kế toán đã đánh dấu hoàn tất chuyển khoản
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
