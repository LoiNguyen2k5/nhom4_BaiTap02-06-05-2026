import { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const searchRef = useRef(search);
  useEffect(() => { searchRef.current = search; }, [search]);

  const fetchLogs = async (currentSearch, page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        search: currentSearch || undefined,
        page,
        limit: 20,
      };
      const data = await adminService.getActivityLogs(params);
      if (data.success) {
        setLogs(data.data);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải nhật ký.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs('', 1);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs(searchRef.current, 1);
  };

  const handleReset = () => {
    setSearch('');
    fetchLogs('', 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchLogs(searchRef.current, newPage);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Nhật ký hệ thống</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total > 0 ? (
              <><span className="font-mono tabular-nums font-medium text-gray-700">{pagination.total}</span> hành động được ghi lại</>
            ) : 'Xem toàn bộ lịch sử thao tác của người dùng trên hệ thống'}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <form onSubmit={handleSearchSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo hành động hoặc chi tiết..."
              className="w-full h-9 pl-9 pr-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-9 px-4 text-[13px] font-medium bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white rounded-md transition-colors"
          >
            Tìm
          </button>
          
          {search && (
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
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Thời gian', 'Người thực hiện', 'Hành động', 'Chi tiết'].map((col) => (
                  <th key={col} className="h-10 px-4 text-[11px] font-semibold uppercase tracking-[.04em] text-gray-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="px-4 py-3"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-3 w-28 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-64 bg-gray-200 rounded" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-[13px] text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <List size={32} strokeWidth={1} className="mb-2 text-gray-300" />
                      Không có nhật ký nào phù hợp.
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono tabular-nums text-[12px] text-gray-500 whitespace-nowrap">
                        {formatDateTime(log.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {log.User ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={log.User.name || 'U'} size="xs" />
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 leading-tight">{log.User.name || log.User.email}</p>
                            <p className="text-[11px] text-gray-400">{log.User.role}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[13px] text-gray-400 italic">Hệ thống / Đã xóa</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral" size="sm">{log.action}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-gray-700 leading-relaxed">{log.detail || '—'}</span>
                    </td>
                  </tr>
                ))
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
              / <span className="font-mono tabular-nums font-medium text-gray-700">{pagination.total}</span> bản ghi
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
  );
};

export default ActivityLogs;
