module.exports = {
  makeJsonResponse: (message, data = {}, errors = {}, statusCode, success = true, extraFlags = {}) => {
    return {
      statusCode,
      message,
      data,
      errors,
      success,
      extraFlags,
    };
  },
  makeErrorJson: (status, message = {}) => {
    console.log(message)
    return {
      status,
      message
    }
  }
};
