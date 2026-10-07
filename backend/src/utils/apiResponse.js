
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
