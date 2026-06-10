import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { taskService } from '../../services/task.service';

const STATUS_META = {
  todo: { label: 'Cần làm', cls: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'Đang làm', cls: 'bg-blue-100 text-blue-700' },
  review: { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-700' },
  done: { label: 'Hoàn thành', cls: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Huỷ', cls: 'bg-rose-100 text-rose-700' },
};

const PRIORITY_META = {
  low: { label: 'Thấp', cls: 'bg-slate-100 text-slate-700' },
  medium: { label: 'Vừa', cls: 'bg-indigo-100 text-indigo-700' },
  high: { label: 'Cao', cls: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Khẩn', cls: 'bg-red-100 text-red-700' },
};

const EMPTY_FORM = {
  title: '',
  description: '',
  assigned_to_id: '',
  priority: 'medium',
  due_date: '',
  status: 'todo',
};

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState({ search: '', status: '', priority: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const assigneeOptions = useMemo(() => users.filter((user) => user.role !== 'admin'), [users]);

  const loadUsers = async () => {
    const res = await adminService.getUsers({ limit: 100, status: 'active' });
    if (res.success) setUsers(res.data || []);
  };

  const loadTasks = async (filters = query) => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
      const res = await taskService.getAllTasks(params);
      if (res.success) setTasks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateForm = () => {
    setEditingTask(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title || '',
      description: task.description || '',
      assigned_to_id: task.assigned_to_id || '',
      priority: task.priority || 'medium',
      due_date: task.due_date || '',
      status: task.status || 'todo',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        assigned_to_id: Number(form.assigned_to_id),
        due_date: form.due_date || null,
      };

      const res = editingTask
        ? await taskService.updateTask(editingTask.id, payload)
        : await taskService.createTask(payload);

      if (res.success) {
        await loadTasks();
        closeForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không lưu được task.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Xoá task "${task.title}"?`)) return;
    try {
      const res = await taskService.deleteTask(task.id);
      if (res.success) {
        setTasks((prev) => prev.filter((item) => item.id !== task.id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không xoá được task.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadTasks(query);
  };

  const handleReset = () => {
    const reset = { search: '', status: '', priority: '' };
    setQuery(reset);
    loadTasks(reset);
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter((task) => task.status === 'done').length,
    active: tasks.filter((task) => ['todo', 'in_progress', 'review'].includes(task.status)).length,
  }), [tasks]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Giao việc cho nhân viên</h1>
          <p className="text-gray-500 text-sm mt-1">Tạo task, gán nhân viên phụ trách và theo dõi trạng thái thực hiện</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-xl transition-colors shadow-sm"
        >
          + Tạo task
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Tổng task</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Đang xử lý</p>
          <p className="mt-2 text-3xl font-black text-indigo-600">{stats.active}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Hoàn thành</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">{stats.done}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="search"
            value={query.search}
            onChange={handleFilterChange}
            placeholder="Tìm theo tiêu đề hoặc mô tả..."
            className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          <select
            name="status"
            value={query.status}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="todo">Cần làm</option>
            <option value="in_progress">Đang làm</option>
            <option value="review">Chờ duyệt</option>
            <option value="done">Hoàn thành</option>
            <option value="cancelled">Huỷ</option>
          </select>
          <select
            name="priority"
            value={query.priority}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả ưu tiên</option>
            <option value="low">Thấp</option>
            <option value="medium">Vừa</option>
            <option value="high">Cao</option>
            <option value="urgent">Khẩn</option>
          </select>
          <div className="md:col-span-4 flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700">
              Lọc
            </button>
            <button type="button" onClick={handleReset} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50">
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {error && <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 text-sm">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ưu tiên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Chưa có task nào.</td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2 max-w-xl">{task.description || 'Không có mô tả'}</div>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-gray-700">
                      <div className="font-medium">{task.assignee?.name || '—'}</div>
                      <div className="text-gray-400">{task.assignee?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PRIORITY_META[task.priority]?.cls || 'bg-gray-100 text-gray-700'}`}>
                        {PRIORITY_META[task.priority]?.label || task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_META[task.status]?.cls || 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_META[task.status]?.label || task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-gray-600">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex gap-2">
                        <button onClick={() => openEditForm(task)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Sửa</button>
                        <button onClick={() => handleDelete(task)} className="text-sm font-medium text-rose-600 hover:text-rose-800">Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editingTask ? 'Chỉnh sửa task' : 'Tạo task mới'}</h2>
              <p className="text-sm text-gray-400 mt-1">Giao việc cho nhân viên và theo dõi tiến độ</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ví dụ: Báo cáo công việc tuần"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Mô tả ngắn gọn nội dung cần làm"
                />
              </div>
              <div className={`grid grid-cols-1 ${editingTask ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên</label>
                  <select
                    value={form.assigned_to_id}
                    onChange={(e) => setForm((prev) => ({ ...prev, assigned_to_id: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  >
                    <option value="">Chọn nhân viên</option>
                    {assigneeOptions.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ưu tiên</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Vừa</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạn hoàn thành</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm((prev) => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                {editingTask && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="todo">Cần làm</option>
                      <option value="in_progress">Đang làm</option>
                      <option value="review">Chờ duyệt</option>
                      <option value="done">Hoàn thành</option>
                      <option value="cancelled">Huỷ</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium disabled:opacity-60">
                  {saving ? 'Đang lưu...' : editingTask ? 'Cập nhật' : 'Tạo task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
