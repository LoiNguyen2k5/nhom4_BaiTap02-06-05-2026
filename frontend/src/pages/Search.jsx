import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search as SearchIcon, Star, ShoppingCart } from 'lucide-react';

const DUMMY_RESULTS = [
  { id: 1, name: 'Tai nghe Bluetooth Pro', price: '1,200,000đ', category: 'Âm thanh', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', rating: 4.8 },
  { id: 2, name: 'Đồng hồ thông minh Series X', price: '3,500,000đ', category: 'Thiết bị đeo', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', rating: 4.9 },
  { id: 3, name: 'Loa không dây Bass+', price: '850,000đ', category: 'Âm thanh', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', rating: 4.5 },
  { id: 4, name: 'Bàn phím cơ RGB', price: '1,450,000đ', category: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', rating: 4.7 },
  { id: 5, name: 'Chuột Gaming Siêu Nhẹ', price: '950,000đ', category: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', rating: 4.8 },
];

const CATEGORIES = ['Tất cả', 'Âm thanh', 'Thiết bị đeo', 'Phụ kiện', 'Màn hình'];
const SORTS = ['Mới nhất', 'Giá từ thấp đến cao', 'Giá từ cao đến thấp', 'Bán chạy nhất'];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedSort, setSelectedSort] = useState('Mới nhất');

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 font-bold text-lg mb-6 text-gray-900 border-b pb-4">
            <Filter size={20} />
            <span>Bộ lọc tìm kiếm</span>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nhập từ khóa..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <div className="space-y-2">
              {CATEGORIES.map(category => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                  />
                  <span className={`text-sm group-hover:text-blue-600 transition-colors ${selectedCategory === category ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
            <select 
              className="w-full border border-gray-300 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              {SORTS.map(sort => (
                <option key={sort} value={sort}>{sort}</option>
              ))}
            </select>
          </div>

          <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
            Lọc kết quả
          </button>
        </div>
      </aside>

      {/* Main Results */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kết quả ({DUMMY_RESULTS.length})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DUMMY_RESULTS.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-gray-50">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <button className="w-full bg-black text-white font-medium py-2 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
                    <ShoppingCart size={16} />
                    <span className="text-sm">Thêm vào giỏ</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wider">{product.category}</div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate hover:text-blue-600 transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="text-yellow-400 fill-current" size={14} />
                  <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
                </div>
                <p className="text-gray-900 font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Dummy */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Trước</button>
            <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-medium shadow-md">1</button>
            <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium">2</button>
            <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium">3</button>
            <button className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Sau</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Search;
