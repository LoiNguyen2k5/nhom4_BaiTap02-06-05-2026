/* ═══════════════════════════════════════════════════════════
   RecruitmentPage — Kanban tuyển dụng
   Dùng dữ liệu thật từ API /api/recruitment/*
   ═══════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { recruitmentService } from '../../services/recruitment.service';
import './RecruitmentPage.css';

/* ── Constants ───────────────────────────────────────────── */
const STAGES = [
  { id: 'new',       title: 'Mới nộp',           cls: 'stage-new',       subtitle: 'Avg 1–2 ngày' },
  { id: 'screening', title: 'Sàng lọc CV',        cls: 'stage-screening', subtitle: 'Avg 2 ngày' },
  { id: 'iv1',       title: 'PV vòng 1',          cls: 'stage-iv1',       subtitle: 'Avg 3 ngày' },
  { id: 'iv2',       title: 'PV vòng 2 / Test',   cls: 'stage-iv2',       subtitle: 'Avg 4 ngày' },
  { id: 'offer',     title: 'Offer',              cls: 'stage-offer',     subtitle: 'Hạn 7 ngày' },
  { id: 'hired',     title: 'Đã tuyển',           cls: 'stage-hired',     subtitle: 'Trong tháng' },
];

const EMPTY_FORM = {
  name: '', email: '', phone: '', position: '',
  skills: '', experience_years: '', expected_salary: '',
  source: 'Other', current_company: '', note: '',
};

/* ── Avatar ─────────────────────────────────────────────── */
const AVATAR_COLORS = ['#1E3A6B','#0891B2','#7C3AED','#0D9488','#BE185D','#A16207'];
function hashColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}
function Avatar({ name, size = 28 }) {
  return (
    <span
      className="rc-avatar"
      style={{ width: size, height: size, fontSize: size * 0.38, background: hashColor(name) }}
    >
      {initials(name)}
    </span>
  );
}

/* ── Score color ─────────────────────────────────────────── */
function scoreColor(s) {
  if (s >= 4.5) return 'var(--rc-success)';
  if (s >= 4.0) return 'var(--rc-success-soft)';
  if (s >= 3.5) return 'var(--rc-warning)';
  return 'var(--rc-gray-500)';
}

