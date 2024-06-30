const AppError = require("../utils/AppError");

const handleCastErrorMongoDB = (err) => {
  const errorMsg = `Invalid ${err.path} and ${err.value}`;
  return new AppError(errorMsg, 400);  
};

const sendDevelopmentErrors = (err, res) => {
  res.status(err.statusCode).json({
    error_name: err.name,
    error_msg: err.message, 
    err_path: err.path,
    error: err,
    error_address: err.address,
    error_code: err.code,
    error_cause: err.cause,
    error_stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      status: err.status
    });
  } else {
    console.error('Error from elseblock: ', err);
    res.status(500).json({
      message: 'something went very wrong',
      status: 'fail'
    });
  }
};

//! MAIN MIDDLEWARE
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //! SENDING ERROR MSGES ACC TO DEV ENVIRONMENT
  if (process.env.NODE_ENV === 'development') {
    sendDevelopmentErrors(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; // Shallow copy to avoid overwriting

    if (error.name === 'CastError') {
      error = handleCastErrorMongoDB(error); 
      sendProdError(error, res); 
    } 
  }
};