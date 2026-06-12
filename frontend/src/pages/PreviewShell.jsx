import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import DashboardLayout from '../components/layout/DashboardLayout';

const MOCK_USERS = {
  admin: {
    id: 1, name: 'Bảo Admin', email: 'admin@atria.dev',
    role: 'admin', status: 'active', department: 'IT',
  },
  hr: {
    id: 2, name: 'Ngọc HR', email: 'hr@atria.dev',
    role: 'hr', status: 'active', department: 'Nhân sự',
  },
  manager: {
    id: 3, name: 'Tuấn Manager', email: 'manager@atria.dev',
    role: 'manager', status: 'active', department: 'Kỹ thuật',
  },
  accountant: {
    id: 4, name: 'Linh Kế toán', email: 'accountant@atria.dev',
    role: 'accountant', status: 'active', department: 'Tài chính',
  },
  user: {
    id: 5, name: 'Minh Nhân viên', email: 'user@atria.dev',
    role: 'employee', status: 'active', department: 'Kỹ thuật',
  },
};

const PreviewShell = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'admin';
  const mockUser = MOCK_USERS[roleParam] || MOCK_USERS.admin;
  const currentUser = useSelector((s) => s.auth.user);

  // Dispatch synchronously during render so Sidebar sees correct role on first paint
  if (!currentUser || currentUser.role !== mockUser.role) {
    dispatch(loginSuccess({ user: mockUser, token: 'preview-token' }));
  }

  return <DashboardLayout />;
};

export default PreviewShell;
