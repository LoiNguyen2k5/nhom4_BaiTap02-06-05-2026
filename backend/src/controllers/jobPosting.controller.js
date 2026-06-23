const JobPosting = require('../entities/JobPosting.entity');

const getJobPostings = async (req, res) => {
  try {
    const jobs = await JobPosting.findAll({ order: [['created_at', 'DESC']] });
    return res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('getJobPostings error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getJobPostingById = async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    return res.json({ success: true, data: job });
  } catch (error) {
    console.error('getJobPostingById error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const createJobPosting = async (req, res) => {
  try {
    const { title, department, location, description, requirements, salary_range, employment_type, deadline, is_active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Tiêu đề vị trí là bắt buộc' });
    }
    const job = await JobPosting.create({
      title: title.trim(),
      department: department || null,
      location: location || null,
      description: description || null,
      requirements: requirements || null,
      salary_range: salary_range || null,
      employment_type: employment_type || 'fulltime',
      deadline: deadline || null,
      is_active: is_active !== undefined ? is_active : true,
      created_by: req.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return res.status(201).json({ success: true, data: job, message: 'Tạo tin tuyển dụng thành công' });
  } catch (error) {
    console.error('createJobPosting error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    const { title, department, location, description, requirements, salary_range, employment_type, deadline, is_active } = req.body;
    await job.update({
      title: title !== undefined ? title.trim() : job.title,
      department: department !== undefined ? department : job.department,
      location: location !== undefined ? location : job.location,
      description: description !== undefined ? description : job.description,
      requirements: requirements !== undefined ? requirements : job.requirements,
      salary_range: salary_range !== undefined ? salary_range : job.salary_range,
      employment_type: employment_type !== undefined ? employment_type : job.employment_type,
      deadline: deadline !== undefined ? deadline : job.deadline,
      is_active: is_active !== undefined ? is_active : job.is_active,
      updated_at: new Date(),
    });
    return res.json({ success: true, data: job, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('updateJobPosting error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await job.destroy();
    return res.json({ success: true, message: 'Xóa tin tuyển dụng thành công' });
  } catch (error) {
    console.error('deleteJobPosting error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getJobPostings, getJobPostingById, createJobPosting, updateJobPosting, deleteJobPosting };
