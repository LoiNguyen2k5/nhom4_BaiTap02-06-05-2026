import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, RefreshCw, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const EMPTY_FILTERS = {
  search: '',
  role: '',
  status: '',
  department: '',
  created_from: '',
  created_to: '',
};

const ROLE_BADGE = {
  admin:      { label: 'Admin',       variant: 'accent' },
  hr:         { label: 'HR',          variant: 'brand' },
  manager:    { label: 'Quản lý',     variant: 'neutral' },
  accountant: { label: 'Kế toán',     variant: 'info' },
  employee:   { label: 'Nhân viên',   variant: 'neutral' },
};

const MOCK_USERS_DATA = [
  { id: 1, name: 'Nguyễn Văn An', email: 'an.nv@atria.dev', role: 'admin', status: 'active', department: { name: 'IT' }, created_at: '2024-01-15T00:00:00Z' },
  { id: 2, name: 'Trần Thị Hương', email: 'huong.tt@atria.dev', role: 'hr', status: 'active', department: { name: 'Nhân sự' }, created_at: '2024-02-01T00:00:00Z' },
  { id: 3, name: 'Lê Minh Đức', email: 'duc.lm@atria.dev', role: 'manager', status: 'active', department: { name: 'Kỹ thuật' }, created_at: '2024-01-20T00:00:00Z' },
  { id: 4, name: 'Phạm Thị Lan', email: 'lan.pt@atria.dev', role: 'accountant', status: 'active', department: { name: 'Tài chính' }, created_at: '2024-03-10T00:00:00Z' },
  { id: 5, name: 'Vũ Minh Khôi', email: 'khoi.vm@atria.dev', role: 'employee', status: 'active', department: { name: 'Kỹ thuật' }, created_at: '2024-04-05T00:00:00Z' },
  { id: 6, name: 'Đỗ Thanh Tùng', email: 'tung.dt@atria.dev', role: 'employee', status: 'active', department: { name: 'Backend' }, created_at: '2024-04-12T00:00:00Z' },
  { id: 7, name: 'Nguyễn Thị Linh', email: 'linh.nt@atria.dev', role: 'employee', status: 'active', department: { name: 'Frontend' }, created_at: '2024-05-01T00:00:00Z' },
  { id: 8, name: 'Trần Văn Bảo', email: 'bao.tv@atria.dev', role: 'employee', status: 'inactive', department: { name: 'QA' }, created_at: '2024-02-20T00:00:00Z' },
  { id: 9, name: 'Lý Thanh Xuân', email: 'xuan.lt@atria.dev', role: 'employee', status: 'active', department: { name: 'DevOps' }, created_at: '2024-06-01T00:00:00Z' },
  { id: 10, name: 'Mai Thị Thu', email: 'thu.mt@atria.dev', role: 'employee', status: 'active', department: { name: 'Data' }, created_at: '2024-06-15T00:00:00Z' },
];

