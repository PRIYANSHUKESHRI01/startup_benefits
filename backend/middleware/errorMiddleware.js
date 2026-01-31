

const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);
  let error = {
    status: 'error',
    message: err.message || 'Internal server error',
    statusCode: err.statusCode || 500,
  };
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = {
      status: 'error',
      message: 'Validation failed',
      errors: messages,
      statusCode: 400,
    };
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = {
      status: 'error',
      message: `${field} already exists`,
      statusCode: 400,
    };
  }
  if (err.name === 'CastError') {
    error = {
      status: 'error',
      message: 'Invalid ID format',
      statusCode: 400,
    };
  }
  if (err.name === 'JsonWebTokenError') {
    error = {
      status: 'error',
      message: 'Invalid token',
      statusCode: 401,
    };
  }
  if (err.name === 'TokenExpiredError') {
    error = {
      status: 'error',
      message: 'Token expired',
      statusCode: 401,
    };
  }
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = errorMiddleware;
module.exports.asyncHandler = asyncHandler;
module.exports.AppError = AppError;