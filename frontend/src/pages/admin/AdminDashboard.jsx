import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';

// ── Icon components (dùng SVG inline, không cần thư viện ngoài) ──────────────
const IconUsers = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconLock = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
const IconStar = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

// ── Cấu hình 4 stat cards ────────────────────────────────────────────────────
const getCards = (data) => [
  {
    id: 'total',
    label: 'Tổng tài khoản',
    value: data?.totalUsers ?? '—',
    icon: <IconUsers />,
    bg: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    link: '/admin/users',
    linkLabel: 'Xem tất cả →',
  },
  {
    id: 'active',
    label: 'Đang hoạt động',
    value: data?.activeUsers ?? '—',
    icon: <IconCheck />,
    bg: 'from-emerald-400 to-emerald-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    link: '/admin/users?status=active',
    linkLabel: 'Xem →',
  },
  {
    id: 'locked',
    label: 'Bị khóa',
    value: data?.lockedUsers ?? '—',
    icon: <IconLock />,
    bg: 'from-rose-400 to-rose-500',
    light: 'bg-rose-50',
    text: 'text-rose-600',
    link: '/admin/users?status=inactive',
    linkLabel: 'Xử lý ngay →',
  },
  {
    id: 'new',
    label: 'Mới tháng này',
    value: data?.newUsersThisMonth ?? '—',
    icon: <IconStar />,
    bg: 'from-violet-500 to-violet-600',
    light: 'bg-violet-50',
    text: 'text-violet-600',
    link: '/admin/users',
    linkLabel: 'Xem →',
  },
];

// ── Badge trạng thái tài khoản ───────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        Hoạt động
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
      Bị khóa
    </span>
  );
};

// ── Badge vai trò ────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const map = {
    admin:      'bg-blue-100 text-blue-700',
    hr:         'bg-violet-100 text-violet-700',
    manager:    'bg-amber-100 text-amber-700',
    accountant: 'bg-teal-100 text-teal-700',
    employee:   'bg-gray-100 text-gray-600',
    user:       'bg-gray-100 text-gray-600',
  };
  const labels = {
    admin: 'Admin', hr: 'HR', manager: 'Manager',
    accountant: 'Kế toán', employee: 'Nhân viên', user: 'Người dùng',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[role] || map.user}`}>
      {labels[role] || role}
    </span>
  );
};

// ── Format ngày tháng ────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// ── Component chính ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);   // dữ liệu từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = getCards(stats);
  const now = new Date();
  const monthYear = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  // ── Trạng thái loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ── Trạng thái lỗi ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-8 py-6 text-center">
          <p className="text-rose-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
          <p className="text-sm text-gray-500 mt-0.5">Dữ liệu cập nhật theo thời gian thực · {monthYear}</p>
        </div>
        {/* Nút shortcut sang trang quản lý tài khoản */}
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Quản lý tài khoản
        </button>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            {/* Icon + số liệu */}
            <div className="flex items-center justify-between">
              <div className={`${card.light} p-3 rounded-xl ${card.text}`}>
                {card.icon}
              </div>
              <span className="text-3xl font-extrabold text-gray-800">{card.value}</span>
            </div>

            {/* Thanh gradient nhỏ */}
            <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${card.bg}`} />

            {/* Label + link */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <button
                onClick={() => navigate(card.link)}
                className={`text-xs font-semibold ${card.text} hover:underline`}
              >
                {card.linkLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bảng tài khoản mới nhất ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Tiêu đề bảng */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">Tài khoản mới nhất</h2>
            <p className="text-xs text-gray-400 mt-0.5">5 tài khoản được tạo gần đây nhất</p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Xem tất cả →
          </button>
        </div>

        {/* Nội dung bảng */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">Họ tên</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentUsers?.length > 0 ? (
                stats.recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* Avatar chữ cái đầu */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(u.name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{u.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{u.email}</td>
                    <td className="px-6 py-3.5"><RoleBadge role={u.role} /></td>
                    <td className="px-6 py-3.5"><StatusBadge status={u.status} /></td>
                    <td className="px-6 py-3.5 text-gray-400">{formatDate(u.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Chưa có tài khoản nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
