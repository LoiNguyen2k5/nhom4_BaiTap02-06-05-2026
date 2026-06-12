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
import MyLeaves from './pages/user/MyLeaves';
// Trang dành riêng cho Quản lý (Manager)
import LeaveApprovals from './pages/manager/LeaveApprovals';
import TeamSchedule from './pages/manager/TeamSchedule';
import AdminProfile from './pages/admin/AdminProfile';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminConfig from './pages/admin/AdminConfig';
import AdminTasks from './pages/admin/AdminTasks';
import RecruitmentPage from './pages/admin/RecruitmentPage';
import ProtectedRoute from './routes/ProtectedRoute';

import HRDashboard from './pages/hr/HRDashboard';
import HREmployees from './pages/hr/HREmployees';
import ContractManager from './pages/hr/ContractManager';
import UserTasks from './pages/user/UserTasks';
import EmployeeEvaluation from './pages/hr/EmployeeEvaluation';
import PromotionManager from './pages/hr/PromotionManager';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import AccountantDashboard from './pages/accountant/AccountantDashboard';

import Layout from './components/Layout';
import PerformanceDashboard from './pages/user/PerformanceDashboard';
import PreviewShell from './pages/PreviewShell';

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
  if (user.role === 'manager') return <Navigate to="/manager/dashboard" replace />;
  if (user.role === 'accountant') return <Navigate to="/accountant/dashboard" replace />;
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
        <Route path="leaves" element={<MyLeaves />} />
        <Route path="tasks" element={<UserTasks />} />
        <Route path="performance" element={<PerformanceDashboard />} />
      </Route>

      {/* Manager dashboard - Chỉ dành riêng cho role Manager */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="leave-approvals" element={<LeaveApprovals />} />
        <Route path="team-schedule" element={<TeamSchedule />} />
        <Route path="evaluation" element={<EmployeeEvaluation />} />
        <Route path="promotions" element={<PromotionManager />} />
      </Route>

      {/* Accountant dashboard */}
      <Route
        path="/accountant"
        element={
          <ProtectedRoute allowedRoles={['accountant']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AccountantDashboard />} />
        <Route path="dashboard" element={<AccountantDashboard />} />
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
        <Route path="employees" element={<HREmployees />} />
        <Route path="contracts" element={<ContractManager />} />
        <Route path="evaluation" element={<EmployeeEvaluation />} />
        <Route path="promotions" element={<PromotionManager />} />
      </Route>

      {/* ─── PREVIEW (no auth) ───────────────────────────────────────── */}
      {/* URL: /preview/<path>?role=admin|hr|manager|accountant|user     */}
      <Route path="/preview" element={<PreviewShell />}>
        {/* Admin */}
        <Route path="admin/dashboard"  element={<AdminDashboard />} />
        <Route path="admin/profile"    element={<AdminProfile />} />
        <Route path="admin/users"      element={<AdminUsers />} />
        <Route path="admin/users/:id"  element={<AdminUserDetail />} />
        <Route path="admin/departments" element={<AdminDepartments />} />
        <Route path="admin/tasks"      element={<AdminTasks />} />
        <Route path="admin/config"     element={<AdminConfig />} />
        <Route path="admin/recruitment" element={<RecruitmentPage />} />
        {/* HR */}
        <Route path="hr/dashboard"   element={<HRDashboard />} />
        <Route path="hr/employees"   element={<HREmployees />} />
        <Route path="hr/contracts"   element={<ContractManager />} />
        <Route path="hr/evaluation"  element={<EmployeeEvaluation />} />
        <Route path="hr/promotions"  element={<PromotionManager />} />
        {/* Manager */}
        <Route path="manager/dashboard"       element={<ManagerDashboard />} />
        <Route path="manager/leave-approvals" element={<LeaveApprovals />} />
        <Route path="manager/team-schedule"   element={<TeamSchedule />} />
        <Route path="manager/evaluation"      element={<EmployeeEvaluation />} />
        <Route path="manager/promotions"      element={<PromotionManager />} />
        {/* Accountant */}
        <Route path="accountant/dashboard" element={<AccountantDashboard />} />
        {/* User */}
        <Route path="user/profile"     element={<UserProfile />} />
        <Route path="user/leaves"      element={<MyLeaves />} />
        <Route path="user/tasks"       element={<UserTasks />} />
        <Route path="user/performance" element={<PerformanceDashboard />} />
      </Route>

      {/* ─────────────────────────────────────────────────────────────── */}

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
