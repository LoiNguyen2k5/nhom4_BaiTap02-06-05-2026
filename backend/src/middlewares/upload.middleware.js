/**
 * upload.middleware.js
 * Multer middleware cho upload file CV (PDF, DOCX)
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads/cv nếu chưa có
const uploadDir = path.join(__dirname, '../../uploads/cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `cv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
