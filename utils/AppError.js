class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Important for distinguishing operational errors
    Error.captureStackTrace(this, this.constructor);
    Error.stackTraceLimit = 7
  }
}

module.exports = AppError;