import { useEffect, useMemo, useState } from 'react';
import { taskService } from '../../services/task.service';

const STATUS_META = {
  todo: { label: 'Cần làm', cls: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'Đang làm', cls: 'bg-blue-100 text-blue-700' },
  review: { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-700' },
  done: { label: 'Hoàn thành', cls: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Huỷ', cls: 'bg-rose-100 text-rose-700' },
};

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [draftStatus, setDraftStatus] = useState({});

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await taskService.getMyTasks();
      if (res.success) {
        setTasks(res.data || []);
        const drafts = {};
        (res.data || []).forEach((task) => {
          drafts[task.id] = task.status;
        });
        setDraftStatus(drafts);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được task của bạn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const visibleTasks = useMemo(() => {
    return filterStatus ? tasks.filter((task) => task.status === filterStatus) : tasks;
  }, [tasks, filterStatus]);

  const handleStatusUpdate = async (taskId) => {
    const status = draftStatus[taskId];
    try {
      const res = await taskService.updateTaskStatus(taskId, status);
      if (res.success) {
        setTasks((prev) => prev.map((task) => (task.id === taskId ? res.data : task)));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không cập nhật được trạng thái task.');
    }
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((task) => ['todo', 'in_progress', 'review'].includes(task.status)).length,
    done: tasks.filter((task) => task.status === 'done').length,
  }), [tasks]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">Việc của tôi</h1>
        <p className="text-gray-500 text-sm mt-1">Xem các task được giao và cập nhật tiến độ thực hiện</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Tổng task</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Đang làm</p>
          <p className="mt-2 text-3xl font-black text-indigo-600">{stats.active}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Hoàn thành</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">{stats.done}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'todo', 'in_progress', 'review', 'done', 'cancelled'].map((status) => (
          <button
            key={status || 'all'}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              filterStatus === status ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === '' ? 'Tất cả' : STATUS_META[status].label}
          </button>
        ))}
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500">Đang tải...</div>
      ) : visibleTasks.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500">Chưa có task nào được giao.</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleTasks.map((task) => (
            <div key={task.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{task.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{task.description || 'Không có mô tả'}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_META[task.status]?.cls || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_META[task.status]?.label || task.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-gray-600">
                <div>
                  <p className="text-gray-400">Ưu tiên</p>
                  <p className="font-medium">{task.priority}</p>
                </div>
                <div>
                  <p className="text-gray-400">Hạn hoàn thành</p>
                  <p className="font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Người giao</p>
                  <p className="font-medium">{task.assigner?.name || task.assigner?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Cập nhật</p>
                  <p className="font-medium">{task.updated_at ? new Date(task.updated_at).toLocaleDateString('vi-VN') : '—'}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <select
                  value={draftStatus[task.id] || task.status}
                  onChange={(e) => setDraftStatus((prev) => ({ ...prev, [task.id]: e.target.value }))}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="todo">Cần làm</option>
                  <option value="in_progress">Đang làm</option>
                  <option value="review">Chờ duyệt</option>
                  <option value="done">Hoàn thành</option>
                  <option value="cancelled">Huỷ</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(task.id)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTasks;
