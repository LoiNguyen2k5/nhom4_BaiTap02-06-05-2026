import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle, XCircle, Clock, Search, Filter,
  Calendar, ChevronDown, Inbox, RefreshCw,
  FileText, User as UserIcon, AlertCircle
} from 'lucide-react';
import LeaveService from '../../services/leave.service';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

// ─── Config ──────────────────────────────────────────────────
const TYPE_CONFIG = {
  leave: { label: 'Nghỉ phép', variant: 'brand' },
  ot:    { label: 'Làm OT',    variant: 'info' },
  other: { label: 'Khác',      variant: 'neutral' },
};

const STATUS_CONFIG = {
  approved: { label: 'Đã duyệt', variant: 'success', icon: CheckCircle },
  rejected: { label: 'Từ chối',  variant: 'danger',  icon: XCircle },
};

const STATUS_TABS = [
  { key: '',         label: 'Tất cả'   },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'rejected', label: 'Từ chối'  },
];

const TYPE_OPTIONS = [
  { value: '',      label: 'Tất cả loại' },
  { value: 'leave', label: 'Nghỉ phép'   },
  { value: 'ot',    label: 'Làm OT'      },
  { value: 'other', label: 'Khác'        },
];

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtFull = (d) =>
  d
    ? new Date(d).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';

