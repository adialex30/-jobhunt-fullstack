/**
 * Utility helper untuk standarisasi format response JSON API
 * Mengikuti best practice RESTful API (JSend + Custom Metadata)
 */

/**
 * Kirim response sukses terstandarisasi
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {number} [options.statusCode=200]
 * @param {string} [options.message='Berhasil memproses permintaan.']
 * @param {any} [options.data=null]
 * @param {Object} [options.pagination]
 * @param {Object} [options.meta]
 */
const sendSuccess = (res, {
  statusCode = 200,
  message = 'Berhasil memproses permintaan.',
  data = null,
  pagination = undefined,
  meta = undefined
} = {}) => {
  const responsePayload = {
    success: true,
    status: 'success',
    message,
    data
  };

  if (pagination !== undefined) {
    responsePayload.pagination = pagination;
  }

  if (meta !== undefined) {
    responsePayload.meta = meta;
  }

  return res.status(statusCode).json(responsePayload);
};

/**
 * Kirim response error terstandarisasi
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {number} [options.statusCode=400]
 * @param {string} [options.message='Terjadi kesalahan.']
 * @param {any} [options.errors=null]
 */
const sendError = (res, {
  statusCode = 400,
  message = 'Terjadi kesalahan.',
  errors = null
} = {}) => {
  const responsePayload = {
    success: false,
    status: 'error',
    message
  };

  if (errors !== null && errors !== undefined) {
    responsePayload.errors = errors;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = {
  sendSuccess,
  sendError
};
