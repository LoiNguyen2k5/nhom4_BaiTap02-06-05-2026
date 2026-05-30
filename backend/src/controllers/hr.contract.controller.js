const { Contract, User } = require('../models');

// Lấy danh sách hợp đồng của 1 nhân viên cụ thể (xem lịch sử)
exports.getEmployeeContracts = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Tìm tất cả hợp đồng của user_id này, sắp xếp hợp đồng mới nhất lên đầu
    const contracts = await Contract.findAll({
      where: { user_id },
      order: [['start_date', 'DESC']]
    });
    
    res.status(200).json({ contracts });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hợp đồng', error: error.message });
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

    const newContract = await Contract.create({
      user_id,
      contract_number,
      contract_type,
      start_date,
      end_date,
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
    if (end_date) contract.end_date = end_date;
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
