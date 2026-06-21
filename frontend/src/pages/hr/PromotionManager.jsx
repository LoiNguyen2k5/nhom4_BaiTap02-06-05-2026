import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, CheckCircle, XCircle, X } from 'lucide-react';
import performanceService from '../../services/performance.service';
import { useSelector } from 'react-redux';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const STATUS_CONFIG = {
  Pending:  { label: 'Chờ duyệt', variant: 'warning' },
  Approved: { label: 'Đã duyệt',  variant: 'success' },
  Rejected: { label: 'Từ chối',   variant: 'danger' },
};

const inputClass = "w-full h-10 px-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors";
const labelClass = "block text-[12px] font-medium text-gray-700 mb-1.5";

const PromotionManager = () => {
  const user = useSelector(state => state.auth.user);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', current_position: '', proposed_position: '', reason: '' });
  const [employees, setEmployees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(0);
  const [proposedSalary, setProposedSalary] = useState('');
  const [pctIncrease, setPctIncrease] = useState(0);

  useEffect(() => {
    fetchProposals();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (currentSalary > 0 && proposedSalary > 0) {
      const pct = ((Number(proposedSalary) - currentSalary) / currentSalary) * 100;
      setPctIncrease(pct);
    } else {
      setPctIncrease(0);
    }
  }, [currentSalary, proposedSalary]);

  const fetchEmployees = async () => {
    try {
      const res = await performanceService.getAllEmployees();
      if (res.data?.employees) setEmployees(res.data.employees);
      else if (res.data?.success && Array.isArray(res.data.data)) setEmployees(res.data.data);
      else if (Array.isArray(res.data)) setEmployees(res.data);
      else setEmployees([]);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchProposals = async () => {
    try {
      const res = await performanceService.getPromotions();
      setProposals(res.data.data || []);
    } catch {
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'user_id') {
        const emp = employees.find(emp => String(emp.id) === String(value));
        if (emp && emp.contracts && emp.contracts.length > 0) {
          setCurrentSalary(emp.contracts[0].basic_salary);
        } else {
          setCurrentSalary(0);
        }
        setProposedSalary('');
        setPctIncrease(0);
      }
      return updated;
    });
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await performanceService.createPromotion({
        ...formData,
        proposed_salary: proposedSalary ? Number(proposedSalary) : undefined
      });
      
      if (res.data?.warning) {
        alert(`Đã gửi đề xuất thành công!\nLưu ý: ${res.data.warning}`);
      } else {
        alert('Đã gửi đề xuất thành công!');
      }

      setShowForm(false);
      setFormData({ user_id: '', current_position: '', proposed_position: '', reason: '' });
      setProposedSalary('');
      setCurrentSalary(0);
      setPctIncrease(0);
      fetchProposals();
    } catch (error) {
      console.error(error);
      alert('Lỗi tạo đề xuất');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await performanceService.updatePromotionStatus(id, status);
      fetchProposals();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Lỗi duyệt đề xuất.');
    }
  };

  const pendingCount = proposals.filter(p => p.status === 'Pending').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Đề xuất thăng chức / tăng lương</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount > 0 ? (
              <><span className="font-mono tabular-nums font-medium text-warning-600">{pendingCount}</span> đề xuất đang chờ duyệt</>
            ) : (
              <><span className="font-mono tabular-nums font-medium text-gray-700">{proposals.length}</span> đề xuất trong hệ thống</>
            )}
          </p>
        </div>
        {(user?.role === 'manager' || user?.role === 'hr') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="h-9 px-4 flex items-center gap-1.5 text-[13px] font-semibold bg-accent-600 hover:bg-accent-700 text-white rounded-md transition-colors active:scale-[.98] shrink-0"
          >
            {showForm ? <X size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
            {showForm ? 'Đóng' : 'Tạo đề xuất mới'}
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (user?.role === 'manager' || user?.role === 'hr') && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Đề xuất mới</h2>
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nhân viên <span className="text-danger-500">*</span></label>
                <select name="user_id" value={formData.user_id} onChange={handleChange} required className={inputClass}>
                  <option value="">-- Chọn nhân viên --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || emp.username} · #{emp.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Chức vụ hiện tại <span className="text-danger-500">*</span></label>
                <input
                  type="text"
                  name="current_position"
                  value={formData.current_position}
                  onChange={handleChange}
                  required
                  placeholder="VD: Junior Developer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Chức vụ đề xuất <span className="text-danger-500">*</span></label>
                <input
                  type="text"
                  name="proposed_position"
                  value={formData.proposed_position}
                  onChange={handleChange}
                  required
                  placeholder="VD: Senior Developer"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Lương hiện tại (VNĐ)</label>
                <input
                  type="text"
                  disabled
                  value={currentSalary > 0 ? `${currentSalary.toLocaleString('vi-VN')} VNĐ` : 'Chưa có hợp đồng hoạt động'}
                  className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClass}>Mức lương đề xuất mới (VNĐ) <span className="text-danger-500">*</span></label>
                <input
                  type="number"
                  name="proposed_salary"
                  value={proposedSalary}
                  onChange={(e) => setProposedSalary(e.target.value)}
                  required
                  placeholder="VD: 20000000"
                  className={inputClass}
                />
              </div>
            </div>

            {pctIncrease > 30 && (
              <div className="p-3 border rounded-md text-[13px] flex items-center gap-2" style={{ backgroundColor: '#fffbeb', borderColor: '#fef3c7', color: '#b45309' }}>
                <span className="font-semibold">⚠️ Cảnh báo:</span>
                Mức tăng vượt ngưỡng quy định 30% (tăng {pctIncrease.toFixed(1)}%). Yêu cầu phê duyệt cấp cao từ Ban giám đốc.
              </div>
            )}

            <div>
              <label className={labelClass}>Lý do đề xuất (dựa trên KPI) <span className="text-danger-500">*</span></label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Mô tả lý do thăng chức, thành tích nổi bật, điểm KPI..."
                className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-10 px-5 border border-gray-300 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-10 px-6 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors"
              >
                {submitting ? 'Đang gửi...' : 'Gửi đề xuất'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            <div className="h-10 bg-gray-50 border-b border-gray-200 animate-pulse" />
            {[1,2,3].map(i => (
              <div key={i} className="h-16 border-b border-gray-100 px-4 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-2.5 w-20 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Nhân viên', 'Đề xuất', 'Lý do', 'Người đề xuất', 'Trạng thái', ''].map(col => (
                    <th key={col} className="h-10 px-4 text-left text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {proposals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-gray-400">
                      Chưa có đề xuất nào.
                    </td>
                  </tr>
                ) : (
                  proposals.map(p => {
                    const stCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.Pending;
                    return (
                      <tr key={p.id} className="h-16 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={p.user?.Profile?.full_name || p.user?.name || p.user?.username || 'U'} size="sm" />
                            <div>
                              <p className="text-[13px] font-medium text-gray-900">{p.user?.Profile?.full_name || p.user?.name || p.user?.username || '—'}</p>
                              <p className="font-mono tabular-nums text-[11px] text-gray-400">ID #{p.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[12px] text-gray-600">{p.current_position}</span>
                            <ArrowRight size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
                            <span className="text-[12px] font-semibold text-success-700">{p.proposed_position}</span>
                          </div>
                        </td>
                        <td className="px-4 max-w-56">
                          <p className="text-[12px] text-gray-600 truncate" title={p.reason}>{p.reason}</p>
                        </td>
                        <td className="px-4">
                          <span className="text-[12px] text-gray-500">{p.proposer?.name || p.proposer?.username || '—'}</span>
                        </td>
                        <td className="px-4">
                          <Badge variant={stCfg.variant} size="sm">{stCfg.label}</Badge>
                        </td>
                        <td className="px-4">
                          {p.status === 'Pending' && (user?.role === 'admin' || user?.role === 'hr') && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateStatus(p.id, 'Approved')}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-success-50 hover:text-success-700 transition-colors"
                                title="Duyệt"
                              >
                                <CheckCircle size={15} strokeWidth={1.75} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(p.id, 'Rejected')}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-danger-50 hover:text-danger-600 transition-colors"
                                title="Từ chối"
                              >
                                <XCircle size={15} strokeWidth={1.75} />
                              </button>
                            </div>
                          )}
                          {p.status === 'Pending' && user?.role === 'manager' && (
                            <span className="text-[12px] text-gray-400 italic">Chờ duyệt</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManager;
