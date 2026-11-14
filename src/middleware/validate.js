const { validationResult } = require('express-validator');

// Middleware to extract and format express-validator errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: formatted[0].message || 'Validation failed for request payload',
      errors: formatted,
    });
  }
  next();
};

module.exports = validate;

