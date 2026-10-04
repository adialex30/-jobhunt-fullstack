const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const { sendError } = require('../utils/apiResponse');
=======
>>>>>>> feature/auth-system

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
<<<<<<< HEAD
    return sendError(res, {
      statusCode: 401,
=======
    return res.status(401).json({
      status: 'error',
>>>>>>> feature/auth-system
      message: 'Akses ditolak! Token otentikasi tidak ditemukan.'
    });
  }

  const bearerToken = authorizationHeader.split(' ')[1];

  try {
    const decodedTokenPayload = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET || 'your_super_secret_key_min_32_chars'
    );
    req.user = decodedTokenPayload;
    next();
  } catch (verificationError) {
<<<<<<< HEAD
    return sendError(res, {
      statusCode: 403,
=======
    return res.status(403).json({
      status: 'error',
>>>>>>> feature/auth-system
      message: 'Token tidak valid atau sudah kedaluwarsa.'
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
<<<<<<< HEAD
      return sendError(res, {
        statusCode: 403,
=======
      return res.status(403).json({
        status: 'error',
>>>>>>> feature/auth-system
        message: 'Akses terlarang! Anda tidak memiliki izin untuk tindakan ini.'
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
