import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import { Users, CheckCircle, Lock, Star, Clock, Building2 } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ── Cấu hình stat cards ───────────────────────────────────────────────────────
const getCards = (data) => [
  {
    id: 'total',
    label: 'Tổng tài khoản',
    value: data?.totalUsers ?? '—',
    icon: <Users className="w-7 h-7" strokeWidth={1.8} />,
    bg: 'from-indigo-400 to-indigo-500',
    link: '/admin/users',
    linkLabel: 'Xem tất cả →',
  },
  {
    id: 'active',
    label: 'Đang hoạt động',
    value: data?.activeUsers ?? '—',
    icon: <CheckCircle className="w-7 h-7" strokeWidth={1.8} />,
    bg: 'from-emerald-500 to-emerald-600',
    link: '/admin/users?status=active',
    linkLabel: 'Xem →',
  },
  {
    id: 'locked',
    label: 'Bị khóa',
    value: data?.lockedUsers ?? '—',
    icon: <Lock className="w-7 h-7" strokeWidth={1.8} />,
    bg: 'from-rose-500 to-rose-600',
    link: '/admin/users?status=inactive',
    linkLabel: 'Xử lý ngay →',
  },
  {
    id: 'new',
    label: 'Mới tháng này',
    value: data?.newUsersThisMonth ?? '—',
    icon: <Star className="w-7 h-7" strokeWidth={1.8} />,
    bg: 'from-purple-500 to-purple-600',
    link: '/admin/users',
    linkLabel: 'Xem →',
  },
  {
    id: 'pending',
    label: 'Yêu cầu chờ duyệt',
    value: 0,
    icon: <Clock className="w-7 h-7" strokeWidth={1.8} />,
    bg: 'from-amber-400 to-orange-500',
    link: '/admin/users',
    linkLabel: 'Xem →',
    placeholder: true,
  },
  {
    id: 'departments',
    label: 'Phòng ban',
    value: 0,
    icon: <Building2 className="w-7 h-7" strokeWidth={1.8} />,
    bg: 'from-teal-500 to-teal-600',
    link: '/admin/departments',
    linkLabel: 'Quản lý →',
    placeholder: true,
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
    admin: 'Quản trị viên', hr: 'HR', manager: 'Manager',
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

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getRoleDotColor = (role) => {
  const map = {
    admin: 'bg-blue-500',
    hr: 'bg-violet-500',
    manager: 'bg-amber-500',
    accountant: 'bg-teal-500',
    employee: 'bg-gray-500',
    user: 'bg-gray-500',
  };
  return map[role] || 'bg-gray-400';
};

// ── Component chính ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);   // dữ liệu từ API
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu từ API khi component mount
  const fetchData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        axiosClient.get('/admin/dashboard'),
        axiosClient.get('/admin/account-requests/pending')
      ]);
      setStats(statsRes.data.data);
      if (requestsRes.data.success) {
        setPendingRequests(requestsRes.data.data);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axiosClient.post(`/admin/account-requests/${id}/approve`);
      if (res.data.success) {
        alert(`${res.data.message}\nMật khẩu tạm: ${res.data.data.tempPassword}`);
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    try {
      const res = await axiosClient.post(`/admin/account-requests/${id}/reject`);
      if (res.data.success) {
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const cards = getCards(stats);
  const recentActivities = stats?.recentActivities || [];
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
    <div className="min-h-screen bg-slate-100">

      {/* ══ HEADER BANNER — gradient xanh đậm ══ */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-8 pt-8 pb-24 relative overflow-hidden">
        {/* Vòng trang trí nền */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-20 -right-4 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Xin chào, Admin 👋</p>
            <h1 className="text-3xl font-extrabold text-white">Tổng quan hệ thống</h1>
            <p className="text-blue-200 text-sm mt-1.5">Dữ liệu cập nhật theo thời gian thực · {monthYear}</p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl backdrop-blur transition-all border border-white/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Quản lý tài khoản
          </button>
        </div>
      </div>

      {/* ══ STAT CARDS — nổi lên đè lên header ══ */}
      <div className="px-8 -mt-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl p-5 flex flex-col gap-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 bg-gradient-to-br ${card.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/20">
                  {card.icon}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-white">{card.value}</span>
                  {card.placeholder && (
                    <p className="text-[10px] text-white/60 mt-0.5">Chưa có dữ liệu</p>
                  )}
                </div>
              </div>
              <p className="text-sm font-semibold text-white/85">{card.label}</p>
              <button
                onClick={() => navigate(card.link)}
                className="text-xs font-semibold self-start text-white/70 hover:text-white hover:underline underline-offset-2"
              >
                {card.linkLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ══ NỘI DUNG PHÍA DƯỚI ══ */}
      <div className="px-8 py-6 space-y-6">
      {/* ── 2 bảng dưới: Tài khoản mới + Yêu cầu chờ duyệt ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Slider 10 tài khoản mới nhất */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-800">Top 10 Tài khoản mới nhất</h2>
              <p className="text-xs text-gray-400 mt-0.5">Thành viên mới gia nhập hệ thống</p>
            </div>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Xem tất cả →
            </button>
          </div>
          
          {stats?.recentUsers?.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="pb-10" // padding bottom cho pagination dots
            >
              {stats.recentUsers.map((u) => (
                <SwiperSlide key={u.id} className="h-auto">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 h-full flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
                    {/* Avatar */}
                    {u.Profile?.avatar_url ? (
                      <img 
                        src={`http://localhost:5000${u.Profile.avatar_url}`} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full object-cover mb-3 shadow-sm border-2 border-white"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-sm border-2 border-white">
                        {(u.name || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Thông tin */}
                    <h3 className="font-bold text-gray-800 text-sm truncate w-full" title={u.name || 'Chưa cập nhật'}>
                      {u.name || 'Chưa cập nhật'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate w-full mb-2" title={u.email}>
                      {u.email}
                    </p>
                    
                    {/* Badge */}
                    <div className="flex gap-1 mb-3">
                      <RoleBadge role={u.role} />
                    </div>

                    <div className="mt-auto pt-3 w-full border-t border-gray-200">
                      <p className="text-[10px] text-gray-400">Tham gia: {formatDate(u.created_at)}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate" title={u.department || 'Chưa xếp phòng ban'}>
                        {u.department || 'Chưa xếp phòng ban'}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
              Chưa có tài khoản nào
            </div>
          )}
        </div>

        {/* Bảng yêu cầu cấp tài khoản */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100">
            <div>
              <h2 className="text-base font-bold text-gray-800">Yêu cầu cấp tài khoản</h2>
              <p className="text-xs text-gray-400 mt-0.5">Yêu cầu từ HR đang chờ Admin xác nhận</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-600 font-semibold px-2.5 py-1 rounded-full">{pendingRequests.length} chờ duyệt</span>
          </div>
          <div className="px-6 py-4 space-y-3 overflow-y-auto flex-1">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-sm text-gray-400 pt-8 pb-8">Không có yêu cầu nào đang chờ duyệt</p>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{req.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{req.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded capitalize">{req.role}</span>
                      {req.department && <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">{req.department.name}</span>}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => handleApprove(req.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                    >
                      Duyệt
                    </button>
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── Widget Nhật ký hoạt động gần đây ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">Nhật ký hoạt động gần đây</h2>
            <p className="text-xs text-gray-400 mt-0.5">Lịch sử thao tác của tất cả vai trò trong hệ thống</p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">Top 10</span>
        </div>
        {recentActivities.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentActivities.map((item) => {
              const role = item.User?.role || 'user';
              const actorLabel = item.User?.name || item.User?.email || 'Hệ thống';
              const detail = item.detail || item.action;
              return (
                <div key={item.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getRoleDotColor(role)}`} />
                  <span className="text-xs font-semibold text-gray-600 w-32 shrink-0 truncate" title={actorLabel}>
                    {actorLabel}
                  </span>
                  <p className="text-sm text-gray-700 flex-1">
                    {detail}
                  </p>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDateTime(item.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-400">
            Chưa có hoạt động nào
          </div>
        )}
      </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
