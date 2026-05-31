const express = require('express');
const router = express.Router();
const hrContractController = require('../controllers/hr.contract.controller');

// [GET] Lấy tất cả hợp đồng trong hệ thống (có thể filter theo search)
router.get('/contracts', hrContractController.getAllContracts);

// [GET] Lấy danh sách hợp đồng của 1 nhân viên
router.get('/contracts/:user_id', hrContractController.getEmployeeContracts);

// [POST] Tạo hợp đồng mới cho nhân viên
router.post('/contracts', hrContractController.createContract);

// [PUT] Gia hạn hoặc cập nhật hợp đồng
router.put('/contracts/:contract_id', hrContractController.extendContract);

// [GET] Lấy danh sách tất cả nhân viên
router.get('/employees', hrContractController.getAllEmployees);

module.exports = router;
