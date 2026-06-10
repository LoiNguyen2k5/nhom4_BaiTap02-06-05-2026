const { Task, Attendance, PerformanceReview, PromotionProposal, User } = require('../models');

exports.getDashboardData = async (req, res) => {
  try {
    // Determine the target user. An employee checks their own, HR/Manager can check others.
    const userId = req.params.userId || req.user.id;
    const { month, year } = req.query;

    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // 1. Task Statistics
    const tasks = await Task.findAll({ where: { assignee_id: userId } });
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
    };

    // 2. Attendance Statistics
    const attendances = await Attendance.findAll({ where: { user_id: userId } });
    const attendanceStats = {
      workingDays: attendances.filter(a => a.status === 'Present').length,
      lateDays: attendances.filter(a => a.status === 'Late').length,
      leaveDays: attendances.filter(a => a.status === 'OnLeave').length,
      absentDays: attendances.filter(a => a.status === 'Absent').length,
    };

    // 3. Latest Performance Reviews
    const reviews = await PerformanceReview.findAll({
      where: { user_id: userId },
      order: [['year', 'DESC'], ['month', 'DESC']],
      limit: 5,
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'email'] }]
    });

    res.json({
      success: true,
      data: {
        taskStats,
        attendanceStats,
        reviews,
        currentMonth,
        currentYear
      }
    });

  } catch (error) {
    console.error('getDashboardData error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Forbidden: Manager role required' });
    }
    const { user_id, month, year, rating, kpi_score, comments } = req.body;
    
    // Check if review already exists
    let review = await PerformanceReview.findOne({ where: { user_id, month, year } });
    if (review) {
      review.rating = rating;
      review.kpi_score = kpi_score;
      review.comments = comments;
      review.reviewer_id = req.user.id;
      await review.save();
    } else {
      review = await PerformanceReview.create({
        user_id,
        reviewer_id: req.user.id,
        month,
        year,
        rating,
        kpi_score,
        comments
      });
    }

    res.json({ success: true, data: review, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('submitReview error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createPromotionProposal = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Forbidden: Manager role required' });
    }
    const { user_id, current_position, proposed_position, reason } = req.body;

    const proposal = await PromotionProposal.create({
      user_id,
      proposed_by: req.user.id,
      current_position,
      proposed_position,
      reason,
      status: 'Pending'
    });

    res.json({ success: true, data: proposal, message: 'Proposal created' });
  } catch (error) {
    console.error('createPromotionProposal error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getPromotionProposals = async (req, res) => {
  try {
    if (req.user.role !== 'manager' && req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({ success: false, message: 'Forbidden: Role required' });
    }
    const proposals = await PromotionProposal.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'proposer', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: proposals });
  } catch (error) {
    console.error('getPromotionProposals error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updatePromotionStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'hr') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin or HR role required' });
    }
    const { id } = req.params;
    const { status } = req.body;

    const proposal = await PromotionProposal.findByPk(id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    proposal.status = status;
    await proposal.save();

    res.json({ success: true, data: proposal, message: 'Status updated' });
  } catch (error) {
    console.error('updatePromotionStatus error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: 'employee' },
      attributes: ['id', 'name', 'email', 'status']
    });
    res.json({ success: true, data: employees });
  } catch (error) {
    console.error('getAllEmployees error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
