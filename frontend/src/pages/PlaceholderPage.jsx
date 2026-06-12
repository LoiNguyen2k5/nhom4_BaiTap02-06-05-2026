import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
  const location = useLocation();
  const pageName = title || location.pathname.split('/').filter(Boolean).pop() || 'Trang này';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <Construction size={28} strokeWidth={1.5} className="text-gray-400" />
      </div>
      <h1 className="text-[18px] font-semibold text-gray-800 mb-2">Tính năng đang phát triển</h1>
      <p className="text-[13px] text-gray-400 max-w-sm">
        Trang <span className="font-mono text-gray-600">{pageName}</span> chưa được triển khai.
        Vui lòng quay lại sau.
      </p>
    </div>
  );
};

export default PlaceholderPage;