const AdminUsers = () => {
  const [searchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    status: searchParams.get('status') || '',
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const EMPTY_CREATE_FORM = { name: '', email: '', role: 'employee', department_id: '' };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState(null);
  const [departments, setDepartments] = useState([]);

  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  const fetchUsers = async (currentFilters, page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...Object.fromEntries(Object.entries(currentFilters).filter(([, v]) => v !== '')),
        page,
        limit: 20,
      };
      const data = await adminService.getUsers(params);
      if (data.success) {
        setUsers(data.data);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch {
      setUsers(MOCK_USERS_DATA);
      setPagination({ total: MOCK_USERS_DATA.length, page: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filtersRef.current, 1);
    adminService.getDepartments({ status: 'active' }).then(res => {
      if (res.success) setDepartments(res.data);
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(filtersRef.current, 1);
  };

  const handleReset = () => {
    const reset = { ...EMPTY_FILTERS };
    setFilters(reset);
    fetchUsers(reset, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchUsers(filtersRef.current, newPage);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { ...createForm, department_id: createForm.department_id || null };
      const res = await adminService.createUser(payload);
      if (res.success) {
        setCreateResult(res);
        fetchUsers(filtersRef.current, 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản.');
      setShowCreateModal(false);
    } finally {
      setCreating(false);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateResult(null);
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <>
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total > 0 ? (
              <><span className="font-mono tabular-nums font-medium text-gray-700">{pagination.total}</span> tài khoản trong hệ thống</>
            ) : 'Xem và quản lý tất cả tài khoản trong hệ thống'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-9 px-4 flex items-center gap-1.5 text-[13px] font-semibold bg-accent-600 hover:bg-accent-700 text-white rounded-md transition-colors active:scale-[.98] shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          Tạo tài khoản
        </button>
      </div>

      {/* Toolbar */}
      <form onSubmit={handleSearchSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Tên hoặc email..."
              className="w-full h-9 pl-9 pr-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
            />
          </div>

          {/* Vai trò */}
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="h-9 px-3 text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="manager">Quản lý</option>
            <option value="accountant">Kế toán</option>
            <option value="employee">Nhân viên</option>
          </select>

          {/* Trạng thái */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="h-9 px-3 text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Bị khoá</option>
          </select>

          {/* Phòng ban */}
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="h-9 px-3 text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          >
            <option value="">Tất cả phòng ban</option>
            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>

          {/* Ngày tạo */}
          <input
            type="date"
            name="created_from"
            value={filters.created_from}
            onChange={handleFilterChange}
            className="h-9 px-3 text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          />
          <span className="text-[12px] text-gray-400 self-center">đến</span>
          <input
            type="date"
            name="created_to"
            value={filters.created_to}
            onChange={handleFilterChange}
            className="h-9 px-3 text-[13px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          />

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="h-9 px-4 text-[13px] font-medium bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white rounded-md transition-colors"
          >
            Lọc
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="h-9 px-3 flex items-center gap-1.5 text-[13px] text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              <RefreshCw size={13} strokeWidth={2} />
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="border-l-[3px] border-danger-500 bg-danger-50 rounded-md px-4 py-3 text-[13px] text-danger-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['ID', 'Nhân viên', 'Vai trò', 'Phòng ban', 'Trạng thái', 'Ngày tạo', ''].map((col) => (
                  <th key={col} className="h-10 px-4 text-left text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-200 rounded" />
                          <div className="h-2.5 w-36 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    {[24, 20, 16, 16, ''].map((w, j) => (
                      <td key={j} className="px-4 py-3">
                        {w ? <div className={`h-3 w-${w} bg-gray-200 rounded`} /> : null}
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[13px] text-gray-400">
                    Không tìm thấy tài khoản nào phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleCfg = ROLE_BADGE[user.role] || { label: user.role, variant: 'neutral' };
                  const isActive = user.status === 'active';
                  return (
                    <tr key={user.id} className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4">
                        <span className="font-mono tabular-nums text-[12px] text-gray-400">#{user.id}</span>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name || 'U'} size="sm" />
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 leading-tight">{user.name || '—'}</p>
                            <p className="text-[12px] text-gray-400 mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <Badge variant={roleCfg.variant} size="sm">{roleCfg.label}</Badge>
                      </td>
                      <td className="px-4">
                        <span className="text-[13px] text-gray-600">{user.department?.name || '—'}</span>
                      </td>
                      <td className="px-4">
                        <Badge variant={isActive ? 'success' : 'danger'} dot size="sm">
                          {isActive ? 'Hoạt động' : 'Bị khoá'}
                        </Badge>
                      </td>
                      <td className="px-4">
                        <span className="font-mono tabular-nums text-[12px] text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-4">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="text-[12px] font-medium text-accent-600 hover:text-accent-700 hover:underline whitespace-nowrap"
                        >
                          Chi tiết →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[12px] text-gray-500">
              Hiển thị{' '}
              <span className="font-mono tabular-nums font-medium text-gray-700">
                {(pagination.page - 1) * 20 + 1}–{Math.min(pagination.page * 20, pagination.total)}
              </span>{' '}
              / <span className="font-mono tabular-nums font-medium text-gray-700">{pagination.total}</span> tài khoản
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} strokeWidth={2} />
              </button>
              <span className="px-3 text-[13px] font-medium text-gray-700">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ======== MODAL: Tạo tài khoản mới ======== */}
    {showCreateModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">

          {createResult ? (
            /* Success screen */
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center mb-4">
                <CheckCircle size={28} strokeWidth={1.75} className="text-success-600" />
              </div>
              <h2 className="text-[18px] font-semibold text-gray-900 mb-1">Tạo tài khoản thành công!</h2>
              <p className="text-[13px] text-gray-500 mb-5">Vui lòng gửi thông tin dưới đây cho nhân viên.</p>

              <div className="w-full bg-gray-50 border border-gray-200 rounded-md p-4 text-left space-y-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-500">Email:</span>
                  <span className="text-[13px] font-medium text-gray-900">{createResult.data.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-500">Mật khẩu tạm:</span>
                  <span className="font-mono text-[13px] font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded">
                    {createResult.data.tempPassword}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-500">Vai trò:</span>
                  <span className="text-[13px] font-medium text-gray-900">{createResult.data.role}</span>
                </div>
              </div>

              <div className="border-l-[3px] border-warning-500 bg-warning-50 rounded px-3 py-2 text-[12px] text-warning-700 text-left w-full mb-5">
                Hãy yêu cầu nhân viên đổi mật khẩu ngay sau khi đăng nhập lần đầu.
              </div>

              <button
                onClick={handleCloseCreateModal}
                className="w-full h-10 bg-navy-700 hover:bg-navy-800 text-white text-[13px] font-semibold rounded-md transition-colors"
              >
                Đóng
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-[16px] font-semibold text-gray-900">Tạo tài khoản mới</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Hệ thống sẽ tự tạo mật khẩu tạm cho nhân viên</p>
                </div>
                <button
                  onClick={handleCloseCreateModal}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateUser} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Họ tên</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                    Email công ty <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="nhanvien@company.com"
                    className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                      Vai trò <span className="text-danger-500">*</span>
                    </label>
                    <select
                      required
                      value={createForm.role}
                      onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}
                      className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-md bg-white focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
                    >
                      <option value="employee">Nhân viên</option>
                      <option value="hr">HR</option>
                      <option value="manager">Quản lý</option>
                      <option value="accountant">Kế toán</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Phòng ban</label>
                    <select
                      value={createForm.department_id}
                      onChange={e => setCreateForm(p => ({ ...p, department_id: e.target.value }))}
                      className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded-md bg-white focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
                    >
                      <option value="">-- Chưa xếp --</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCloseCreateModal}
                    disabled={creating}
                    className="flex-1 h-10 border border-gray-300 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-60 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !createForm.email}
                    className="flex-1 h-10 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang tạo...
                      </span>
                    ) : 'Tạo tài khoản'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default AdminUsers;
