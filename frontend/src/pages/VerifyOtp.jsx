import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import axiosClient from '../services/axiosClient';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    setError('');
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...digits];
    pasted.split('').forEach((ch, i) => { newDigits[i] = ch; });
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) { setError('Vui lòng nhập đủ 6 chữ số OTP'); return; }

    setLoading(true);
    setError('');
    try {
      await axiosClient.post('/auth/verify-otp', { email, otp });
      setSuccessMsg('Xác thực thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');
    try {
      await axiosClient.post('/auth/resend-otp', { email });
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi lại OTP. Vui lòng thử lại sau.');
    } finally {
      setResendLoading(false);
    }
  };

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
              Xác thực<br />
              <span className="text-accent-400 italic">tài khoản</span>
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed">
              Nhập mã OTP đã được gửi về email của bạn<br />
              để hoàn tất quá trình đăng ký.
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

          {!successMsg ? (
            <>
              <div className="mb-6">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail size={18} strokeWidth={1.75} className="text-navy-700" />
                </div>
                <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Xác thực tài khoản</h1>
                <p className="text-[13px] text-gray-500 mt-1">
                  Mã OTP đã gửi đến{' '}
                  <span className="font-semibold text-gray-700">{email}</span>
                </p>
              </div>

              {error && (
                <div className="border-l-[3px] border-danger-500 bg-danger-50 rounded-md px-4 py-3 text-[13px] text-danger-700 mb-4">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className={`w-11 h-12 text-center text-[20px] font-bold rounded-md border-2 bg-white transition-all focus:outline-none
                        ${digit
                          ? 'border-navy-700 text-navy-900 bg-navy-50'
                          : 'border-gray-300 text-gray-800 focus:border-navy-700 focus:ring-2 focus:ring-navy-100'
                        }`}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading || !!successMsg}
                  className="w-full h-10 bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors">
                  {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
                </button>
              </form>

              <div className="mt-5 text-center text-[13px] text-gray-500">
                Không nhận được mã?{' '}
                {countdown > 0 ? (
                  <span className="text-gray-400">Gửi lại sau <span className="font-mono font-semibold">{countdown}s</span></span>
                ) : (
                  <button onClick={handleResend} disabled={resendLoading}
                    className="text-accent-600 hover:text-accent-700 font-semibold transition-colors disabled:opacity-50">
                    {resendLoading ? 'Đang gửi...' : 'Gửi lại OTP'}
                  </button>
                )}
              </div>

              <div className="mt-4 text-center">
                <Link to="/register" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-navy-700 transition-colors">
                  <ArrowLeft size={13} strokeWidth={2} /> Quay lại đăng ký
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center space-y-5">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={24} strokeWidth={1.75} className="text-success-600" />
              </div>
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900">Xác thực thành công</h2>
                <p className="text-[13px] text-gray-500 mt-1">Đang chuyển hướng đến trang đăng nhập...</p>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-success-500 animate-[progress_2s_linear]" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
