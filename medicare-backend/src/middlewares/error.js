const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  // Programming or other unknown error: don't leak error details
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
      const message = `Resource not found with id of ${error.value}`;
      error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      error = new AppError(message, 400);
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      const message = 'Invalid token. Please log in again.';
      error = new AppError(message, 401);
    }
    if (error.name === 'TokenExpiredError') {
      const message = 'Your token has expired. Please log in again.';
      error = new AppError(message, 401);
    }

    sendErrorProd(error, res);
  }
};