/* ── Time display ─────────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`;
  if (diff < 172800) return 'hôm qua';
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

/* ── Icons ───────────────────────────────────────────────── */
const Icon = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const Icons = {
  Plus:    <Icon d="M12 5v14M5 12h14" />,
  Filter:  <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" />,
  X:       (s = 16) => <Icon size={s} d="M18 6L6 18M6 6l12 12" />,
  Star:    (s = 10) => <Icon size={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  Cal:     (s = 11) => <Icon size={s} d={["M3 4h18v18H3z","M16 2v4M8 2v4","M3 10h18"]} />,
  Refresh: <Icon d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />,
  Trash:   <Icon d={["M3 6h18","M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6","M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"]} />,
  More:    <Icon d="M5 12a1 1 0 100 2 1 1 0 000-2zM12 12a1 1 0 100 2 1 1 0 000-2zM19 12a1 1 0 100 2 1 1 0 000-2z" />,
  User:    <Icon d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z", "M16 11v1M19 8v6M22 11h-6"]} />,
};

/* ── Toast ───────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);
  const push = useCallback((type, msg) => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return { toasts, push };
}
function ToastList({ toasts }) {
  return (
    <div className="rc-toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`rc-toast rc-toast--${t.type}`}>
          <span className="rc-toast-dot" />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Candidate Card ──────────────────────────────────────── */
function CandidateCard({ candidate: c, dragging, selected, onSelect, onDragStart, onDragEnd, onDelete }) {
  const skills = Array.isArray(c.skills) ? c.skills : [];
  const visible = skills.slice(0, 3);
  const overflow = skills.length - 3;

  return (
    <div
      draggable
      className={`rc-card${dragging ? ' rc-card--dragging' : ''}${selected ? ' rc-card--selected' : ''}`}
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart(); }}
      onDragEnd={onDragEnd}
      onClick={onSelect}
    >
      <div className="rc-card__row1">
        <Avatar name={c.name} size={28} />
        <p className="rc-card__name">{c.name}</p>
        <button
          className="rc-card__del"
          title="Xoá ứng viên"
          onClick={(e) => { e.stopPropagation(); onDelete(c); }}
        >
          {Icons.X(12)}
        </button>
      </div>

      <p className="rc-card__pos">{c.position}</p>

      {visible.length > 0 && (
        <div className="rc-card__skills">
          {visible.map((s) => <span key={s} className="rc-skill">{s}</span>)}
          {overflow > 0 && <span className="rc-skill rc-skill--more">+{overflow}</span>}
        </div>
      )}

      <div className="rc-card__foot">
        <span className="rc-card__time">{Icons.Cal()} {timeAgo(c.created_at)}</span>
        {c.match_score && (
          <span className="rc-card__score" style={{ color: scoreColor(c.match_score) }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {Number(c.match_score).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Kanban Column ───────────────────────────────────────── */
function KanbanColumn({ stage, candidates, draggingId, selectedId, dropTarget, onCardSelect, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, onAddClick, onDelete }) {
  const isTarget = dropTarget === stage.id;
  return (
    <div
      className={`rc-col ${stage.cls}${isTarget ? ' rc-col--drop' : ''}`}
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="rc-col__header">
        <div className="rc-col__header-top">
          <div className="rc-col__title">
            <span>{stage.title}</span>
            <span className="rc-col__count">{candidates.length}</span>
          </div>
          <button className="rc-col__add" title={`Thêm vào ${stage.title}`} onClick={onAddClick}>
            {Icons.Plus}
          </button>
        </div>
        <p className="rc-col__subtitle">{stage.subtitle}</p>
      </div>

      <div className="rc-col__body">
        {candidates.length === 0
          ? <p className="rc-col__empty">Chưa có ứng viên</p>
          : candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              dragging={draggingId === c.id}
              selected={selectedId === c.id}
              onSelect={() => onCardSelect(c.id)}
              onDragStart={() => onDragStart(c.id, stage.id)}
              onDragEnd={onDragEnd}
              onDelete={onDelete}
            />
          ))
        }
      </div>
    </div>
  );
}

/* ── Stats Bar ───────────────────────────────────────────── */
function StatsBar({ stats, total }) {
  const items = [
    { label: 'TỔNG ỨNG VIÊN',           value: total ?? '—' },
    { label: 'MỚI THÁNG NÀY',           value: stats?.newThisMonth ?? '—' },
    { label: 'CONVERSION CV → OFFER',   value: stats ? `${stats.conversionRate}%` : '—', note: 'CV → tuyển' },
    { label: 'OFFER CHẤP NHẬN',         value: stats ? `${stats.offerAcceptRate}%` : '—' },
  ];
  return (
    <div className="rc-stats">
      {items.map((it) => (
        <div key={it.label} className="rc-stat">
          <p className="rc-stat__label">{it.label}</p>
          <p className="rc-stat__value">{it.value}</p>
          {it.note && <p className="rc-stat__note">{it.note}</p>}
        </div>
      ))}
    </div>
  );
}

/* ── Add Candidate Modal ─────────────────────────────────── */
function AddCandidateModal({ positions, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.position.trim()) {
      setError('Họ tên và Vị trí là bắt buộc.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const skillArr = form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
      await recruitmentService.createCandidate({
        ...form,
        skills: skillArr,
        experience_years: form.experience_years ? Number(form.experience_years) : 0,
        expected_salary: form.expected_salary ? Number(form.expected_salary) : null,
      });
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Lỗi khi thêm ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, req, children }) => (
    <div className="rc-form-grp">
      <label className="rc-lbl">{label}{req && <span className="rc-lbl-req">*</span>}</label>
      {children}
    </div>
  );

  return (
    <div className="rc-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rc-modal">
        <div className="rc-modal__header">
          <div>
            <h2 className="rc-modal__title">Thêm ứng viên mới</h2>
            <p className="rc-modal__sub">Ứng viên sẽ được thêm vào cột "Mới nộp"</p>
          </div>
          <button className="rc-modal__close" onClick={onClose}>{Icons.X()}</button>
        </div>

        <div className="rc-modal__body">
          {error && <div className="rc-error-banner">{error}</div>}

          <div className="rc-form-grid">
            <Field label="Họ và tên" req>
              <input className="rc-inp" placeholder="Nguyễn Văn A" value={form.name}
                onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Email">
              <input className="rc-inp" type="email" placeholder="email@example.com" value={form.email}
                onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field label="Số điện thoại">
              <input className="rc-inp" placeholder="+84 9XX XXX XXX" value={form.phone}
                onChange={(e) => set('phone', e.target.value)} />
            </Field>
            <Field label="Năm kinh nghiệm">
              <input className="rc-inp" type="number" min="0" placeholder="0" value={form.experience_years}
                onChange={(e) => set('experience_years', e.target.value)} />
            </Field>
            <Field label="Vị trí ứng tuyển" req>
              <input className="rc-inp" list="pos-list" placeholder="Ví dụ: Backend Engineer"
                value={form.position} onChange={(e) => set('position', e.target.value)} />
              <datalist id="pos-list">
                {positions.map((p) => <option key={p} value={p} />)}
              </datalist>
            </Field>
            <Field label="Nguồn">
              <select className="rc-inp rc-select" value={form.source} onChange={(e) => set('source', e.target.value)}>
                {['LinkedIn','TopCV','Referral','Direct','Other'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Skills (cách nhau bằng dấu phẩy)">
            <input className="rc-inp" placeholder="React, TypeScript, Node.js" value={form.skills}
              onChange={(e) => set('skills', e.target.value)} />
          </Field>

          <div className="rc-form-grid">
            <Field label="Đang làm tại">
              <input className="rc-inp" placeholder="ABC Company" value={form.current_company}
                onChange={(e) => set('current_company', e.target.value)} />
            </Field>
            <Field label="Lương kỳ vọng (₫)">
              <input className="rc-inp rc-mono" type="number" placeholder="25000000" value={form.expected_salary}
                onChange={(e) => set('expected_salary', e.target.value)} />
            </Field>
          </div>

          <Field label="Ghi chú">
            <textarea className="rc-inp rc-textarea" placeholder="Ghi chú nội bộ, người giới thiệu..."
              value={form.note} onChange={(e) => set('note', e.target.value)} />
          </Field>
        </div>

        <div className="rc-modal__footer">
          <button className="rc-btn rc-btn--ghost" onClick={onClose}>Huỷ</button>
          <button className="rc-btn rc-btn--primary" onClick={submit} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Thêm vào pipeline'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ────────────────────────────────── */
function DeleteModal({ candidate, onClose, onConfirm }) {
  return (
    <div className="rc-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rc-modal rc-modal--sm">
        <div className="rc-modal__header">
          <h2 className="rc-modal__title">Xác nhận xoá</h2>
          <button className="rc-modal__close" onClick={onClose}>{Icons.X()}</button>
        </div>
        <div className="rc-modal__body">
          <p className="rc-del-text">
            Bạn có chắc muốn xoá ứng viên <strong>{candidate.name}</strong> — {candidate.position}?
            <br />Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="rc-modal__footer">
          <button className="rc-btn rc-btn--ghost" onClick={onClose}>Huỷ</button>
          <button className="rc-btn rc-btn--danger" onClick={onConfirm}>Xoá</button>
        </div>
      </div>
    </div>
  );
}

/* ══ Main Page ══════════════════════════════════════════ */
export default function RecruitmentPage() {
  const { user } = useSelector((s) => s.auth);

  const [board, setBoard]         = useState(() => Object.fromEntries(STAGES.map((s) => [s.id, []])));
  const [stats, setStats]         = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading]     = useState(true);

  const [dragging, setDragging]   = useState({ id: null, from: null });
  const [dropTarget, setDrop]     = useState(null);
  const [selected, setSelected]   = useState(null);

  const [showAdd, setShowAdd]     = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [filterPos, setFilterPos] = useState('');

  const { toasts, push } = useToast();

  /* ── load ──────────────────────────────────────────── */
  const loadBoard = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterPos ? { position: filterPos } : {};
      const [boardRes, statsRes, posRes] = await Promise.all([
        recruitmentService.getBoard(params),
        recruitmentService.getStats(),
        recruitmentService.getPositions(),
      ]);
      setBoard(boardRes.data);
      setStats(statsRes.data);
      setPositions(posRes.data || []);
    } catch {
      push('error', 'Không thể tải dữ liệu tuyển dụng');
    } finally {
      setLoading(false);
    }
  }, [filterPos]); // eslint-disable-line

  useEffect(() => { loadBoard(); }, [loadBoard]);

  /* ── drag & drop ─────────────────────────────────── */
  const STAGE_ORDER = STAGES.map((s) => s.id);

  const handleDrop = useCallback(async (toStage) => {
    const { id, from } = dragging;
    if (!id || !from || from === toStage) { setDrop(null); return; }

    const fromIdx = STAGE_ORDER.indexOf(from);
    const toIdx   = STAGE_ORDER.indexOf(toStage);

    if (from === 'hired') {
      push('error', 'Không thể di chuyển ứng viên đã tuyển.');
      setDragging({ id: null, from: null }); setDrop(null); return;
    }
    if (toIdx < fromIdx - 1) {
      push('error', 'Không thể đảo ngược nhiều stage một lần.');
      setDragging({ id: null, from: null }); setDrop(null); return;
    }

    // Optimistic update
    setBoard((prev) => {
      const card = prev[from]?.find((c) => c.id === id);
      if (!card) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((c) => c.id !== id),
        [toStage]: [{ ...card, stage: toStage }, ...(prev[toStage] || [])],
      };
    });

    const candidateName = board[from]?.find((c) => c.id === id)?.name;
    setDragging({ id: null, from: null }); setDrop(null);

    try {
      await recruitmentService.moveStage(id, toStage);
      const stageTitle = STAGES.find((s) => s.id === toStage)?.title;
      push('success', `Đã chuyển ${candidateName} sang "${stageTitle}"`);
    } catch {
      push('error', 'Lỗi khi cập nhật stage, thử lại.');
      loadBoard(); // revert
    }
  }, [dragging, board, push, loadBoard]); // eslint-disable-line

  /* ── delete ──────────────────────────────────────── */
  const handleDelete = async () => {
    if (!delTarget) return;
    try {
      await recruitmentService.deleteCandidate(delTarget.id);
      push('success', `Đã xoá ${delTarget.name}`);
      setDelTarget(null);
      loadBoard();
    } catch {
      push('error', 'Lỗi khi xoá ứng viên');
    }
  };

  const totalActive = STAGES.reduce((sum, s) => sum + (board[s.id]?.length || 0), 0);

  return (
    <div className="rc-page">
      <ToastList toasts={toasts} />

      {/* Header */}
      <div className="rc-header">
        <div>
          <div className="rc-header__title-row">
            <h1 className="rc-header__h1">Tuyển dụng</h1>
            <select
              className="rc-pos-select"
              value={filterPos}
              onChange={(e) => setFilterPos(e.target.value)}
            >
              <option value="">Tất cả vị trí ({positions.length} mở)</option>
              {positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <p className="rc-header__sub">
            {totalActive} ứng viên đang xử lý · {positions.length} vị trí đang tuyển
          </p>
        </div>
        <div className="rc-header__actions">
          <button className="rc-btn rc-btn--ghost" onClick={loadBoard} title="Làm mới">
            {Icons.Refresh} Làm mới
          </button>
          <button className="rc-btn rc-btn--accent" onClick={() => setShowAdd(true)}>
            {Icons.User} Thêm ứng viên
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} total={totalActive} />

      {/* Kanban */}
      <div className="rc-board-wrap">
        {loading ? (
          <div className="rc-loading">
            <div className="rc-spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="rc-board">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                candidates={board[stage.id] || []}
                draggingId={dragging.id}
                selectedId={selected}
                dropTarget={dropTarget}
                onCardSelect={(id) => setSelected((s) => s === id ? null : id)}
                onDragStart={(cId, from) => setDragging({ id: cId, from })}
                onDragEnd={() => { setDragging({ id: null, from: null }); setDrop(null); }}
                onDragOver={() => { if (dropTarget !== stage.id) setDrop(stage.id); }}
                onDragLeave={() => { if (dropTarget === stage.id) setDrop(null); }}
                onDrop={() => handleDrop(stage.id)}
                onAddClick={() => setShowAdd(true)}
                onDelete={(c) => setDelTarget(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddCandidateModal
          positions={positions}
          onClose={() => setShowAdd(false)}
          onSuccess={() => { push('success', 'Đã thêm ứng viên mới vào pipeline!'); loadBoard(); }}
        />
      )}
      {delTarget && (
        <DeleteModal
          candidate={delTarget}
          onClose={() => setDelTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
