import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle, LogOut, Calendar, RefreshCw, Camera, AlertTriangle } from 'lucide-react';
import * as faceapi from 'face-api.js';
import attendanceService from '../../services/attendance.service';
import Badge from '../../components/ui/Badge';

const AttendancePage = () => {
  const [time, setTime] = useState(new Date());
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Face API & Status states
  const [isFaceRegistered, setIsFaceRegistered] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [todayStatus, setTodayStatus] = useState('idle'); // idle | checked_in | done
  const [mode, setMode] = useState('idle'); // idle | registering | scanning

  const videoRef = useRef();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // Load AI Models
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        setModelsLoaded(true);

        // Check Registration Status
        const regRes = await attendanceService.checkFaceRegistered();
        setIsFaceRegistered(regRes.data.isRegistered);

        // Fetch History
        const histRes = await attendanceService.getMyHistory();
        setHistory(histRes.data.data);
        determineTodayStatus(histRes.data.data);

      } catch (err) {
        console.error('Lỗi khởi tạo:', err);
        setError('Có lỗi khi tải dữ liệu hoặc Models AI.');
      } finally {
        setLoading(false);
      }
    };
    init();
    // Tắt camera khi người dùng rời trang
    return () => stopVideo();
  }, []);

  const determineTodayStatus = (logs) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(l => l.date === todayStr);

    if (!todayLog) {
      setTodayStatus('idle');
    } else if (todayLog.check_in_time && !todayLog.check_out_time) {
      setTodayStatus('checked_in');
    } else if (todayLog.check_out_time) {
      setTodayStatus('done');
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Không thể mở Camera. Vui lòng cấp quyền truy cập Camera.');
      });
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const getFaceDescriptor = async () => {
    if (!videoRef.current) return null;
    const detection = await faceapi.detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection ? Array.from(detection.descriptor) : null;
  };

  const handleRegisterFace = async () => {
    setError('');
    setSuccessMsg('');
    setMode('registering');
    startVideo();
  };

  const submitFaceRegistration = async () => {
    setError('');
    setActionLoading(true);
    try {
      const descriptor = await getFaceDescriptor();
      if (!descriptor) {
        setError('Không nhận diện được khuôn mặt. Hãy nhìn thẳng vào camera.');
        setActionLoading(false);
        return;
      }
      
      await attendanceService.registerFace({ face_descriptor: descriptor });
      setSuccessMsg('Đăng ký khuôn mặt thành công!');
      setIsFaceRegistered(true);
      setMode('idle');
      stopVideo();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi khi đăng ký khuôn mặt.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAttendanceClick = () => {
    setError('');
    setSuccessMsg('');
    setMode('scanning');
    startVideo();
  };

  const executeAttendance = async () => {
    setError('');
    setActionLoading(true);

    // 1. Quét mặt
    const descriptor = await getFaceDescriptor();
    if (!descriptor) {
      setError('Không nhận diện được khuôn mặt. Vui lòng thử lại.');
      setActionLoading(false);
      return;
    }

    // 2. Chấm công
    try {
      const payload = {
        face_descriptor: descriptor
      };

      if (todayStatus === 'idle') {
        await attendanceService.checkIn(payload);
        setSuccessMsg('Check-in thành công!');
      } else if (todayStatus === 'checked_in') {
        await attendanceService.checkOut(payload);
        setSuccessMsg('Check-out thành công!');
      }
      
      stopVideo();
      setMode('idle');
      
      const histRes = await attendanceService.getMyHistory();
      setHistory(histRes.data.data);
      determineTodayStatus(histRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi chấm công.');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelAction = () => {
    stopVideo();
    setMode('idle');
    setError('');
  };

  const formatTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading || (!modelsLoaded && !error)) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <RefreshCw size={32} className="animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500">Đang tải dữ liệu và Models AI...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-[-0.01em]">Chấm công</h1>
        <p className="text-sm text-gray-500 mt-0.5">Xác thực khuôn mặt bằng AI</p>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle size={18} />
          <p className="text-sm font-medium">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Widget chấm công */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 relative flex-1 min-h-100">
            
            {/* Chế độ Camera đang tắt */}
            {mode === 'idle' && (
              <>
                <div className="text-center mt-6 mb-8">
                  <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">
                    {time.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="font-mono text-5xl font-bold tracking-tight text-navy-900">
                    {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>

                {!isFaceRegistered ? (
                  <div className="text-center">
                    <div className="bg-warning-50 p-4 rounded-xl mb-6 border border-warning-100">
                      <p className="text-warning-800 text-sm font-medium mb-2">Bạn chưa đăng ký khuôn mặt!</p>
                      <p className="text-warning-600 text-xs">Vui lòng đăng ký dữ liệu khuôn mặt để có thể sử dụng chức năng chấm công.</p>
                    </div>
                    <button
                      onClick={handleRegisterFace}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Camera size={18} />
                      Đăng ký khuôn mặt
                    </button>
                  </div>
                ) : todayStatus === 'done' ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-success-50 border border-success-100 rounded-2xl w-full">
                    <CheckCircle size={40} className="text-success-500 mb-3" />
                    <h3 className="text-success-900 font-bold text-lg mb-1">Đã hoàn thành!</h3>
                    <p className="text-success-700 text-sm">Bạn đã chấm công đầy đủ ngày hôm nay.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleAttendanceClick}
                    className={`group relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.1)]
                      ${todayStatus === 'idle'
                        ? 'bg-gradient-to-b from-navy-600 to-navy-900 hover:shadow-[0_0_60px_rgba(11,31,61,0.4)] hover:-translate-y-1'
                        : 'bg-gradient-to-b from-accent-500 to-accent-700 hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] hover:-translate-y-1'
                      }`}
                  >
                    <div className="absolute inset-1 rounded-full border-2 border-white/20"></div>
                    {todayStatus === 'idle' ? (
                      <>
                        <Clock size={40} strokeWidth={2.5} className="text-white mb-2" />
                        <span className="text-white font-bold text-xl uppercase tracking-wider">Check In</span>
                      </>
                    ) : (
                      <>
                        <LogOut size={40} strokeWidth={2.5} className="text-white mb-2" />
                        <span className="text-white font-bold text-xl uppercase tracking-wider">Check Out</span>
                      </>
                    )}
                  </button>
                )}

                {/* Nút đăng ký lại khi đã đăng ký rồi */}
                {mode === 'idle' && isFaceRegistered && (
                  <button
                    onClick={handleRegisterFace}
                    className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors border border-gray-200 hover:border-indigo-200"
                  >
                    <Camera size={14} />
                    Cập nhật mặt
                  </button>
                )}
              </>
            )}

            {/* Chế độ Camera bật */}
            {mode !== 'idle' && (
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black mb-6">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                    onPlay={() => {}}
                  />
                  {/* Khung ngắm */}
                  <div className="absolute inset-0 border-4 border-white/30 rounded-2xl m-4 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-success-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-success-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-success-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-success-500"></div>
                  </div>
                </div>

                <div className="flex w-full gap-3">
                  <button
                    onClick={cancelAction}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={mode === 'registering' ? submitFaceRegistration : executeAttendance}
                    disabled={actionLoading}
                    className="flex-[2] flex items-center justify-center py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors"
                  >
                    {actionLoading ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : mode === 'registering' ? (
                      'Xác nhận đăng ký'
                    ) : (
                      'Chụp & Chấm công'
                    )}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Bảng lịch sử */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                Lịch sử gần đây
              </h2>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto max-h-100 custom-scrollbar flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Ngày</th>
                    <th className="px-6 py-4 font-semibold">Giờ vào</th>
                    <th className="px-6 py-4 font-semibold">Giờ ra</th>
                    <th className="px-6 py-4 font-semibold">Tổng (Giờ)</th>
                    <th className="px-6 py-4 font-semibold text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.length > 0 ? history.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${record.check_in_time ? 'bg-success-500' : 'bg-gray-300'}`}></div>
                          {formatTime(record.check_in_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${record.check_out_time ? 'bg-danger-500' : 'bg-gray-300'}`}></div>
                          {formatTime(record.check_out_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-gray-700">
                        {record.work_hours !== null && record.work_hours !== undefined ? record.work_hours : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge
                          variant={
                            record.status === 'Present' ? 'success' :
                            record.status === 'Late'    ? 'warning' :
                            record.status === 'OnLeave' ? 'info'    : 'danger'
                          }
                        >
                          {record.status === 'Present' ? 'Có mặt'   :
                           record.status === 'Late'    ? 'Đi trễ'   :
                           record.status === 'OnLeave' ? 'Nghỉ phép' :
                           record.status === 'Absent'  ? 'Vắng mặt' : record.status}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        Chưa có lịch sử chấm công nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
