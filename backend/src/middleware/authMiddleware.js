const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
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
    return res.status(403).json({
      status: 'error',
      message: 'Token tidak valid atau sudah kedaluwarsa.'
    });
  }
};
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
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
