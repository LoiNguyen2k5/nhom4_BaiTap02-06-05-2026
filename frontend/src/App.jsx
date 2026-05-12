import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Các route khác cho team members khác */}
      <Route path="/register" element={<div className="p-8 text-center text-xl font-bold">Đây là chỗ render Trang Register (Thành viên 2)</div>} />
      <Route path="/profile" element={<div className="p-8 text-center text-xl font-bold">Đây là chỗ render Trang Profile (Thành viên 4)</div>} />
    </Routes>
  );
};

export default App;

