const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err, name: err.name, message: err.message };

  // Log to console for dev
  if (process.env.NODE_ENV === 'development') {
    console.log(JSON.stringify(error));
  }

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = `Hostel not found`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
