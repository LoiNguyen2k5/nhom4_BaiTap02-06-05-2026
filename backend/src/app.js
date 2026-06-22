require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// CORS support
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173,http://localhost:5200').split(',');
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const passwordRoutes = require('./routes/password.routes');
const adminRoutes = require('./routes/admin.routes');
const configRoutes = require('./routes/configRoutes');
const recruitmentRoutes = require('./routes/recruitment.routes');
const hrRoutes = require('./routes/hr.routes');
const leaveRoutes = require('./routes/leave.routes');
const taskRoutes = require('./routes/task.routes');
const performanceRoutes = require('./routes/performance.routes');
const payrollRoutes = require('./routes/payroll.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const accountantRoutes = require('./routes/accountant.routes');
const adjustmentRoutes = require('./routes/adjustment.routes');
const advanceRoutes = require('./routes/advance.routes');
const chatbotRoutes = require('./routes/chatbot.routes');

app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/config', configRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/payrolls', payrollRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/accountant', accountantRoutes);
app.use('/api/adjustments', adjustmentRoutes);
app.use('/api/advances', advanceRoutes);
app.use('/api/chatbot', chatbotRoutes);

module.exports = app;
