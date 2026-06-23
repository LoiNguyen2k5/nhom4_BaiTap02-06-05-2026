import { Link, Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/jobs" className="text-xl font-bold text-blue-600 tracking-tight">
            Nhóm 4 &mdash; Tuyển Dụng
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Việc làm
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập nội bộ
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
        <p>&copy; 2026 Nhóm 4. All rights reserved.</p>
        <p className="mt-1">Dành riêng cho ứng viên bên ngoài &mdash; không cần đăng nhập.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
