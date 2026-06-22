const { Contract, User, Profile, Department } = require('../entities');
const { Op } = require('sequelize');

// Lấy danh sách hợp đồng của 1 nhân viên cụ thể (xem lịch sử)
exports.getEmployeeContracts = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Tìm tất cả hợp đồng của user_id này, sắp xếp hợp đồng mới nhất lên đầu
    const contracts = await Contract.findAll({
      where: { user_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role'],
        include: [{ model: Profile }]
      }],
      order: [['start_date', 'DESC']]
    });
    
    res.status(200).json({ contracts });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hợp đồng', error: error.message });
  }
};

// Lấy tất cả hợp đồng (toàn bộ hệ thống)
exports.getAllContracts = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};
    const userWhere = {};
    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    const contracts = await Contract.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role'],
        where: Object.keys(userWhere).length ? userWhere : undefined,
        include: [
          { model: Profile },
          { model: Department, as: 'department', attributes: ['id', 'name'] }
        ]
      }],
      order: [['start_date', 'DESC']]
    });
    res.status(200).json({ contracts });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hợp đồng', error: error.message });
  }
};

// Lấy danh sách tất cả nhân viên
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: ['employee', 'manager', 'accountant', 'hr'] },
      attributes: ['id', 'name', 'email', 'status', 'role'],
      include: [
        { model: Profile },
        { model: Department, as: 'department', attributes: ['id', 'name'] }
      ]
    });
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên', error: error.message });
  }
};


// Tạo hợp đồng mới (thử việc hoặc chính thức)
exports.createContract = async (req, res) => {
  try {
    const { user_id, contract_number, contract_type, start_date, end_date, basic_salary } = req.body;
    
    // Kiểm tra nhân viên có tồn tại không
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }

    const finalEndDate = end_date || null;

    // Validation ngày bắt đầu và kết thúc
    if (start_date && finalEndDate && new Date(finalEndDate) < new Date(start_date)) {
      return res.status(400).json({ message: 'Ngày kết thúc hợp đồng không được trước ngày bắt đầu' });
    }

    const newContract = await Contract.create({
      user_id,
      contract_number,
      contract_type,
      start_date,
      end_date: finalEndDate,
      basic_salary,
      status: 'active'
    });

    res.status(201).json({ message: 'Tạo hợp đồng thành công', contract: newContract });
  } catch (error) {
    // Bắt lỗi trùng số hợp đồng (unique)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Số hợp đồng này đã tồn tại trong hệ thống' });
    }
    res.status(500).json({ message: 'Lỗi khi tạo hợp đồng', error: error.message });
  }
};

// Gia hạn hoặc cập nhật hợp đồng
exports.extendContract = async (req, res) => {
  try {
    const { contract_id } = req.params;
    const { end_date, basic_salary, status, contract_type } = req.body;

    const contract = await Contract.findByPk(contract_id);
    if (!contract) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    }

    // Cập nhật các trường thông tin nếu có gửi lên từ client
    if (end_date !== undefined) {
      const finalEndDate = end_date || null;
      if (finalEndDate && new Date(finalEndDate) < new Date(contract.start_date)) {
        return res.status(400).json({ message: 'Ngày kết thúc hợp đồng không được trước ngày bắt đầu' });
      }
      contract.end_date = finalEndDate;
    }
    if (basic_salary) contract.basic_salary = basic_salary;
    if (status) contract.status = status;
    if (contract_type) contract.contract_type = contract_type; // Chuyển từ thử việc sang chính thức

    await contract.save();

    // TODO: (Sau này có thể thêm) Gửi email/thông báo đến nhân viên khi hợp đồng được gia hạn

    res.status(200).json({ message: 'Cập nhật/Gia hạn hợp đồng thành công', contract });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật hợp đồng', error: error.message });
  }
};

// Xóa hợp đồng
exports.deleteContract = async (req, res) => {
  try {
    const { contract_id } = req.params;
    const contract = await Contract.findByPk(contract_id);
    if (!contract) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    }
    await contract.destroy();
    res.status(200).json({ message: 'Xóa hợp đồng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa hợp đồng', error: error.message });
  }
};
