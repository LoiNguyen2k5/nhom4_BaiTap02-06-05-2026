import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

const Badge = ({ children, color = 'gray' }) => (
  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>{children}</span>
);

const Avatar = ({ src, name }) => (
  src ? (
    <img src={src} alt={name} className="w-20 h-20 rounded-2xl object-cover" />
  ) : (
    <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">{(name||'U').charAt(0).toUpperCase()}</div>
  )
);

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const res = await axiosClient.get(`/profile/${id}`);
        if (res.data?.success) {
          setUser(res.data.data.user);
          setProfile(res.data.data.profile || null);
        }
        const all = await axiosClient.get('/admin/users');
        if (all.data?.success) setOthers(all.data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu');
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const department = useMemo(() => {
    // Reuse profile.address as a department if available
    return profile?.address || 'Không có phòng ban';
  }, [profile]);

  const sameDept = useMemo(() => {
    if (!others || others.length === 0) return [];
    return others.filter((o) => (o.profile?.address || '') === (profile?.address || '') && o.id !== user?.id);
  }, [others, profile, user]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const confirm = window.confirm(`Xác nhận ${user.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản này?`);
    if (!confirm) return;
    try {
      setActionLoading(true);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const res = await axiosClient.put(`/admin/users/${user.id}/status`, { status: newStatus });
      if (res.data?.success) setUser((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Lỗi khi cập nhật trạng thái');
    } finally { setActionLoading(false); }
  };

  const handleToggleRole = async () => {
    if (!user) return;
    const target = user.role === 'admin' ? 'user' : 'admin';
    const confirm = window.confirm(`Xác nhận đổi role thành ${target}?`);
    if (!confirm) return;
    try {
      setActionLoading(true);
      const res = await axiosClient.put(`/admin/users/${user.id}/role`, { role: target });
      if (res.data?.success) setUser((prev) => ({ ...prev, role: target }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Lỗi khi cập nhật role');
    } finally { setActionLoading(false); }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Chi tiết tài khoản</h1>
          <p className="text-sm text-gray-500 mt-1">/admin/users/:id — Thông tin và hành động quản trị</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/users" className="text-sm text-gray-500 hover:underline">Quay lại danh sách</Link>
        </div>
      </div>

      <Alert type="error" message={error} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-center">
            <Avatar src={profile?.avatar_url ? `${profile.avatar_url.startsWith('http') ? profile.avatar_url : `${profile.avatar_url}`}` : ''} name={profile?.full_name || user?.name || user?.email} />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800 truncate">{profile?.full_name || user?.name || user?.email}</h2>
            <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
          </div>
          <div className="flex flex-col items-center gap-2 mt-3">
            <div>
              <Badge color={user?.status === 'active' ? 'green' : 'red'}>{user?.status === 'active' ? 'Active' : 'Locked'}</Badge>
              {' '}
              <Badge color={user?.role === 'admin' ? 'purple' : 'blue'}>{user?.role}</Badge>
            </div>
            <div className="text-sm text-gray-500">{department}</div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500">Thông tin chi tiết</h3>
            <div className="flex items-center gap-2">
              <Button onClick={handleToggleStatus} disabled={actionLoading} variant="danger">
                {user?.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              </Button>
              <Button onClick={handleToggleRole} disabled={actionLoading}>
                {user?.role === 'admin' ? 'Đổi thành user' : 'Đổi thành admin'}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="text-xs text-gray-400 uppercase font-semibold">Email</div>
              <div className="text-sm text-gray-800">{user?.email}</div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="text-xs text-gray-400 uppercase font-semibold">Tên đầy đủ</div>
              <div className="text-sm text-gray-800">{profile?.full_name || '-'}</div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="text-xs text-gray-400 uppercase font-semibold">Số điện thoại</div>
              <div className="text-sm text-gray-800">{profile?.phone || '-'}</div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="text-xs text-gray-400 uppercase font-semibold">Địa chỉ / Phòng ban</div>
              <div className="text-sm text-gray-800">{profile?.address || '-'}</div>
            </div>
            <div className="flex items-center justify-between pb-3">
              <div className="text-xs text-gray-400 uppercase font-semibold">Ngày tạo</div>
              <div className="text-sm text-gray-800">{new Date(user?.created_at).toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Tài khoản cùng {profile?.address ? 'phòng ban' : 'role'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sameDept.length === 0 ? (
                <div className="text-sm text-gray-400">Không tìm thấy tài khoản liên quan.</div>
              ) : (
                sameDept.map((u) => (
                  <Link key={u.id} to={`/admin/users/${u.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-sm transition">
                    <div className="shrink-0">
                      <Avatar src={u.profile?.avatar_url ? u.profile.avatar_url : ''} name={u.profile?.full_name || u.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{u.profile?.full_name || u.name}</div>
                      <div className="text-xs text-gray-500 truncate">{u.email}</div>
                    </div>
                    <div className="shrink-0">
                      <Badge color={u.role === 'admin' ? 'purple' : 'blue'}>{u.role}</Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
