import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { requestOTP, resetPassword, resetPasswordState, clearError } from '../redux/passwordSlice';

const inputClass = "w-full h-10 px-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { step, email: savedEmail, loading, error, successMessage } = useSelector((state) => state.password);

  const [inputEmail, setInputEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    return () => { dispatch(resetPasswordState()); };
  }, [dispatch]);

  const handleRequestOTP = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!inputEmail) { setLocalError('Vui lòng nhập email'); return; }
    dispatch(requestOTP(inputEmail));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLocalError('');
    if (newPassword !== confirmPassword) { setLocalError('Mật khẩu xác nhận không khớp'); return; }
    if (newPassword.length < 6) { setLocalError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    dispatch(resetPassword({ email: savedEmail, otp, newPassword }));
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
              Khôi phục<br />
              <span className="text-accent-400 italic">tài khoản</span>
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed">
              Nhập email của bạn để nhận mã xác thực.<br />
              Quy trình đặt lại mật khẩu an toàn & nhanh chóng.
            </p>
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

          {step !== 3 ? (
            <>
              <div className="mb-6">
                <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Quên mật khẩu</h1>
                <p className="text-[13px] text-gray-500 mt-1">
                  {step === 1 ? 'Nhập email để nhận mã OTP xác thực' : 'Nhập mã OTP và mật khẩu mới của bạn'}
                </p>
              </div>

              {displayError && (
                <div className="border-l-[3px] border-danger-500 bg-danger-50 rounded-md px-4 py-3 text-[13px] text-danger-700 mb-4">
                  {displayError}
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-2 border-l-[3px] border-success-500 bg-success-50 rounded-md px-4 py-3 text-[13px] text-success-700 mb-4">
                  <CheckCircle size={14} strokeWidth={2} />
                  {successMessage}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Email của bạn</label>
                    <div className="relative">
                      <Mail size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type="email" value={inputEmail}
                        onChange={e => { setInputEmail(e.target.value); dispatch(clearError()); setLocalError(''); }}
                        placeholder="email@company.com" required
                        className="w-full h-10 pl-9 pr-3 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-10 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors">
                    {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Mã OTP</label>
                    <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required
                      placeholder="Nhập mã 6 chữ số"
                      className="w-full h-10 px-3 text-[13px] text-center font-mono tracking-[.25em] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors" />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                    <div className="relative">
                      <Lock size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        placeholder="Ít nhất 6 ký tự" required
                        className="w-full h-10 pl-9 pr-10 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors" />
                      <button type="button" onClick={() => setShowPw(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <Lock size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới" required
                        className="w-full h-10 pl-9 pr-10 text-[13px] border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-100 transition-colors" />
                      <button type="button" onClick={() => setShowConfirm(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full h-10 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors">
                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-navy-700 transition-colors">
                  <ArrowLeft size={13} strokeWidth={2} /> Quay lại đăng nhập
                </Link>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center space-y-5">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={24} strokeWidth={1.75} className="text-success-600" />
              </div>
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900">Đặt lại thành công</h2>
                <p className="text-[13px] text-gray-500 mt-1">Mật khẩu mới của bạn đã được cập nhật.</p>
              </div>
              <Link to="/login"
                className="block w-full h-10 bg-accent-600 hover:bg-accent-700 text-white text-[13px] font-semibold rounded-md transition-colors flex items-center justify-center">
                Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
