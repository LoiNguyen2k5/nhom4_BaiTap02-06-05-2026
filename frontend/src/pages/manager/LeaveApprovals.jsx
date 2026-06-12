import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Inbox, Clock, Calendar, ChevronRight } from 'lucide-react';
import LeaveService from '../../services/leave.service';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

const TYPE_CONFIG = {
  leave: { label: 'Nghỉ phép', variant: 'brand' },
  ot:    { label: 'Làm OT',    variant: 'info' },
  other: { label: 'Khác',      variant: 'neutral' },
};

const TABS = [
  { key: '',      label: 'Tất cả' },
  { key: 'leave', label: 'Nghỉ phép' },
  { key: 'ot',    label: 'OT' },
];

const fmt = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const LeaveApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [selected, setSelected] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchPendingRequests(); }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await LeaveService.getPendingRequests();
      const data = res.data.data || [];
      setRequests(data);
      if (data.length > 0) setSelected(data[0]);
    } catch {
      setRequests([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Xác nhận duyệt đơn này?')) return;
    try {
      setActionLoading(true);
      await LeaveService.approveOrRejectRequest(id, 'approved');
      setSelected(null);
      fetchPendingRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      setActionLoading(true);
      await LeaveService.approveOrRejectRequest(selected.id, 'rejected', rejectNote);
      setSelected(null);
      setRejectNote('');
      fetchPendingRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = activeTab ? requests.filter(r => r.type === activeTab) : requests;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Duyệt đơn từ</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="font-mono tabular-nums font-medium text-gray-700">{requests.length}</span> đơn đang chờ duyệt
          </p>
        </div>
        {requests.length > 0 && (
          <div className="flex items-center gap-1.5 h-8 px-3 bg-warning-50 border border-warning-200 text-warning-700 rounded-md text-[12px] font-medium">
            <Clock size={13} strokeWidth={2} />
            {requests.length} đơn chờ xử lý
          </div>
        )}
      </div>

      {/* 2-col master-detail */}
      <div className="flex gap-4 items-start">
        {/* Left: list */}
        <div className="w-90 shrink-0">
          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-0">
            <div className="flex border-b border-gray-200 px-3 pt-3">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-t-md mr-1 transition-colors
                    ${activeTab === tab.key
                      ? 'bg-navy-700 text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                  {tab.key === '' && requests.length > 0 && (
                    <span className="ml-1.5 font-mono tabular-nums text-[10px]">({requests.length})</span>
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="divide-y divide-gray-100">
                {[1,2,3].map(i => (
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
              <div className="py-10 flex flex-col items-center text-center px-4">
                <Inbox size={32} strokeWidth={1.5} className="text-gray-300 mb-3" />
                <p className="text-[13px] font-medium text-gray-500">Không có đơn nào</p>
                <p className="text-[12px] text-gray-400 mt-1">Tất cả đơn đã được xử lý!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-150 overflow-y-auto">
                {filtered.map(req => {
                  const typeCfg = TYPE_CONFIG[req.type] || TYPE_CONFIG.other;
                  const isSelected = selected?.id === req.id;
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
                      <Avatar name={req.requester?.name || 'U'} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-medium text-gray-900 truncate">
                            {req.requester?.name || req.requester?.email || '—'}
                          </p>
                          <ChevronRight size={14} strokeWidth={2} className={`shrink-0 transition-colors ${isSelected ? 'text-navy-700' : 'text-gray-300'}`} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant={typeCfg.variant} size="sm">{typeCfg.label}</Badge>
                          {req.type === 'leave' && req.total_days && (
                            <span className="text-[11px] text-gray-400">{req.total_days} ngày</span>
                          )}
                          {req.type === 'ot' && req.ot_hours && (
                            <span className="text-[11px] text-gray-400">{req.ot_hours} giờ</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
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
                    {TYPE_CONFIG[selected.type]?.label || 'Đơn từ'} · {selected.requester?.name || '—'}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={TYPE_CONFIG[selected.type]?.variant || 'neutral'}>
                      {TYPE_CONFIG[selected.type]?.label || selected.type}
                    </Badge>
                    <Badge variant="warning" dot>Chờ duyệt</Badge>
                  </div>
                </div>
                <span className="text-[12px] text-gray-400 shrink-0">{fmtDate(selected.created_at)}</span>
              </div>
            </div>

            {/* Employee card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-3">Nhân viên</h3>
              <div className="flex items-center gap-3">
                <Avatar name={selected.requester?.name || 'U'} size="md" />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-900">{selected.requester?.name || '—'}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{selected.requester?.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {selected.requester?.department && (
                      <span className="text-[11px] text-gray-400">{selected.requester.department}</span>
                    )}
                    <Badge variant="success" size="sm" dot>Đang làm việc</Badge>
                  </div>
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
                    <p className="text-[12px] text-gray-500 mb-1">Lý do</p>
                    <p className="text-[13px] text-gray-800 leading-relaxed">{selected.reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ghi chú phê duyệt */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 mb-3">Ghi chú phê duyệt</h3>
              <textarea
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                rows={3}
                placeholder="Ghi chú phê duyệt hoặc lý do từ chối..."
                className="w-full px-3 py-2.5 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors resize-none"
              />
            </div>

            {/* Action footer */}
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 h-10 flex items-center justify-center gap-2 border border-danger-300 bg-white text-danger-700 text-[13px] font-semibold rounded-md hover:bg-danger-50 disabled:opacity-60 transition-colors"
              >
                <XCircle size={15} strokeWidth={2} />
                Từ chối
              </button>
              <button
                onClick={() => handleApprove(selected.id)}
                disabled={actionLoading}
                className="flex-1 h-10 flex items-center justify-center gap-2 bg-success-600 hover:bg-success-700 text-white text-[13px] font-semibold rounded-md disabled:opacity-60 transition-colors"
              >
                <CheckCircle size={15} strokeWidth={2} />
                Phê duyệt
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center py-20 text-center">
            <Inbox size={36} strokeWidth={1.25} className="text-gray-300 mb-3" />
            <p className="text-[14px] font-medium text-gray-500">Không có đơn nào đang chờ</p>
            <p className="text-[12px] text-gray-400 mt-1">Chọn một đơn từ danh sách bên trái để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApprovals;
