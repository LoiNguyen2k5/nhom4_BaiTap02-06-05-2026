import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Video, 
  User, 
  Search, 
  Check, 
  X, 
  Clock, 
  Edit3, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { recruitmentService } from '../../services/recruitment.service';

function formatDateTimeLocal(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function formatFriendlyDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ── Interview Edit Modal ────────────────────────────────── */
function ScheduleModal({ candidate, onClose, onSuccess }) {
  const [form, setForm] = useState({
    interview_date: candidate.interview_date ? formatDateTimeLocal(candidate.interview_date) : '',
    interview_link: candidate.interview_link || '',
    interviewer: candidate.interviewer || '',
    interview_note: candidate.interview_note || '',
    stage: candidate.stage || 'iv1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.interview_date) {
      setError('Vui lòng chọn thời gian phỏng vấn.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await recruitmentService.updateCandidate(candidate.id, {
        ...form,
        interview_date: new Date(form.interview_date),
      });
      onSuccess('Đặt lịch phỏng vấn thành công!');
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Lỗi khi cập nhật lịch phỏng vấn');
    } finally {
      setLoading(false);
    }
  };

  const setStage = async (newStage) => {
    setLoading(true);
    try {
      await recruitmentService.moveStage(candidate.id, newStage);
      onSuccess(`Đã chuyển trạng thái ứng viên sang "${newStage === 'hired' ? 'Đã tuyển' : newStage === 'rejected' ? 'Bị loại' : 'Offer'}"`);
      onClose();
    } catch {
      setError('Lỗi khi chuyển trạng thái ứng viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-[16px]">Lên lịch / Đánh giá phỏng vấn</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">{candidate.name} — {candidate.position}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">{error}</div>}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Thời gian phỏng vấn</label>
              <input 
                type="datetime-local" 
                className="w-full px-3 py-2 border border-gray-350 rounded-xl text-[13px] outline-none focus:border-navy-600 font-sans"
                value={form.interview_date}
                onChange={(e) => setForm({ ...form, interview_date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Link phỏng vấn (Google Meet/Zoom)</label>
              <input 
                type="text" 
                placeholder="https://meet.google.com/abc-xyz" 
                className="w-full px-3 py-2 border border-gray-355 rounded-xl text-[13px] outline-none focus:border-navy-600 font-mono"
                value={form.interview_link}
                onChange={(e) => setForm({ ...form, interview_link: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Người phỏng vấn</label>
              <input 
                type="text" 
                placeholder="Nguyễn Văn A / Trưởng phòng kỹ thuật" 
                className="w-full px-3 py-2 border border-gray-355 rounded-xl text-[13px] outline-none focus:border-navy-600"
                value={form.interviewer}
                onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Ghi chú & Nhận xét</label>
              <textarea 
                placeholder="Nhận xét sau phỏng vấn, câu hỏi chuẩn bị..." 
                rows={3}
                className="w-full px-3 py-2 border border-gray-355 rounded-xl text-[13px] outline-none focus:border-navy-600 resize-none"
                value={form.interview_note}
                onChange={(e) => setForm({ ...form, interview_note: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition disabled:opacity-50"
              onClick={() => setStage('rejected')}
              disabled={loading}
            >
              Từ chối (Reject)
            </button>
            <button 
              className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition disabled:opacity-50"
              onClick={() => setStage('hired')}
              disabled={loading}
            >
              Nhận tuyển (Hired)
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-3.5 py-1.5 border border-gray-355 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition" onClick={onClose}>Huỷ</button>
            <button 
              className="px-4 py-1.5 bg-navy-700 text-white rounded-xl text-xs font-bold hover:bg-navy-800 transition disabled:opacity-50"
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu lịch hẹn'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function HRInterviews() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | pending
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const boardRes = await recruitmentService.getBoard();
      const all = Object.values(boardRes.data).flat();
      setCandidates(all);
    } catch (err) {
      console.error('Lỗi tải dữ liệu phỏng vấn:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Bộ lọc
  const filteredCandidates = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                        c.position.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const upcomingInterviews = filteredCandidates
    .filter((c) => c.interview_date && c.stage !== 'hired' && c.stage !== 'rejected')
    .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date));

  const pendingInterviews = filteredCandidates
    .filter((c) => (c.stage === 'iv1' || c.stage === 'iv2') && !c.interview_date);

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[99999] px-4 py-3 rounded-xl shadow-lg text-[13px] font-semibold text-white transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Lịch phỏng vấn</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sắp xếp, quản lý lịch hẹn phỏng vấn và đánh giá kết quả ứng tuyển</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm ứng viên..." 
              className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-xl text-xs outline-none bg-white focus:border-navy-600 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition text-gray-600"
            onClick={loadData}
            title="Làm mới"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="border-b border-gray-250 flex gap-6">
        <button 
          className={`pb-3 font-semibold text-sm transition relative ${
            activeTab === 'upcoming' ? 'text-navy-700' : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Lịch phỏng vấn sắp tới ({upcomingInterviews.length})
          {activeTab === 'upcoming' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-700 rounded-full" />}
        </button>
        <button 
          className={`pb-3 font-semibold text-sm transition relative ${
            activeTab === 'pending' ? 'text-navy-700' : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Chờ lên lịch hẹn ({pendingInterviews.length})
          {activeTab === 'pending' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-700 rounded-full" />}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <div className="w-8 h-8 border-3 border-navy-700 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Đang tải dữ liệu...</p>
        </div>
      ) : activeTab === 'upcoming' ? (
        upcomingInterviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center py-20 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-navy-50 flex items-center justify-center mb-4">
              <Calendar size={26} className="text-navy-700" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Không có lịch phỏng vấn nào</h3>
            <p className="text-xs text-gray-500 max-w-xs">Tất cả lịch phỏng vấn sắp diễn ra sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingInterviews.map((c) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-[14px]">{c.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{c.position}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.stage === 'iv2' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {c.stage === 'iv2' ? 'Phỏng vấn vòng 2' : 'Phỏng vấn vòng 1'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100 text-[12px] text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-navy-600" />
                      <span className="font-semibold">{formatFriendlyDateTime(c.interview_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-navy-600" />
                      <span>Người PV: <strong className="text-gray-800">{c.interviewer || 'Chưa phân công'}</strong></span>
                    </div>
                    {c.interview_note && (
                      <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg italic mt-1">
                        "{c.interview_note}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {c.interview_link ? (
                    <a 
                      href={c.interview_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition"
                    >
                      <Video size={14} />
                      Vào phòng họp
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <button 
                      className="flex-1 py-1.5 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold cursor-not-allowed"
                      disabled
                    >
                      Không có link họp
                    </button>
                  )}
                  <button 
                    className="p-1.5 border border-gray-200 hover:bg-gray-100 rounded-xl text-gray-600 transition"
                    onClick={() => setSelectedCandidate(c)}
                    title="Cập nhật thông tin & Đánh giá"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        pendingInterviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center py-20 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-navy-50 flex items-center justify-center mb-4">
              <Check size={26} className="text-navy-700" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Không có ứng viên chờ hẹn</h3>
            <p className="text-xs text-gray-500 max-w-xs">Tất cả ứng viên thuộc vòng PV 1 & PV 2 đã được lên lịch hẹn.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Họ và tên</th>
                  <th className="px-6 py-3">Vị trí ứng tuyển</th>
                  <th className="px-6 py-3">Vòng hiện tại</th>
                  <th className="px-6 py-3">Điểm AI Match</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-[13px] text-gray-700">
                {pendingInterviews.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{c.name}</td>
                    <td className="px-6 py-3.5 text-gray-500">{c.position}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.stage === 'iv2' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {c.stage === 'iv2' ? 'Phỏng vấn 2' : 'Phỏng vấn 1'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-green-700">{c.match_score ? `${c.match_score.toFixed(1)} / 5.0` : '—'}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button 
                        className="px-3.5 py-1.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1"
                        onClick={() => setSelectedCandidate(c)}
                      >
                        <Calendar size={13} />
                        Lên lịch phỏng vấn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Schedule & Evaluation Modal */}
      {selectedCandidate && (
        <ScheduleModal 
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onSuccess={(msg) => {
            showToast(msg);
            loadData();
          }}
        />
      )}
    </div>
  );
}
