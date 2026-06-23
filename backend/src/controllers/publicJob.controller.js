const { Op } = require('sequelize');
const JobPosting = require('../entities/JobPosting.entity');
const Candidate = require('../entities/Candidate.entity');
const { sendApplicationConfirmEmail } = require('../utils/mailer');

const getPublicJobs = async (req, res) => {
  try {
    const where = {
      is_active: true,
      [Op.or]: [
        { deadline: null },
        { deadline: { [Op.gte]: new Date() } },
      ],
    };
    const jobs = await JobPosting.findAll({
      where,
      attributes: ['id', 'title', 'department', 'location', 'salary_range', 'employment_type', 'deadline', 'description'],
      order: [['created_at', 'DESC']],
    });
    return res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('getPublicJobs error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getPublicJobById = async (req, res) => {
  try {
    const job = await JobPosting.findOne({
      where: { id: req.params.id, is_active: true },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng' });
    }
    return res.json({ success: true, data: job });
  } catch (error) {
    console.error('getPublicJobById error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const applyToJob = async (req, res) => {
  try {
    const job = await JobPosting.findOne({
      where: { id: req.params.id, is_active: true },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Tin tuyển dụng không tồn tại hoặc đã đóng' });
    }

    const { name, email, phone, experience_years, skills, note } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Họ tên là bắt buộc' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email là bắt buộc' });
    }

    let parsedSkills = [];
    if (skills) {
      try {
        parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch {
        parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const cvFilePath = req.file ? `uploads/cvs/${req.file.filename}` : null;

    const candidate = await Candidate.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      position: job.title,
      skills: parsedSkills,
      experience_years: experience_years ? parseInt(experience_years, 10) : 0,
      source: 'Direct',
      stage: 'new',
      note: note ? note.trim() : null,
      cv_file_path: cvFilePath,
      created_by: null,
    });

    // Gửi email xác nhận — không block response nếu email lỗi
    sendApplicationConfirmEmail(email.trim(), name.trim(), job.title).catch((err) => {
      console.error('sendApplicationConfirmEmail failed:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Nộp hồ sơ thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.',
      data: { id: candidate.id },
    });
  } catch (error) {
    console.error('applyToJob error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại' });
  }
};

module.exports = { getPublicJobs, getPublicJobById, applyToJob };
