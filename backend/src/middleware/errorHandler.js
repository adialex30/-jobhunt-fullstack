<<<<<<< HEAD
const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return sendError(res, {
      statusCode: 403,
=======
const errorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      status: 'error',
>>>>>>> feature/auth-system
      message: err.message
    });
  }

  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Terjadi kesalahan internal pada server.';

<<<<<<< HEAD
  return sendError(res, {
    statusCode,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' ? { errors: err.stack } : {})
=======
  return res.status(statusCode).json({
    status: 'error',
    message: errorMessage
>>>>>>> feature/auth-system
  });
};

module.exports = errorHandler;
