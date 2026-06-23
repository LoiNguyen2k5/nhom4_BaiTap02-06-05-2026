import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicJobById, applyToJob } from '../../services/publicJob.service';

const EMPLOYMENT_TYPE_LABEL = {
  fulltime: 'Toàn thời gian',
  parttime: 'Bán thời gian',
  internship: 'Thực tập',
};

const JobDetailApplyPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience_years: '',
    skills: '',
    note: '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    getPublicJobById(id)
      .then((res) => setJob(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoadingJob(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Họ tên là bắt buộc';
    if (!form.email.trim()) errs.email = 'Email là bắt buộc';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không hợp lệ';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('email', form.email.trim());
    if (form.phone) formData.append('phone', form.phone.trim());
    if (form.experience_years) formData.append('experience_years', form.experience_years);
    if (form.skills) {
      const skillsArr = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      formData.append('skills', JSON.stringify(skillsArr));
    }
    if (form.note) formData.append('note', form.note.trim());
    if (cvFile) formData.append('cv_file', cvFile);

    setSubmitting(true);
    try {
      await applyToJob(id, formData);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-600">Tin tuyển dụng không tồn tại hoặc đã đóng.</p>
        <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:underline">
          Xem danh sách việc làm khác
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Nộp hồ sơ thành công!</h2>
        <p className="mt-2 text-gray-500">
          Chúng tôi đã nhận được hồ sơ của bạn cho vị trí <strong>{job.title}</strong>.
          Email xác nhận đã được gửi đến hộp thư của bạn.
        </p>
        <Link
          to="/jobs"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Xem việc làm khác
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/jobs" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        &larr; Quay lại danh sách
      </Link>

      {/* Job Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
        <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
          {job.department && <span>{job.department}</span>}
          {job.location && <span>&bull; {job.location}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {EMPLOYMENT_TYPE_LABEL[job.employment_type] || job.employment_type}
          </span>
          {job.salary_range && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {job.salary_range}
            </span>
          )}
          {job.deadline && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
        {job.description && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Mô tả công việc</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>
        )}
        {job.requirements && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Yêu cầu</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{job.requirements}</p>
          </div>
        )}
      </div>

      {/* Apply Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Điền thông tin ứng tuyển</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.name ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.email ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0901 234 567"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số năm kinh nghiệm</label>
              <input
                type="number"
                name="experience_years"
                value={form.experience_years}
                onChange={handleChange}
                min="0"
                max="50"
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kỹ năng <span className="text-gray-400 font-normal">(phân cách bằng dấu phẩy)</span>
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MySQL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thư giới thiệu</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={4}
              placeholder="Giới thiệu ngắn về bản thân và lý do ứng tuyển..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File CV <span className="text-gray-400 font-normal">(PDF hoặc Word, tối đa 5MB)</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {cvFile && (
              <p className="mt-1 text-xs text-gray-500">
                Đã chọn: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Đang gửi...' : 'Nộp hồ sơ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobDetailApplyPage;
