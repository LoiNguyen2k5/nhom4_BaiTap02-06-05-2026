import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Tai nghe Bluetooth Pro', price: '1,200,000đ', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', rating: 4.8, isNew: true },
  { id: 2, name: 'Đồng hồ thông minh Series X', price: '3,500,000đ', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', rating: 4.9, isNew: true },
  { id: 3, name: 'Loa không dây Bass+', price: '850,000đ', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', rating: 4.5, isNew: false },
  { id: 4, name: 'Bàn phím cơ RGB', price: '1,450,000đ', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', rating: 4.7, isNew: false },
];

const BEST_SELLERS = [
  { id: 5, name: 'Chuột Gaming Siêu Nhẹ', price: '950,000đ', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', rating: 4.8, sold: 1205 },
  { id: 6, name: 'Màn hình 27" 4K', price: '7,800,000đ', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80', rating: 4.9, sold: 856 },
  { id: 7, name: 'Giá đỡ Laptop Nhôm', price: '350,000đ', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', rating: 4.6, sold: 2304 },
  { id: 8, name: 'Webcam HD 1080p', price: '650,000đ', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', rating: 4.4, sold: 980 },
];

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      {product.isNew && (
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Mới
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
        <button className="w-full bg-black text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
          <ShoppingCart size={18} />
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center space-x-1 mb-2">
        <Star className="text-yellow-400 fill-current" size={16} />
        <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
        {product.sold != null && <span className="text-xs text-gray-400 ml-2">({product.sold} đã bán)</span>}
      </div>
      <Link to={`/product/${product.id}`}>
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate hover:text-blue-600 transition-colors">{product.name}</h3>
      </Link>
      <p className="text-blue-600 font-bold text-xl">{product.price}</p>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
        <div className="relative px-8 py-20 md:px-16 md:py-32 max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 border border-blue-400/50 text-sm font-semibold mb-6 backdrop-blur-sm">
            Khuyến mãi mùa hè
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Nâng tầm công nghệ <br/> 
            <span className="text-blue-300">Cuộc sống của bạn</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed">
            Khám phá bộ sưu tập sản phẩm công nghệ mới nhất với ưu đãi lên đến 40%. Độc quyền trong tháng này.
          </p>
        </div>
      </section>

      {/* Newest Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-2xl mr-2">✨</span> Sản phẩm mới nhất
            </h2>
            <p className="text-gray-500">Cập nhật những xu hướng công nghệ mới nhất.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-2xl mr-2">🏆</span> Bán chạy nhất
            </h2>
            <p className="text-gray-500">Những sản phẩm được yêu thích nhất bởi khách hàng.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BEST_SELLERS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="bg-gray-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-8 max-w-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đăng ký nhận bản tin</h2>
          <p className="text-gray-600 mb-6">Nhận thông báo về các sản phẩm mới và chương trình khuyến mãi độc quyền chỉ dành cho thành viên.</p>
          <div className="flex">
            <input type="email" placeholder="Nhập email của bạn..." className="flex-grow px-4 py-3 rounded-l-xl border-y border-l border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-r-xl hover:bg-blue-700 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          {/* Abstract geometric decoration */}
          <div className="relative w-48 h-48">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply opacity-70 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply opacity-70 animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
