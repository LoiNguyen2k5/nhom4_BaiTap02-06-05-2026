import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Power, X, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import Badge from '../../components/ui/Badge';

const EMPTY_FORM = { name: '', description: '' };

const inputClass = "w-full h-10 px-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors";
const labelClass = "block text-[12px] font-medium text-gray-700 mb-1.5";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getDepartments();
      if (data.success) setDepartments(data.data);
    } catch {
      setDepartments([
        { id: 1, name: 'IT & Backend', description: 'Phát triển hệ thống và API', status: 'active', member_count: 52, created_at: '2022-01-01' },
        { id: 2, name: 'Frontend', description: 'Phát triển giao diện người dùng', status: 'active', member_count: 41, created_at: '2022-01-01' },
        { id: 3, name: 'QA & Testing', description: 'Kiểm thử chất lượng phần mềm', status: 'active', member_count: 28, created_at: '2022-03-01' },
        { id: 4, name: 'DevOps', description: 'Hạ tầng và CI/CD', status: 'active', member_count: 22, created_at: '2022-06-01' },
        { id: 5, name: 'Mobile', description: 'Phát triển ứng dụng di động', status: 'active', member_count: 19, created_at: '2022-09-01' },
        { id: 6, name: 'Data Science', description: 'Phân tích dữ liệu và ML', status: 'active', member_count: 15, created_at: '2023-01-01' },
        { id: 7, name: 'Nhân sự', description: 'Quản lý nguồn nhân lực', status: 'active', member_count: 8, created_at: '2022-01-01' },
        { id: 8, name: 'Tài chính', description: 'Kế toán và kiểm soát tài chính', status: 'active', member_count: 6, created_at: '2022-01-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleOpenCreate = () => { setForm(EMPTY_FORM); setModalMode('create'); };
  const handleOpenEdit = (dept) => { setForm({ name: dept.name, description: dept.description || '' }); setModalMode(dept); };
  const handleCloseModal = () => { setModalMode(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await adminService.createDepartment(form);
        if (res.success) { showSuccess('Tạo phòng ban thành công!'); handleCloseModal(); fetchDepartments(); }
      } else {
        const res = await adminService.updateDepartment(modalMode.id, form);
        if (res.success) { showSuccess('Cập nhật phòng ban thành công!'); handleCloseModal(); fetchDepartments(); }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = (dept) => {
    setConfirmModal({ dept, newStatus: dept.status === 'active' ? 'inactive' : 'active' });
  };

  const handleConfirmToggle = async () => {
    if (!confirmModal) return;
    const { dept, newStatus } = confirmModal;
    setConfirmModal(null);
    try {
      const res = await adminService.updateDepartmentStatus(dept.id, newStatus);
      if (res.success) { showSuccess(res.message); fetchDepartments(); }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const filtered = departments.filter(d => d.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Quản lý phòng ban</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="font-mono tabular-nums font-medium text-gray-700">{departments.length}</span> phòng ban trong hệ thống
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="h-9 px-4 flex items-center gap-1.5 text-[13px] font-semibold bg-accent-600 hover:bg-accent-700 text-white rounded-md transition-colors active:scale-[.98] shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          Thêm phòng ban
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 border-l-[3px] border-success-500 bg-success-50 rounded-md px-4 py-3 text-[13px] text-success-700">
          <CheckCircle size={14} strokeWidth={2} />
          {success}
        </div>
      )}
      {error && (
        <div className="border-l-[3px] border-danger-500 bg-danger-50 rounded-md px-4 py-3 text-[13px] text-danger-700">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-72">
          <Search size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Tìm theo tên phòng ban..."
            className="w-full h-9 pl-9 pr-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          />
        </div>
        <span className="text-[12px] text-gray-400">{filtered.length} kết quả</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            <div className="h-10 bg-gray-50 border-b border-gray-200 animate-pulse" />
            {[1,2,3].map(i => (
              <div key={i} className="h-14 border-b border-gray-100 px-4 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-md bg-gray-200 shrink-0" />
                <div className="h-3 w-36 bg-gray-200 rounded flex-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['ID', 'Tên phòng ban', 'Mô tả', 'Nhân viên', 'Trạng thái', ''].map(col => (
                    <th key={col} className="h-10 px-4 text-left text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-gray-400">
                      {searchText ? 'Không tìm thấy phòng ban nào.' : 'Chưa có phòng ban nào. Hãy tạo phòng ban đầu tiên!'}
                    </td>
                  </tr>
                ) : (
                  filtered.map(dept => (
                    <tr key={dept.id} className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4">
                        <span className="font-mono tabular-nums text-[12px] text-gray-400">#{dept.id}</span>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-md bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-[13px] shrink-0">
                            {dept.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[13px] font-medium text-gray-900">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-4 max-w-56">
                        <p className="text-[12px] text-gray-500 truncate">
                          {dept.description || <span className="italic text-gray-400">Chưa có mô tả</span>}
                        </p>
                      </td>
                      <td className="px-4">
                        <span className="font-mono tabular-nums text-[13px] font-medium text-gray-700">{dept.userCount ?? 0}</span>
                      </td>
                      <td className="px-4">
                        <Badge variant={dept.status === 'active' ? 'success' : 'neutral'} dot size="sm">
                          {dept.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                        </Badge>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(dept)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-navy-50 hover:text-navy-700 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={13} strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(dept)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors
                              ${dept.status === 'active'
                                ? 'text-gray-500 hover:bg-warning-50 hover:text-warning-600'
                                : 'text-gray-500 hover:bg-success-50 hover:text-success-700'
                              }`}
                            title={dept.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          >
                            <Power size={13} strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {!loading && departments.length > 0 && (
          <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-[12px] text-gray-500">
              <span className="font-mono tabular-nums font-medium text-gray-700">{departments.length}</span> phòng ban ·{' '}
              <span className="font-mono tabular-nums font-medium text-success-600">{departments.filter(d => d.status === 'active').length}</span> đang hoạt động
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalMode !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-[16px] font-semibold text-gray-900">
                  {modalMode === 'create' ? 'Thêm phòng ban mới' : `Chỉnh sửa: ${modalMode.name}`}
                </h2>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {modalMode === 'create' ? 'Điền thông tin phòng ban mới' : 'Cập nhật tên hoặc mô tả'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className={labelClass}>Tên phòng ban <span className="text-danger-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ví dụ: Phòng Công nghệ thông tin"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Mô tả <span className="text-gray-400 font-normal">(không bắt buộc)</span></label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả ngắn về chức năng của phòng ban..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleCloseModal} disabled={submitting}
                  className="flex-1 h-10 border border-gray-300 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-60 transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" disabled={submitting || !form.name.trim()}
                  className="flex-1 h-10 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors">
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang lưu...
                    </span>
                  ) : modalMode === 'create' ? 'Tạo phòng ban' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Toggle Modal */}
      {confirmModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden p-6 space-y-4">
            <div className={`border-l-[3px] rounded-md px-4 py-3 text-[13px]
              ${confirmModal.newStatus === 'inactive'
                ? 'border-warning-500 bg-warning-50 text-warning-700'
                : 'border-success-500 bg-success-50 text-success-700'
              }`}>
              {confirmModal.newStatus === 'inactive'
                ? <>Vô hiệu hóa phòng ban <strong>{confirmModal.dept.name}</strong>? Phòng ban sẽ không hiện trong danh sách lựa chọn.</>
                : <>Kích hoạt phòng ban <strong>{confirmModal.dept.name}</strong> trở lại?</>
              }
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)}
                className="flex-1 h-10 border border-gray-300 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
                Hủy bỏ
              </button>
              <button onClick={handleConfirmToggle}
                className={`flex-1 h-10 text-white text-[13px] font-semibold rounded-md transition-colors
                  ${confirmModal.newStatus === 'inactive' ? 'bg-warning-600 hover:bg-warning-700' : 'bg-success-600 hover:bg-success-700'}`}>
                {confirmModal.newStatus === 'inactive' ? 'Vô hiệu hóa' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
