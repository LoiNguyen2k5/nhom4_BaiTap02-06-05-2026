import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đang chờ load user từ API sau hard refresh
  if (allowedRole && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (allowedRole && user?.role !== allowedRole) {
    let fallback = '/user/profile';
    if (user?.role === 'admin') fallback = '/admin/dashboard';
    else if (user?.role === 'hr') fallback = '/hr/contracts';
    
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
