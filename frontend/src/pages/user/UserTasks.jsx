import { useEffect, useMemo, useState } from 'react';
import { Search, AlertCircle, Clock } from 'lucide-react';
import { taskService } from '../../services/task.service';
import Badge from '../../components/ui/Badge';

const COLUMNS = [
  { key: 'todo',        label: 'CẦN LÀM',    headCls: 'bg-gray-100 text-gray-600',      dotCls: 'bg-gray-400' },
  { key: 'in_progress', label: 'ĐANG LÀM',   headCls: 'bg-navy-50 text-navy-700',        dotCls: 'bg-navy-700' },
  { key: 'review',      label: 'CHỜ DUYỆT',  headCls: 'bg-warning-50 text-warning-700', dotCls: 'bg-warning-600' },
  { key: 'done',        label: 'HOÀN THÀNH', headCls: 'bg-success-50 text-success-700', dotCls: 'bg-success-600' },
];

const PRIORITY_VARIANT = {
  critical: 'danger',
  high:     'warning',
  medium:   'brand',
  low:      'neutral',
};

const PRIORITY_LABEL = {
  critical: 'Khẩn cấp',
  high:     'Cao',
  medium:   'Trung bình',
  low:      'Thấp',
};

function isOverdue(task) {
  if (!task.due_date || task.status === 'done' || task.status === 'cancelled') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.due_date);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86_400_000);
}

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [draftStatus, setDraftStatus] = useState({});

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await taskService.getMyTasks();
      if (res.success) {
        const data = res.data || [];
        setTasks(data);
        const drafts = {};
        data.forEach((task) => { drafts[task.id] = task.status; });
        setDraftStatus(drafts);
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleStatusUpdate = async (taskId) => {
    const status = draftStatus[taskId];
    try {
      const res = await taskService.updateTaskStatus(taskId, status);
      if (res.success) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không cập nhật được trạng thái task.');
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tasks;
    return tasks.filter(t =>
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const byColumn = useMemo(() => {
    const map = {};
    COLUMNS.forEach(c => { map[c.key] = []; });
    filtered.forEach(t => {
      if (map[t.status]) map[t.status].push(t);
      else if (map.todo) map.todo.push(t); // fallback
    });
    return map;
  }, [filtered]);

  const overdueCount = useMemo(() => tasks.filter(isOverdue).length, [tasks]);
  const doneCount    = useMemo(() => tasks.filter(t => t.status === 'done').length, [tasks]);
  const activeCount  = useMemo(() => tasks.filter(t => ['todo','in_progress','review'].includes(t.status)).length, [tasks]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Task của tôi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Xem các task được giao và cập nhật tiến độ thực hiện</p>
        </div>
        {overdueCount > 0 && (
          <div className="flex items-center gap-1.5 h-8 px-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-md text-[12px] font-medium">
            <AlertCircle size={13} strokeWidth={2} />
            {overdueCount} task trễ deadline
          </div>
        )}
      </div>

      {/* KPI mini cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Tổng task',     value: tasks.length,  mono: true },
          { label: 'Đang thực hiện', value: activeCount,  mono: true },
          { label: 'Trễ deadline',   value: overdueCount, mono: true, danger: overdueCount > 0 },
          { label: 'Hoàn thành',     value: doneCount,    mono: true, success: doneCount > 0 },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-2">{k.label}</p>
            <p className={`font-mono tabular-nums text-[28px] font-bold leading-none tracking-[-0.02em]
              ${k.danger ? 'text-danger-600' : k.success ? 'text-success-600' : 'text-gray-900'}`}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-72">
          <Search size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm task..."
            className="w-full h-9 pl-9 pr-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          />
        </div>
        <span className="text-[12px] text-gray-400">
          {filtered.length} / {tasks.length} task
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="border-l-[3px] border-danger-500 bg-danger-50 rounded-md px-4 py-3 text-[13px] text-danger-700">
          {error}
        </div>
      )}

      {/* Kanban board */}
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <div key={col.key} className="space-y-3">
              <div className={`h-9 rounded-md px-4 flex items-center ${col.headCls} animate-pulse`} />
              {[1,2].map(i => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 items-start">
          {COLUMNS.map(col => {
            const colTasks = byColumn[col.key] || [];
            return (
              <div key={col.key} className="space-y-2">
                {/* Column header */}
                <div className={`h-9 rounded-md px-3 flex items-center justify-between ${col.headCls}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotCls}`} />
                    <span className="text-[11px] font-semibold tracking-wider">{col.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[11px] font-semibold opacity-70">{colTasks.length}</span>
                </div>

                {/* Cards */}
                {colTasks.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 text-center text-[12px] text-gray-400">
                    Trống
                  </div>
                ) : (
                  colTasks.map(task => {
                    const overdue = isOverdue(task);
                    const days = daysLeft(task.due_date);
                    const prioVariant = PRIORITY_VARIANT[task.priority] || 'neutral';
                    const prioLabel = PRIORITY_LABEL[task.priority] || task.priority;

                    return (
                      <div
                        key={task.id}
                        className={`bg-white border rounded-lg p-4 space-y-3 hover:shadow-sm transition-shadow
                          ${overdue ? 'border-danger-200 bg-danger-50/40' : 'border-gray-200'}`}
                      >
                        {/* Top badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {task.project_name && (
                            <Badge variant="brand" size="sm">{task.project_name}</Badge>
                          )}
                          <Badge variant={prioVariant} size="sm">{prioLabel}</Badge>
                          {overdue && (
                            <Badge variant="danger" size="sm" dot>Trễ</Badge>
                          )}
                        </div>

                        {/* Title */}
                        <div>
                          <p className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">{task.title}</p>
                          {task.id && (
                            <p className="font-mono tabular-nums text-[11px] text-gray-400 mt-0.5">#{task.id}</p>
                          )}
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">{task.description}</p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          {task.due_date ? (
                            <span className={`flex items-center gap-1 text-[11px] font-mono tabular-nums
                              ${overdue ? 'text-danger-600 font-semibold' : days !== null && days <= 3 ? 'text-warning-600' : 'text-gray-400'}`}>
                              <Clock size={11} strokeWidth={2} />
                              {days === null ? '—'
                                : overdue ? `Trễ ${Math.abs(days)} ngày`
                                : days === 0 ? 'Hôm nay'
                                : `${days} ngày`}
                            </span>
                          ) : <span />}

                          {/* Quick status update */}
                          <select
                            value={draftStatus[task.id] || task.status}
                            onChange={e => {
                              const val = e.target.value;
                              setDraftStatus(p => ({ ...p, [task.id]: val }));
                              taskService.updateTaskStatus(task.id, val)
                                .then(res => { if (res.success) setTasks(prev => prev.map(t => t.id === task.id ? res.data : t)); })
                                .catch(() => {});
                            }}
                            className="h-6 pl-2 pr-5 text-[11px] border border-gray-200 rounded bg-white text-gray-600 focus:outline-none focus:border-navy-700 transition-colors cursor-pointer"
                          >
                            <option value="todo">Cần làm</option>
                            <option value="in_progress">Đang làm</option>
                            <option value="review">Chờ duyệt</option>
                            <option value="done">Hoàn thành</option>
                            <option value="cancelled">Huỷ</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserTasks;
