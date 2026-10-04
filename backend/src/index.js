const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Initialize database & table schemas
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');
const { sendSuccess, sendError } = require('./utils/apiResponse');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (requestOrigin, callback) => {
    if (
      !requestOrigin ||
      allowedOrigins.includes(requestOrigin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin)
    ) {
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
  });
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server backend berjalan di http://127.0.0.1:${PORT}`);
  console.log(`API Jobs: http://127.0.0.1:${PORT}/api/jobs`);
  console.log(`API Applications: http://127.0.0.1:${PORT}/api/applications`);
  console.log(`Health check: http://127.0.0.1:${PORT}/api/health`);
});

module.exports = app;
