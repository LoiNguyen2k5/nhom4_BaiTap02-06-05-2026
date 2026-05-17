import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import AdminUsers from './pages/AdminUsers';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Route có chứa Navbar & Footer chung */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Các route khác cho team members khác */}
        <Route path="/register" element={<div className="p-8 text-center text-xl font-bold">Đây là chỗ render Trang Register (Thành viên 2)</div>} />
        <Route path="/profile" element={<div className="p-8 text-center text-xl font-bold">Đây là chỗ render Trang Profile (Thành viên 4)</div>} />
        
        {/* Route cho Admin */}
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
};

export default App;
