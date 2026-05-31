import React, { useState, useEffect, useCallback } from 'react';
import hrService from '../../services/hr.service';

// ---- Icons ----
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

// ---- Helpers ----
const CONTRACT_TYPE_LABEL = { probation: 'Thử việc', official: 'Chính thức' };
const STATUS_CONFIG = {
  active:     { label: 'Đang hiệu lực', bg: 'bg-emerald-100 text-emerald-700' },
  expired:    { label: 'Hết hạn',       bg: 'bg-amber-100 text-amber-700' },
  terminated: { label: 'Đã chấm dứt',   bg: 'bg-red-100 text-red-700' },
};
const fmt = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtCurrency = (n) => Number(n).toLocaleString('vi-VN') + ' đ';

// ---- Modal Component ----
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-fadeIn">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-100">
          <XIcon />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

// ---- Main Component ----
const ContractManager = () => {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Form state
  const emptyForm = {
    user_id: '', contract_number: '', contract_type: 'probation',
    start_date: '', end_date: '', basic_salary: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [extendData, setExtendData] = useState({ end_date: '', basic_salary: '', contract_type: '', status: '' });

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const loadContracts = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const res = await hrService.getAllContracts(q);
      setContracts(res.data.contracts || []);
    } catch {
      showToast('error', 'Không thể tải danh sách hợp đồng');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      const res = await hrService.getAllEmployees();
      setEmployees(res.data.employees || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadContracts(); loadEmployees(); }, [loadContracts, loadEmployees]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => loadContracts(search), 400);
    return () => clearTimeout(t);
  }, [search, loadContracts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await hrService.createContract(formData);
      showToast('success', 'Tạo hợp đồng thành công!');
      setShowCreate(false);
      setFormData(emptyForm);
      loadContracts(search);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Lỗi khi tạo hợp đồng');
    }
  };

  const handleExtend = async (e) => {
    e.preventDefault();
    try {
      const payload = {};
      if (extendData.end_date) payload.end_date = extendData.end_date;
      if (extendData.basic_salary) payload.basic_salary = extendData.basic_salary;
      if (extendData.contract_type) payload.contract_type = extendData.contract_type;
      if (extendData.status) payload.status = extendData.status;
      await hrService.extendContract(selectedContract.id, payload);
      showToast('success', 'Cập nhật hợp đồng thành công!');
      setShowExtend(false);
      setSelectedContract(null);
      loadContracts(search);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Lỗi khi cập nhật hợp đồng');
    }
  };

  const openExtend = (contract) => {
    setSelectedContract(contract);
    setExtendData({
      end_date: contract.end_date || '',
      basic_salary: contract.basic_salary || '',
      contract_type: contract.contract_type || '',
      status: contract.status || '',
    });
    setShowExtend(true);
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 focus:bg-white transition";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all
          ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.text}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Hợp đồng lao động</h1>
            <p className="text-sm text-gray-500 mt-1">Toàn bộ hợp đồng trong hệ thống — {contracts.length} hợp đồng</p>
          </div>
          <button
            onClick={() => { setFormData(emptyForm); setShowCreate(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <PlusIcon /> Tạo hợp đồng mới
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Tổng hợp đồng', value: contracts.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Đang hiệu lực', value: contracts.filter(c => c.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Hết hạn', value: contracts.filter(c => c.status === 'expired').length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Chấm dứt', value: contracts.filter(c => c.status === 'terminated').length, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white`}>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <DocumentIcon />
              <p className="mt-4 font-medium text-gray-500">Không tìm thấy hợp đồng nào</p>
              <p className="text-sm mt-1">Thử thay đổi từ khoá tìm kiếm hoặc tạo hợp đồng mới</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nhân viên</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Số HĐ</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Loại</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày bắt đầu</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày kết thúc</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lương cơ bản</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trạng thái</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contracts.map((c) => {
                    const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.active;
                    const user = c.User;
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{user?.name || '—'}</p>
                              <p className="text-xs text-gray-400">{user?.email || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-gray-700">{c.contract_number}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${c.contract_type === 'official' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {CONTRACT_TYPE_LABEL[c.contract_type]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{fmt(c.start_date)}</td>
                        <td className="px-5 py-4 text-gray-600">{fmt(c.end_date)}</td>
                        <td className="px-5 py-4 font-semibold text-gray-700">{fmtCurrency(c.basic_salary)}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${st.bg}`}>{st.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => openExtend(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                          >
                            <EditIcon /> Cập nhật
                          </button>
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

      {/* Create Contract Modal */}
      {showCreate && (
        <Modal title="Tạo hợp đồng lao động mới" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className={labelClass}>Nhân viên</label>
              <select className={inputClass} required value={formData.user_id}
                onChange={e => setFormData({ ...formData, user_id: e.target.value })}>
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    [{emp.id}] {emp.name || emp.email} {emp.department ? `— ${emp.department}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Số hợp đồng</label>
                <input type="text" className={inputClass} required placeholder="VD: HĐ-2025-001"
                  value={formData.contract_number}
                  onChange={e => setFormData({ ...formData, contract_number: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Loại hợp đồng</label>
                <select className={inputClass} value={formData.contract_type}
                  onChange={e => setFormData({ ...formData, contract_type: e.target.value })}>
                  <option value="probation">Thử việc</option>
                  <option value="official">Chính thức</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Ngày bắt đầu</label>
                <input type="date" className={inputClass} required
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Ngày kết thúc</label>
                <input type="date" className={inputClass}
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Lương cơ bản (VND)</label>
              <input type="number" className={inputClass} required placeholder="VD: 10000000"
                value={formData.basic_salary}
                onChange={e => setFormData({ ...formData, basic_salary: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">
                Hủy
              </button>
              <button type="submit"
                className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition">
                Tạo hợp đồng
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Extend / Update Modal */}
      {showExtend && selectedContract && (
        <Modal title="Cập nhật hợp đồng" onClose={() => setShowExtend(false)}>
          <div className="mb-4 p-3 bg-gray-50 rounded-xl text-sm">
            <p><span className="text-gray-500">Nhân viên:</span> <strong>{selectedContract.User?.name || selectedContract.User?.email}</strong></p>
            <p className="mt-1"><span className="text-gray-500">Số HĐ:</span> <strong className="font-mono">{selectedContract.contract_number}</strong></p>
          </div>
          <form onSubmit={handleExtend} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Loại hợp đồng</label>
                <select className={inputClass} value={extendData.contract_type}
                  onChange={e => setExtendData({ ...extendData, contract_type: e.target.value })}>
                  <option value="">— Không thay đổi —</option>
                  <option value="probation">Thử việc</option>
                  <option value="official">Chính thức</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Trạng thái</label>
                <select className={inputClass} value={extendData.status}
                  onChange={e => setExtendData({ ...extendData, status: e.target.value })}>
                  <option value="">— Không thay đổi —</option>
                  <option value="active">Đang hiệu lực</option>
                  <option value="expired">Hết hạn</option>
                  <option value="terminated">Đã chấm dứt</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Ngày kết thúc mới</label>
                <input type="date" className={inputClass} value={extendData.end_date}
                  onChange={e => setExtendData({ ...extendData, end_date: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Lương cơ bản mới (VND)</label>
                <input type="number" className={inputClass} placeholder="Để trống nếu không đổi"
                  value={extendData.basic_salary}
                  onChange={e => setExtendData({ ...extendData, basic_salary: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowExtend(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">
                Hủy
              </button>
              <button type="submit"
                className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ContractManager;
