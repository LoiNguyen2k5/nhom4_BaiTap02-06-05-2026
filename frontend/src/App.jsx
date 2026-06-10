import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMeThunk } from './redux/authSlice';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';

import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserProfile from './pages/user/UserProfile';
import AdminProfile from './pages/admin/AdminProfile';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminConfig from './pages/admin/AdminConfig';
import AdminTasks from './pages/admin/AdminTasks';
import RecruitmentPage from './pages/admin/RecruitmentPage';
import ProtectedRoute from './routes/ProtectedRoute';

import HRDashboard from './pages/hr/HRDashboard';
import ContractManager from './pages/hr/ContractManager';
import UserTasks from './pages/user/UserTasks';

import Layout from './components/Layout';

// Redirect /profile đến đúng dashboard theo role
const RoleRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'hr') return <Navigate to="/hr/dashboard" replace />;
  return <Navigate to="/user/profile" replace />;
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Sau hard refresh: token có nhưng user chưa load → fetch lại từ API
  useEffect(() => {
    if (isAuthenticated && user === null) {
      dispatch(fetchMeThunk());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      {/* Public routes (auth) */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Legacy redirect */}
      <Route path="/profile" element={<RoleRedirect />} />

      {/* Public routes với Navbar & Footer */}
      <Route element={<Layout />}>
      </Route>

      {/* User dashboard (All non-admin roles can access profile here) */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['user', 'employee', 'manager', 'accountant', 'hr']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<UserProfile />} />
        <Route path="tasks" element={<UserTasks />} />
      </Route>

      {/* HR dashboard */}
      <Route
        path="/hr"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="contracts" element={<ContractManager />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="config" element={<AdminConfig />} />
        <Route path="recruitment" element={<RecruitmentPage />} />
      </Route>
    </Routes>
  );
};

export default App;
