const { User, Contract, TaxInsuranceConfig, Payroll } = require('../models');

exports.calculatePayroll = async (req, res) => {
  try {
    const { month } = req.body; // e.g. "2026-11"
    if (!month) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tháng tính lương (VD: 2026-11)' });
    }

    // Lấy cấu hình thuế bảo hiểm
    const config = await TaxInsuranceConfig.findByPk(1);
    if (!config) {
      return res.status(400).json({ success: false, message: 'Chưa có cấu hình Thuế/Bảo hiểm' });
    }

    // Lấy tất cả nhân viên có hợp đồng
    const users = await User.findAll({
      where: { status: 'active' },
      include: [
        {
          model: Contract,
          as: 'contracts',
          where: { status: 'active' },
          required: false // Lấy cả những user chưa có hợp đồng để log ra nếu cần
        }
      ]
    });

    const results = [];
    let calculatedCount = 0;

    for (const user of users) {
      // Chỉ tính lương cho người có hợp đồng Active
      if (!user.contracts || user.contracts.length === 0) continue;
      
      const contract = user.contracts[0]; // Giả sử lấy hợp đồng active đầu tiên
      const baseSalary = Number(contract.basic_salary) || 0;
      const employeeType = contract.employee_type || 'Full-time';

      // Xóa phiếu lương nháp cũ của tháng này nếu có
      await Payroll.destroy({
        where: { user_id: user.id, month, status: 'draft' }
      });

      // Kiểm tra xem đã duyệt/đã trả chưa
      const existing = await Payroll.findOne({
        where: { user_id: user.id, month }
      });
      if (existing) {
        // Đã duyệt hoặc trả -> bỏ qua không tính lại
        continue;
      }

      // Khởi tạo các khoản phụ (sau này có thể query từ bảng Allowance/Bonus/Advance)
      let allowance = 0;
      let bonus = 0;
      let deduction = 0;
      let advance = 0;

      let insuranceEmployee = 0;
      let tax = 0;

      // Tính bảo hiểm
      if (employeeType === 'Full-time') {
        const insuranceSalary = Math.min(baseSalary, Number(config.max_insurance_salary));
        const totalInsuranceRate = Number(config.social_insurance_rate) + Number(config.health_insurance_rate) + Number(config.unemployment_insurance_rate);
        insuranceEmployee = (insuranceSalary * totalInsuranceRate) / 100;
      }

      // Tính thu nhập chịu thuế
      const taxableIncome = baseSalary + allowance + bonus - deduction - insuranceEmployee - Number(config.personal_deduction);

      // Tính thuế
      if (employeeType === 'Freelancer') {
        // Freelancer khấu trừ cứng 10%
        tax = (baseSalary + allowance + bonus) * 0.1;
      } else {
        // Tính thuế bậc thang cơ bản
        if (taxableIncome > 0) {
          if (taxableIncome <= 5000000) tax = taxableIncome * 0.05;
          else if (taxableIncome <= 10000000) tax = 250000 + (taxableIncome - 5000000) * 0.1;
          else if (taxableIncome <= 18000000) tax = 750000 + (taxableIncome - 10000000) * 0.15;
          else if (taxableIncome <= 32000000) tax = 1950000 + (taxableIncome - 18000000) * 0.2;
          else tax = 4750000 + (taxableIncome - 32000000) * 0.25; // Giản lược
        }
      }

      // Lương thực nhận
      const netSalary = baseSalary + allowance + bonus - deduction - advance - insuranceEmployee - tax;

      const payroll = await Payroll.create({
        user_id: user.id,
        month,
        base_salary: baseSalary,
        allowance,
        bonus,
        deduction,
        advance,
        insurance_company: 0, // Tính sau
        insurance_employee: insuranceEmployee,
        tax,
        net_salary: netSalary > 0 ? netSalary : 0,
        status: 'draft'
      });

      results.push(payroll);
      calculatedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Đã tính lương nháp thành công cho ${calculatedCount} nhân sự`,
      data: results
    });

  } catch (error) {
    console.error('Lỗi tính lương:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tính lương' });
  }
};

exports.getPayrollsByMonth = async (req, res) => {
  try {
    const { month } = req.query;
    const whereClause = {};
    if (month) whereClause.month = month;

    const payrolls = await Payroll.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getMyPayrolls = async (req, res) => {
  try {
    const userId = req.user.id;
    const payrolls = await Payroll.findAll({
      where: { 
        user_id: userId,
        // Chỉ cho phép xem lương đã duyệt hoặc đã trả
        status: ['approved', 'paid']
      },
      order: [['month', 'DESC']]
    });
    
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    console.error('Lỗi khi lấy phiếu lương cá nhân:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
