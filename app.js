require('dotenv').config();
const express = require('express');
const path = require('path');
require('./src/config/db'); // Khởi tạo DB

const passwordRoutes = require('./src/routes/password.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép CORS đơn giản (để test từ file HTML)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Serve giao diện HTML từ thư mục views
app.use(express.static(path.join(__dirname, 'src', 'views')));

// Routes API
app.use('/api/auth', passwordRoutes);

// Trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
    console.log(`🌐 Giao diện test: http://localhost:${PORT}/login.html`);
    console.log(`📡 API forgot-password: POST http://localhost:${PORT}/api/auth/forgot-password`);
    console.log(`📡 API reset-password:  POST http://localhost:${PORT}/api/auth/reset-password`);
});