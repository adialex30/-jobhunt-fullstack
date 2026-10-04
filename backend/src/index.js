const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

<<<<<<< HEAD
// Initialize database & table schemas
=======
>>>>>>> feature/auth-system
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
<<<<<<< HEAD
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');
const { sendSuccess, sendError } = require('./utils/apiResponse');
=======
const errorHandler = require('./middleware/errorHandler');
>>>>>>> feature/auth-system

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
<<<<<<< HEAD
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
=======
  'http://localhost:3000',
>>>>>>> feature/auth-system
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (requestOrigin, callback) => {
<<<<<<< HEAD
    if (
      !requestOrigin ||
      allowedOrigins.includes(requestOrigin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin)
    ) {
=======
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
>>>>>>> feature/auth-system
      return callback(null, true);
    }
    return callback(new Error(`Akses dari origin '${requestOrigin}' diblokir oleh kebijakan CORS.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// Standardized health check endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Server backend jobhunt berjalan dengan baik!',
    data: {
      database: process.env.DB_NAME || 'jobhunt_db',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Fallback 404 handler for undefined routes
app.use((req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: `Endpoint '${req.method} ${req.originalUrl}' tidak ditemukan pada server ini.`
=======
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server backend jobhunt berjalan dengan baik!',
    database: process.env.DB_NAME || 'jobhunt_db',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} tidak ditemukan.`
>>>>>>> feature/auth-system
  });
});

app.use(errorHandler);

<<<<<<< HEAD
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server backend berjalan di http://127.0.0.1:${PORT}`);
  console.log(`API Jobs: http://127.0.0.1:${PORT}/api/jobs`);
  console.log(`API Applications: http://127.0.0.1:${PORT}/api/applications`);
  console.log(`Health check: http://127.0.0.1:${PORT}/api/health`);
});

module.exports = app;
=======
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
>>>>>>> feature/auth-system
