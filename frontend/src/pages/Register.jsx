import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { registerThunk } from '../redux/authSlice';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { setLocalError('Email không hợp lệ'); return; }
    if (form.password.length < 8) { setLocalError('Mật khẩu phải có ít nhất 8 ký tự'); return; }
    if (form.password !== form.confirmPassword) { setLocalError('Mật khẩu xác nhận không khớp'); return; }

    const result = await dispatch(registerThunk({ name: form.name, email: form.email, password: form.password }));
    if (registerThunk.fulfilled.match(result)) {
      navigate('/verify-otp', { state: { email: form.email } });
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[55%] bg-navy-950 flex-col">
        <div className="px-10 pt-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-navy-700 rounded-md flex items-center justify-center text-white text-[13px] font-bold">A</div>
            <span className="text-white font-semibold text-[15px] tracking-wide">ATRIA</span>
          </div>
        </div>
        <div className="flex-1 flex items-center px-16">
          <div>
            <h2 className="text-[36px] font-bold text-white leading-[1.15] mb-4">
              Tạo tài khoản<br />
              <span className="text-accent-400 italic">doanh nghiệp</span>
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-xs">
              Nền tảng HRM chuyên nghiệp dành cho doanh nghiệp Việt Nam.
            </p>
            <div className="mt-8 space-y-3">
              {['Quản lý nhân sự tập trung', 'Chấm công & tính lương tự động', 'Phê duyệt đơn từ theo chuỗi'].map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <span className="text-white/70 text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-navy-700 rounded-md flex items-center justify-center text-white text-[13px] font-bold">A</div>
            <span className="text-gray-900 font-semibold text-[15px]">ATRIA</span>
          </div>

          <div className="mb-6">
            <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Tạo tài khoản</h1>
            <p className="text-[13px] text-gray-500 mt-1">Điền thông tin để bắt đầu sử dụng ATRIA HRM</p>
          </div>

          {displayError && (
            <div className="border-l-[3px] border-danger-500 bg-danger-50 rounded-md px-4 py-3 text-[13px] text-danger-700 mb-4">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Họ và tên</label>
              <div className="relative">
                <User size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Nguyễn Văn A"
                  className="w-full h-10 pl-9 pr-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="email@company.com"
                  className="w-full h-10 pl-9 pr-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                  placeholder="Ít nhất 8 ký tự"
                  className="w-full h-10 pl-9 pr-10 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors" />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                  placeholder="Nhập lại mật khẩu"
                  className="w-full h-10 pl-9 pr-10 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors" />
                <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-10 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors mt-1">
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-gray-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-accent-600 hover:text-accent-700 font-semibold transition-colors">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
