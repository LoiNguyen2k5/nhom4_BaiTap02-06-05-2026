import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, CheckCircle, Lock, Unlock, Calendar, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

const BACKEND_URL = 'http://localhost:3000';

const HRAttendanceReport = () => {
  const { token } = useSelector((state) => state.auth);
  const [month, setMonth] = useState('2026-06'); // Mặc định tháng 06/2026 theo testcase
  const [reportData, setReportData] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/hr/attendance/report?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReportData(res.data.data);
        setIsLocked(res.data.isLocked);
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lấy báo cáo chấm công');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month]);

  const handleLock = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn chốt và khóa bảng công tháng ${month} không? Sau khi chốt, nhân viên sẽ không thể tự chấm công hoặc sửa đổi dữ liệu tháng này.`)) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/hr/attendance/lock`, { month }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setIsLocked(true);
        alert(res.data.message);
        fetchReport();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi chốt bảng công');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlock = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn mở khóa bảng công tháng ${month} không?`)) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/hr/attendance/unlock`, { month }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setIsLocked(false);
        alert(res.data.message);
        fetchReport();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi mở khóa bảng công');
    } finally {
      setSubmitting(false);
    }
  };

  const exportToExcel = () => {
    if (reportData.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    const headers = ['Nhân viên', 'Email', 'Phòng ban', 'Đi làm đúng giờ', 'Đi trễ', 'Nghỉ có phép', 'Vắng không phép', 'Tổng giờ làm'];
    const rows = reportData.map(row => [
      row.name,
      row.email,
      row.department,
      row.present,
      row.late,
      row.leave,
      row.absent,
      `${row.work_hours}h`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create a Blob with UTF-8 BOM so Excel opens Vietnamese characters correctly
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_Cong_Thang_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Bảng Tổng Hợp Công</h1>
          <p className="text-sm text-gray-500 mt-0.75">Xem báo cáo tổng hợp công & khóa dữ liệu cuối tháng</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 shadow-sm">
            <Calendar size={15} className="text-gray-400" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="text-[13px] font-medium text-gray-700 bg-transparent outline-none cursor-pointer"
            />
          </div>
          <button
            onClick={fetchReport}
            className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
            title="Làm mới"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Lock status banner */}
      {isLocked ? (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-900">Bảng công đã được chốt và khóa</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Dữ liệu chấm công của tháng {month} đã bị đóng băng và chuyển tiếp sang bộ phận Kế toán.
              </p>
            </div>
          </div>
          <button
            onClick={handleUnlock}
            disabled={submitting}
            className="h-8 px-3 flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
          >
            <Unlock size={13} />
            Mở khóa
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Bảng công chưa chốt</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Dữ liệu chấm công của tháng {month} vẫn đang mở. HR cần rà soát kỹ trước khi chốt công.
              </p>
            </div>
          </div>
          <button
            onClick={handleLock}
            disabled={submitting}
            className="h-8 px-4 flex items-center gap-1.5 text-xs font-semibold bg-navy-700 hover:bg-navy-800 text-white rounded shadow-sm transition-colors active:scale-[.98]"
          >
            <Lock size={13} />
            Chốt bảng công
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Tổng số nhân sự" value={reportData.length.toString()} />
        <StatCard
          label="Đang mở / Đã chốt"
          value={isLocked ? 'ĐÃ CHỐT' : 'ĐANG MỞ'}
          accentValue={!isLocked}
        />
        <StatCard
          label="Tổng ngày công (tháng)"
          value={reportData.reduce((acc, row) => acc + row.present + row.late, 0).toString()}
        />
        <StatCard
          label="Tổng số giờ làm"
          value={reportData.reduce((acc, row) => acc + row.work_hours, 0).toFixed(1)}
        />
      </div>

      {/* Report Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">Chi tiết bảng công tháng {month}</h2>
          <button
            onClick={exportToExcel}
            className="h-8 px-3 flex items-center gap-1 text-xs font-semibold text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-xs"
          >
            <Download size={13} />
            Xuất Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="h-11 px-6 text-left text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">Nhân viên</th>
                <th className="h-11 px-4 text-left text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">Phòng ban</th>
                <th className="h-11 px-4 text-center text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">Đi làm (đúng giờ)</th>
                <th className="h-11 px-4 text-center text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">Đi trễ</th>
                <th className="h-11 px-4 text-center text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">Nghỉ có phép</th>
                <th className="h-11 px-4 text-center text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">Vắng (không phép)</th>
                <th className="h-11 px-6 text-right text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400">Tổng giờ làm</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[13px] text-gray-400">Đang tải báo cáo...</td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[13px] text-gray-400">Không có dữ liệu cho tháng này</td>
                </tr>
              ) : (
                reportData.map((row) => (
                  <tr key={row.user_id} className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.name} size="md" />
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{row.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 text-[13px] text-gray-600">{row.department}</td>
                    <td className="px-4 text-center font-mono text-[13px] text-emerald-600 font-semibold">{row.present}</td>
                    <td className="px-4 text-center font-mono text-[13px] text-amber-600 font-semibold">{row.late}</td>
                    <td className="px-4 text-center font-mono text-[13px] text-sky-600 font-semibold">{row.leave}</td>
                    <td className="px-4 text-center font-mono text-[13px] text-rose-600 font-semibold">{row.absent}</td>
                    <td className="px-6 text-right font-mono text-[13px] font-semibold text-gray-900">{row.work_hours}h</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRAttendanceReport;
