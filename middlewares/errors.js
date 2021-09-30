const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack
    })
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err };

    error.message = err.message;

    // Wrong Mongoose ojbect ID error
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // handling Mongoose Validation Error
    if (err.name === 'ValidatorError') { // error name as of August 19, 2021 9:53PM
      const message = Object.values(err.errors).map(value => value.messsage);
      error = new ErrorHandler(message, 400);
    }

     // handling Mongoose duplicate key wrrors
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    // handling wrong jwt error
    if (err.name === 'JsonWebTokenError') {   
      const message = "JSON Web Token is invalid. Try Again."
      error = new ErrorHandler(message, 400);
    }

    // handling wrong jwt expired error
    if (err.name === 'JsonWebTokenError') {   
      const message = "JSON Web Token is expired. Try Again."
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || 'Internal server error.'
    })
  }

}