import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PRODUCT = {
  id: 1,
  name: 'Tai nghe Bluetooth Pro',
  price: '1,200,000đ',
  originalPrice: '1,500,000đ',
  discount: '20%',
  category: 'Âm thanh',
  rating: 4.8,
  reviews: 124,
  sold: 856,
  stock: 45,
  description: 'Trải nghiệm âm thanh tuyệt đỉnh với tai nghe Bluetooth Pro thế hệ mới. Khử tiếng ồn chủ động (ANC), thời lượng pin lên đến 30 giờ, thiết kế tiện dụng cho cảm giác thoải mái khi đeo cả ngày.',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&q=80',
  ]
};

const SIMILAR_PRODUCTS = [
  { id: 3, name: 'Loa không dây Bass+', price: '850,000đ', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', rating: 4.5 },
  { id: 4, name: 'Bàn phím cơ RGB', price: '1,450,000đ', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', rating: 4.7 },
  { id: 5, name: 'Chuột Gaming Siêu Nhẹ', price: '950,000đ', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80', rating: 4.8 },
  { id: 6, name: 'Màn hình 27" 4K', price: '7,800,000đ', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80', rating: 4.9 },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < PRODUCT.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link to="/home" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/search" className="hover:text-blue-600 transition-colors">{PRODUCT.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate">{PRODUCT.name}</span>
      </nav>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images - Swiper */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[Navigation, Thumbs]}
                className="aspect-square"
              >
                {PRODUCT.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            <div className="h-24">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="h-full"
              >
                {PRODUCT.images.map((img, index) => (
                  <SwiperSlide key={index} className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-300 transition-colors [&.swiper-slide-thumb-active]:border-blue-600">
                    <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{PRODUCT.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center text-yellow-400">
                <Star className="fill-current" size={18} />
                <Star className="fill-current" size={18} />
                <Star className="fill-current" size={18} />
                <Star className="fill-current" size={18} />
                <Star className="fill-current text-gray-300" size={18} />
                <span className="text-gray-900 font-medium ml-2">{PRODUCT.rating}</span>
                <span className="text-gray-500 ml-1">({PRODUCT.reviews} đánh giá)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="text-gray-600 font-medium">{PRODUCT.sold} <span className="text-gray-500 font-normal">Đã bán</span></span>
            </div>

            <div className="mb-6 flex items-end gap-4">
              <span className="text-3xl font-extrabold text-blue-600">{PRODUCT.price}</span>
              <span className="text-lg text-gray-400 line-through mb-1">{PRODUCT.originalPrice}</span>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded mb-1">-{PRODUCT.discount}</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{PRODUCT.description}</p>

            <hr className="border-gray-200 mb-8" />

            {/* Quantity Selector */}
            <div className="mb-8">
              <span className="block text-sm font-medium text-gray-700 mb-3">Số lượng</span>
              <div className="flex items-center space-x-6">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden h-12 w-36">
                  <button onClick={handleDecrease} className="px-3 h-full hover:bg-gray-100 text-gray-600 transition-colors flex-1 flex justify-center items-center" disabled={quantity <= 1}>
                    <Minus size={18} />
                  </button>
                  <input 
                    type="text" 
                    className="w-12 text-center font-medium border-x border-gray-300 h-full focus:outline-none" 
                    value={quantity} 
                    readOnly 
                  />
                  <button onClick={handleIncrease} className="px-3 h-full hover:bg-gray-100 text-gray-600 transition-colors flex-1 flex justify-center items-center" disabled={quantity >= PRODUCT.stock}>
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">{PRODUCT.stock} sản phẩm có sẵn</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-auto">
              <button className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-100 transition-colors">
                <ShoppingCart size={20} />
                <span>Thêm vào giỏ</span>
              </button>
              <button className="flex-1 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl shadow-blue-200">
                Mua ngay
              </button>
              <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center">
                <Heart size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="text-green-500" size={24} />
                <span className="text-xs text-gray-600">Bảo hành 100%<br/>Chính hãng</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 border-x border-gray-100 px-2">
                <Truck className="text-blue-500" size={24} />
                <span className="text-xs text-gray-600">Giao hàng<br/>Toàn quốc</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RotateCcw className="text-orange-500" size={24} />
                <span className="text-xs text-gray-600">Đổi trả trong<br/>7 ngày</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Similar Products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIMILAR_PRODUCTS.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-gray-50">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate hover:text-blue-600 transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                </div>
                <p className="text-blue-600 font-bold text-lg">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProductDetail;
