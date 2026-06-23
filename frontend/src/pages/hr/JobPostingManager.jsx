import { useEffect, useState } from 'react';
import {
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from '../../services/jobPosting.service';

const EMPLOYMENT_TYPE_LABEL = {
  fulltime: 'Toàn thời gian',
  parttime: 'Bán thời gian',
  internship: 'Thực tập',
};

const EMPTY_FORM = {
  title: '',
  department: '',
  location: '',
  description: '',
  requirements: '',
  salary_range: '',
  employment_type: 'fulltime',
  deadline: '',
  is_active: true,
};

const JobPostingManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobs = () => {
    setLoading(true);
    getJobPostings()
      .then((res) => setJobs(res.data || []))
      .catch(() => setError('Không thể tải danh sách tin tuyển dụng'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const openCreate = () => {
    setEditingJob(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      description: job.description || '',
      requirements: job.requirements || '',
      salary_range: job.salary_range || '',
      employment_type: job.employment_type || 'fulltime',
      deadline: job.deadline ? job.deadline.substring(0, 10) : '',
      is_active: job.is_active !== false,
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Tiêu đề vị trí là bắt buộc');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingJob) {
        await updateJobPosting(editingJob.id, form);
        setSuccessMsg('Cập nhật tin tuyển dụng thành công');
      } else {
        await createJobPosting(form);
        setSuccessMsg('Tạo tin tuyển dụng thành công');
      }
      setShowModal(false);
      fetchJobs();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Xóa tin tuyển dụng "${job.title}"?`)) return;
    try {
      await deleteJobPosting(job.id);
      setSuccessMsg('Đã xóa tin tuyển dụng');
      fetchJobs();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setError('Không thể xóa tin tuyển dụng');
    }
  };

  const handleToggleActive = async (job) => {
    try {
      await updateJobPosting(job.id, { is_active: !job.is_active });
      fetchJobs();
    } catch {
      setError('Không thể cập nhật trạng thái');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tuyển dụng</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và quản lý các vị trí đang tuyển dụng cho cổng nộp CV công khai</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Tạo tin mới
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {error && !showModal && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Chưa có tin tuyển dụng nào.</p>
          <button onClick={openCreate} className="mt-3 text-blue-600 hover:underline text-sm">
            Tạo tin đầu tiên
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vị trí</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phòng ban</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hạn nộp</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{job.title}</p>
                    {job.location && <p className="text-xs text-gray-400">{job.location}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{job.department || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                      {EMPLOYMENT_TYPE_LABEL[job.employment_type] || job.employment_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(job)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {job.is_active ? 'Đang tuyển' : 'Đã đóng'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(job)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(job)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tạo/sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingJob ? 'Sửa tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                &times;
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên vị trí <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Frontend Developer"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Kỹ thuật"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu</label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức lương</label>
                  <input
                    name="salary_range"
                    value={form.salary_range}
                    onChange={handleChange}
                    placeholder="15 - 20 triệu"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
                  <select
                    name="employment_type"
                    value={form.employment_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fulltime">Toàn thời gian</option>
                    <option value="parttime">Bán thời gian</option>
                    <option value="internship">Thực tập</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạn nộp hồ sơ</label>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Đang tuyển dụng
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {saving ? 'Đang lưu...' : editingJob ? 'Cập nhật' : 'Tạo tin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostingManager;