// ─── Component ────────────────────────────────────────────────
const ApprovalHistory = () => {
  const [history, setHistory]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [typeFilter, setTypeFilter]   = useState('');
  const [fromDate, setFromDate]       = useState('');
  const [toDate, setToDate]           = useState('');
  const [selected, setSelected]       = useState(null);

  // Fetch dữ liệu
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (activeStatus) params.status = activeStatus;
      if (typeFilter)   params.type   = typeFilter;
      if (fromDate)     params.from   = fromDate;
      if (toDate)       params.to     = toDate;
      const res = await LeaveService.getApprovalHistory(params);
      const data = res.data.data || [];
      setHistory(data);
      setSelected(data.length > 0 ? data[0] : null);
    } catch {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      setHistory([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [activeStatus, typeFilter, fromDate, toDate]);

  // Lọc theo search (tên / email)
  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter(r => {
      const name  = (r.requester?.name  || '').toLowerCase();
      const email = (r.requester?.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [history, search]);

  // Thống kê nhanh
  const stats = useMemo(() => ({
    total:    history.length,
    approved: history.filter(r => r.status === 'approved').length,
    rejected: history.filter(r => r.status === 'rejected').length,
  }), [history]);

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">
            Lịch sử phê duyệt
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tất cả đơn đã được xử lý (duyệt hoặc từ chối) bởi quản lý
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="flex items-center gap-1.5 h-8 px-3 border border-gray-200 bg-white text-gray-600 rounded-md text-[12px] font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={13} strokeWidth={2} className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tổng đơn đã xử lý', value: stats.total,    icon: FileText,    color: 'text-navy-700',    bg: 'bg-navy-50',    border: 'border-navy-100' },
          { label: 'Đã duyệt',          value: stats.approved,  icon: CheckCircle, color: 'text-success-700', bg: 'bg-success-50', border: 'border-success-100' },
          { label: 'Từ chối',           value: stats.rejected,  icon: XCircle,     color: 'text-danger-700',  bg: 'bg-danger-50',  border: 'border-danger-100' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 p-4 rounded-lg border ${border} ${bg}`}>
            <div className={`w-9 h-9 rounded-md flex items-center justify-center ${bg} border ${border}`}>
              <Icon size={18} strokeWidth={2} className={color} />
            </div>
            <div>
              <p className={`text-[22px] font-bold tabular-nums ${color}`}>{value}</p>
              <p className="text-[11px] text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters row ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} strokeWidth={2} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên hoặc email..."
            className="w-full pl-8 pr-3 h-8 text-[13px] border border-gray-200 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
          />
        </div>

        {/* Type filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="appearance-none h-8 pl-3 pr-7 text-[12px] border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 transition-colors cursor-pointer"
          >
            {TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <Calendar size={13} strokeWidth={2} className="text-gray-400 shrink-0" />
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="h-8 px-2 text-[12px] border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 transition-colors"
          />
          <span className="text-[12px] text-gray-400">—</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="h-8 px-2 text-[12px] border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-navy-700 transition-colors"
          />
          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(''); setToDate(''); }}
              className="text-[11px] text-gray-400 hover:text-gray-600 underline"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* ── Status tabs + count ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-0">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              activeStatus === tab.key
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.key === '' && history.length > 0 && (
              <span className="ml-1.5 font-mono tabular-nums text-[11px] text-gray-400">({history.length})</span>
            )}
            {tab.key === 'approved' && stats.approved > 0 && (
              <span className="ml-1.5 font-mono tabular-nums text-[11px] text-success-600">({stats.approved})</span>
            )}
            {tab.key === 'rejected' && stats.rejected > 0 && (
              <span className="ml-1.5 font-mono tabular-nums text-[11px] text-danger-600">({stats.rejected})</span>
            )}
          </button>
        ))}
        {!loading && (
          <span className="ml-auto text-[11px] text-gray-400 pb-2">
            Hiển thị {filtered.length}/{history.length} kết quả
          </span>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-[13px]">
          <AlertCircle size={15} strokeWidth={2} />
          {error}
        </div>
      )}

      {/* ── Master-detail layout ── */}
      <div className="flex gap-4 items-start">

        {/* Left: list */}
        <div className="w-90 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {loading ? (
              <div className="divide-y divide-gray-100">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-28 bg-gray-200 rounded" />
                      <div className="h-2.5 w-36 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center px-4">
                <Inbox size={32} strokeWidth={1.5} className="text-gray-300 mb-3" />
                <p className="text-[13px] font-medium text-gray-500">Không có dữ liệu</p>
                <p className="text-[12px] text-gray-400 mt-1">
                  {search ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có đơn nào được xử lý'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
                {filtered.map(req => {
                  const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.approved;
                  const typeCfg   = TYPE_CONFIG[req.type]     || TYPE_CONFIG.other;
                  const isSelected = selected?.id === req.id;
                  const StatusIcon = statusCfg.icon;
                  return (
                    <button
                      key={req.id}
                      onClick={() => setSelected(req)}
                      className={`w-full text-left flex items-start gap-3 p-4 transition-colors border-l-[3px] ${
                        isSelected
                          ? 'bg-navy-50 border-l-navy-700'
                          : 'bg-white border-l-transparent hover:bg-gray-50'
                      }`}
                    >
                      <Avatar name={req.requester?.name || 'U'} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-medium text-gray-900 truncate">
                            {req.requester?.name || req.requester?.email || '—'}
                          </p>
                          <StatusIcon
                            size={14}
                            strokeWidth={2}
                            className={req.status === 'approved' ? 'text-success-500 shrink-0' : 'text-danger-500 shrink-0'}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge variant={typeCfg.variant} size="sm">{typeCfg.label}</Badge>
                          <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 tabular-nums">
                          {fmt(req.start_date)} – {fmt(req.end_date)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: detail panel */}
        {selected ? (
          <div className="flex-1 min-w-0 space-y-4">

            {/* Detail header */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono tabular-nums text-[11px] text-gray-400 mb-1">
                    REQ-{String(selected.id).padStart(4, '0')}
                  </p>
                  <h2 className="text-[17px] font-semibold text-gray-900">
                    {TYPE_CONFIG[selected.type]?.label || 'Đơn từ'} · {selected.requester?.name || '—'}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={TYPE_CONFIG[selected.type]?.variant || 'neutral'}>
                      {TYPE_CONFIG[selected.type]?.label || selected.type}
                    </Badge>
                    <Badge variant={STATUS_CONFIG[selected.status]?.variant || 'neutral'} dot>
                      {STATUS_CONFIG[selected.status]?.label || selected.status}
                    </Badge>
                  </div>
                </div>
                <span className="text-[12px] text-gray-400 shrink-0 tabular-nums">
                  Nộp: {fmtFull(selected.created_at)}
                </span>
              </div>
            </div>

            {/* Employee card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-3">
                <UserIcon size={11} strokeWidth={2.5} className="inline mr-1" />
                Nhân viên
              </h3>
              <div className="flex items-center gap-3">
                <Avatar name={selected.requester?.name || 'U'} size="md" />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-900">
                    {selected.requester?.name || '—'}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{selected.requester?.email}</p>
                </div>
              </div>
            </div>

            {/* Thời gian / chi tiết */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-3">Chi tiết đơn</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">Từ ngày</span>
                  <span className="font-mono tabular-nums text-[13px] font-medium text-gray-800">
                    {fmt(selected.start_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">Đến ngày</span>
                  <span className="font-mono tabular-nums text-[13px] font-medium text-gray-800">
                    {fmt(selected.end_date)}
                  </span>
                </div>
                {selected.type === 'leave' && selected.total_days > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Số ngày nghỉ</span>
                    <span className="font-mono tabular-nums text-[13px] font-bold text-gray-900">
                      {selected.total_days} ngày
                    </span>
                  </div>
                )}
                {selected.type === 'ot' && selected.ot_hours && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Số giờ OT</span>
                    <span className="font-mono tabular-nums text-[13px] font-bold text-gray-900">
                      {selected.ot_hours} giờ
                    </span>
                  </div>
                )}
                {selected.reason && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[12px] text-gray-500 mb-1">Lý do xin</p>
                    <p className="text-[13px] text-gray-800 leading-relaxed">{selected.reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Kết quả phê duyệt */}
            <div className={`border rounded-lg p-5 ${
              selected.status === 'approved'
                ? 'bg-success-50 border-success-200'
                : 'bg-danger-50 border-danger-200'
            }`}>
              <h3 className={`text-[11px] font-semibold uppercase tracking-[.06em] mb-3 ${
                selected.status === 'approved' ? 'text-success-700' : 'text-danger-700'
              }`}>
                {selected.status === 'approved' ? '✅ Đã phê duyệt' : '❌ Đã từ chối'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-600">Thời gian xử lý</span>
                  <span className="font-mono tabular-nums text-[12px] font-medium text-gray-800">
                    {fmtFull(selected.approved_at)}
                  </span>
                </div>
                {selected.status === 'rejected' && selected.reject_reason && (
                  <div className="pt-2 border-t border-danger-200">
                    <p className="text-[12px] text-danger-700 mb-1 font-medium">Lý do từ chối</p>
                    <p className="text-[13px] text-danger-800 leading-relaxed">{selected.reject_reason}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          !loading && (
            <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center py-20 text-center">
              <Clock size={36} strokeWidth={1.25} className="text-gray-300 mb-3" />
              <p className="text-[14px] font-medium text-gray-500">Chọn một đơn để xem chi tiết</p>
              <p className="text-[12px] text-gray-400 mt-1">Click vào một mục trong danh sách bên trái</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ApprovalHistory;
