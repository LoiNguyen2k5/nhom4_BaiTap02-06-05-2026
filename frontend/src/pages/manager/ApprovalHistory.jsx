import React, { useState, useEffect, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, Search, Calendar, User, ArrowLeft, Inbox, ChevronRight } from 'lucide-react';
import LeaveService from '../../services/leave.service';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const TYPE_CONFIG = {
  leave: { label: 'Nghỉ phép', variant: 'brand' },
  ot:    { label: 'Làm OT',    variant: 'info' },
  other: { label: 'Khác',      variant: 'neutral' },
};

const STATUS_CONFIG = {
  approved: { label: 'Đã duyệt', variant: 'success', icon: CheckCircle },
  rejected: { label: 'Từ chối', variant: 'danger', icon: XCircle },
};

const TABS = [
  { key: '',      label: 'Tất cả' },
  { key: 'leave', label: 'Nghỉ phép' },
  { key: 'ot',    label: 'OT' },
];

const fmt = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const ApprovalHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await LeaveService.getApprovalHistory();
      const data = res.data?.data || [];
      setRequests(data);
      if (data.length > 0) setSelected(data[0]);
    } catch (err) {
      console.error(err);
      setRequests([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchTab = !activeTab || r.type === activeTab;
      
      const q = searchQuery.toLowerCase().trim();
      const displayName = r.requester?.Profile?.full_name || r.requester?.name || r.requester?.email || '';
      const matchSearch = !q || 
        displayName.toLowerCase().includes(q) ||
        r.requester?.email?.toLowerCase().includes(q) ||
        (r.reason || '').toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [requests, activeTab, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Lịch sử phê duyệt</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Xem danh sách các đơn nghỉ phép, làm OT đã xử lý
          </p>
        </div>
      </div>

      {/* 2-col master-detail */}
      <div className="flex gap-4 items-start">
        {/* Left: list */}
        <div className="w-96 shrink-0 flex flex-col gap-3">
          {/* Search & Tabs Box */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm nhân viên, lý do..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:border-navy-700 transition-colors"
              />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 pb-1">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-md mr-1 transition-colors
                    ${activeTab === tab.key
                      ? 'bg-navy-700 text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {loading ? (
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-2.5 w-32 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center px-4">
                <Inbox size={32} strokeWidth={1.5} className="text-gray-300 mb-3" />
                <p className="text-[13px] font-medium text-gray-500">Không tìm thấy đơn nào</p>
                <p className="text-[11px] text-gray-400 mt-1">Vui lòng thử bộ lọc hoặc từ khoá khác.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-150 overflow-y-auto">
                {filtered.map(req => {
                  const typeCfg = TYPE_CONFIG[req.type] || TYPE_CONFIG.other;
                  const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.approved;
                  const isSelected = selected?.id === req.id;
                  const requesterName = req.requester?.Profile?.full_name || req.requester?.name || req.requester?.email || '—';
                  
                  return (
                    <button
                      key={req.id}
                      onClick={() => setSelected(req)}
                      className={`w-full text-left flex items-start gap-3 p-4 transition-colors border-l-[3px]
                        ${isSelected
                          ? 'bg-navy-50 border-l-navy-700'
                          : 'bg-white border-l-transparent hover:bg-gray-50'
                        }`}
                    >
                      <Avatar name={requesterName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-medium text-gray-900 truncate">
                            {requesterName}
                          </p>
                          <ChevronRight size={14} strokeWidth={2} className={`shrink-0 transition-colors ${isSelected ? 'text-navy-700' : 'text-gray-300'}`} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge variant={typeCfg.variant} size="sm">{typeCfg.label}</Badge>
                          <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-mono">
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

        {/* Right: detail */}
        {selected ? (
          <div className="flex-1 min-w-0 space-y-4">
            {/* Header of detail */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono tabular-nums text-[11px] text-gray-400 mb-1">REQ-{String(selected.id).padStart(4,'0')}</p>
                  <h2 className="text-[17px] font-semibold text-gray-900">
                    {TYPE_CONFIG[selected.type]?.label || 'Đơn từ'} · {selected.requester?.Profile?.full_name || selected.requester?.name || '—'}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={TYPE_CONFIG[selected.type]?.variant || 'neutral'}>
                      {TYPE_CONFIG[selected.type]?.label || selected.type}
                    </Badge>
                    <Badge variant={STATUS_CONFIG[selected.status]?.variant || 'neutral'}>
                      {STATUS_CONFIG[selected.status]?.label || selected.status}
                    </Badge>
                  </div>
                </div>
                <span className="text-[12px] text-gray-400 shrink-0">{fmtDate(selected.created_at)}</span>
              </div>
            </div>

            {/* Employee card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-3">Nhân viên gửi đơn</h3>
              <div className="flex items-center gap-3">
                <Avatar name={selected.requester?.Profile?.full_name || selected.requester?.name || 'U'} size="md" />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-900">{selected.requester?.Profile?.full_name || selected.requester?.name || '—'}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{selected.requester?.email}</p>
                </div>
              </div>
            </div>

            {/* Chi tiết đơn */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-3">Chi tiết đơn</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">Từ ngày</span>
                  <span className="font-mono tabular-nums text-[13px] font-medium text-gray-800">{fmt(selected.start_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">Đến ngày</span>
                  <span className="font-mono tabular-nums text-[13px] font-medium text-gray-800">{fmt(selected.end_date)}</span>
                </div>
                {selected.type === 'leave' && selected.total_days && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Số ngày nghỉ</span>
                    <span className="font-mono tabular-nums text-[13px] font-bold text-gray-900">{selected.total_days} ngày</span>
                  </div>
                )}
                {selected.type === 'ot' && selected.ot_hours && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Số giờ OT</span>
                    <span className="font-mono tabular-nums text-[13px] font-bold text-gray-900">{selected.ot_hours} giờ</span>
                  </div>
                )}
                {selected.reason && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[12px] text-gray-500 mb-1">Lý do nghỉ / làm OT</p>
                    <p className="text-[13px] text-gray-800 leading-relaxed">{selected.reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin phê duyệt */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-3">Thông tin phê duyệt</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">Người duyệt</span>
                  <span className="text-[13px] font-medium text-gray-800">{selected.approver?.name || selected.approver?.email || 'Hệ thống'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">Thời gian duyệt</span>
                  <span className="font-mono tabular-nums text-[13px] text-gray-800">{fmtDate(selected.approved_at)}</span>
                </div>
                {selected.status === 'rejected' && selected.reject_reason && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[12px] text-gray-500 mb-1">Lý do từ chối</p>
                    <p className="text-[13px] text-danger-700 font-medium leading-relaxed bg-danger-50 p-3 rounded-md border border-danger-100">
                      {selected.reject_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center py-20 text-center">
            <Inbox size={36} strokeWidth={1.25} className="text-gray-300 mb-3" />
            <p className="text-[14px] font-medium text-gray-500">Không có đơn nào đã xử lý</p>
            <p className="text-[12px] text-gray-400 mt-1">Lịch sử trống</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalHistory;
