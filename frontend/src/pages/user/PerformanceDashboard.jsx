import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import performanceService from '../../services/performance.service';
import './PerformanceDashboard.css';

const PerformanceDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await performanceService.getDashboardData();
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (!data) return <div className="p-4">Không có dữ liệu.</div>;

  const { taskStats, attendanceStats, reviews } = data;
  const latestReview = reviews.length > 0 ? reviews[0] : null;

  return (
    <div className="performance-dashboard p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Hiệu Quả Công Việc</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Task Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            Thống kê Task
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card bg-blue-50">
              <span className="stat-label">Tổng giao</span>
              <span className="stat-value text-blue-600">{taskStats.total}</span>
            </div>
            <div className="stat-card bg-green-50">
              <span className="stat-label">Hoàn thành</span>
              <span className="stat-value text-green-600">{taskStats.completed}</span>
            </div>
            <div className="stat-card bg-red-50">
              <span className="stat-label">Trễ hạn</span>
              <span className="stat-value text-red-600">{taskStats.overdue}</span>
            </div>
            <div className="stat-card bg-yellow-50">
              <span className="stat-label">Đang làm</span>
              <span className="stat-value text-yellow-600">{taskStats.inProgress}</span>
            </div>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            Chuyên cần
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card bg-green-50">
              <span className="stat-label">Ngày công</span>
              <span className="stat-value text-green-600">{attendanceStats.workingDays}</span>
            </div>
            <div className="stat-card bg-yellow-50">
              <span className="stat-label">Đi trễ</span>
              <span className="stat-value text-yellow-600">{attendanceStats.lateDays}</span>
            </div>
            <div className="stat-card bg-purple-50">
              <span className="stat-label">Nghỉ phép</span>
              <span className="stat-value text-purple-600">{attendanceStats.leaveDays}</span>
            </div>
            <div className="stat-card bg-red-50">
              <span className="stat-label">Vắng mặt</span>
              <span className="stat-value text-red-600">{attendanceStats.absentDays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI & Review Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          Đánh giá KPI & Nhận xét
        </h3>
        
        {latestReview ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="kpi-score flex-1 flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-500 uppercase">Điểm KPI Tháng {latestReview.month}/{latestReview.year}</span>
              <span className="text-5xl font-bold text-purple-600 my-2">{latestReview.kpi_score}</span>
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                latestReview.rating === 'A' ? 'bg-green-100 text-green-800' :
                latestReview.rating === 'B' ? 'bg-blue-100 text-blue-800' :
                latestReview.rating === 'C' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Xếp loại {latestReview.rating}
              </span>
            </div>
            <div className="review-comments flex-2 flex flex-col justify-center">
              <h4 className="font-semibold text-gray-700 mb-2">Nhận xét từ Quản lý:</h4>
              <p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg border-l-4 border-purple-300">
                "{latestReview.comments || 'Không có nhận xét'}"
              </p>
              <span className="text-sm text-gray-500 mt-2 block">
                Người đánh giá: {latestReview.reviewer?.username || 'HR/Manager'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
            Chưa có đánh giá KPI nào trong hệ thống.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;
