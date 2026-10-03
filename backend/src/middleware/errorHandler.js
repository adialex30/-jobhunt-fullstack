const errorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      status: 'error',
      message: err.message
    });
  }

  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Terjadi kesalahan internal pada server.';

  return res.status(statusCode).json({
    status: 'error',
    message: errorMessage
  });
};

module.exports = errorHandler;
