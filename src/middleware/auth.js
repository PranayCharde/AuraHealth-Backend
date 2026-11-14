const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');

// Protect routes - JWT verification middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Missing authentication token.',
    });
  }

  try {
    // Verify token with secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'aurahealth_hyper_secure_jwt_secret_token_2026_biometrics_key'
    );

    // Verify user exists in database
    if (isDbConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }
      req.user = user;
    } else {
      // When DB is connecting, construct verified identity strictly from decoded token
      if (!decoded.id || !decoded.email) {
        return res.status(401).json({
          success: false,
          message: 'Malformed or invalid authentication token payload.',
        });
      }
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
      };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};

// Grant access to specific roles (e.g. admin)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
