import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/home" className="text-2xl font-bold text-blue-600 tracking-tight">MyShop</Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/home" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Trang chủ</Link>
            <Link to="/search" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Tìm kiếm</Link>
            <Link to="/admin/users" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Quản lý Tài khoản (Admin)</Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Đăng nhập</Link>
          </nav>

          <div className="flex items-center space-x-6 text-gray-500">
            <Link to="/search" className="hover:text-blue-600 transition-colors">
              <Search size={22} />
            </Link>
            <div className="relative cursor-pointer hover:text-blue-600 transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
            <Link to="/profile" className="hover:text-blue-600 transition-colors">
              <User size={22} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">MyShop</h3>
            <p className="text-gray-400 leading-relaxed">Cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. Giao hàng toàn quốc.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li><Link to="/home" className="hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Sản phẩm</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
            <p className="text-gray-400">Email: support@myshop.com</p>
            <p className="text-gray-400">Điện thoại: 0123 456 789</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2026 MyShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
