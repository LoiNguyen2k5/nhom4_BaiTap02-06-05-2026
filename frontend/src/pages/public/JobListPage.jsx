import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicJobs } from '../../services/publicJob.service';

const EMPLOYMENT_TYPE_LABEL = {
  fulltime: 'Toàn thời gian',
  parttime: 'Bán thời gian',
  internship: 'Thực tập',
};

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicJobs()
      .then((res) => setJobs(res.data || []))
      .catch(() => setError('Không thể tải danh sách việc làm. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">{error}</div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cơ hội nghề nghiệp</h1>
        <p className="mt-2 text-gray-500">
          {jobs.length > 0
            ? `Hiện có ${jobs.length} vị trí đang tuyển dụng`
            : 'Hiện chưa có vị trí nào đang tuyển dụng'}
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Chưa có tin tuyển dụng nào.</p>
          <p className="mt-2 text-sm">Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                    {job.department && <span>{job.department}</span>}
                    {job.location && (
                      <>
                        {job.department && <span>&bull;</span>}
                        <span>{job.location}</span>
                      </>
                    )}
                  </div>
                  {job.description && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {EMPLOYMENT_TYPE_LABEL[job.employment_type] || job.employment_type}
                    </span>
                    {job.salary_range && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {job.salary_range}
                      </span>
                    )}
                    {job.deadline && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    to={`/jobs/${job.id}/apply`}
                    className="inline-block bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ứng tuyển ngay
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListPage;
