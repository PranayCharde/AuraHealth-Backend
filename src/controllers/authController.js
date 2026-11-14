const User = require('../models/User');
const { isDbConnected } = require('../config/db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, profile } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password.',
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long.',
      });
    }

    // 2. Validate email format
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // 3. Validate password length and optional confirmPassword matching
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // 4. Verify MongoDB connection
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable. Please retry in a moment.',
        dbConnected: false,
      });
    }

    // 5. Check whether the email already exists in MongoDB
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // 6. Create user in MongoDB (password will be hashed via UserSchema pre-save hook using bcryptjs)
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
      profile: profile || {},
    });

    const token = user.getSignedJwtToken();

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        themeMode: user.themeMode,
      },
      dbConnected: true,
    });
  } catch (err) {
    console.error('[AUTH REGISTER ERROR]:', err);
    next(err);
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Missing fields validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Validate email format
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 3. Verify MongoDB connection
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable. Please retry in a moment.',
        dbConnected: false,
      });
    }

    // 4. Search MongoDB for the exact normalized email (including password hash for verification)
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 5. Compare password using bcryptjs
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 6. Generate signed JWT token with expiry
    const token = user.getSignedJwtToken();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        themeMode: user.themeMode,
      },
      dbConnected: true,
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]:', err);
    next(err);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    res.status(200).json({
      success: true,
      user: req.user,
      dbConnected: isDbConnected(),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile parameters (weight, height, goals)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, profile, themeMode } = req.body;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection required to update profile.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name: name.trim() }),
        ...(profile && { profile: { ...req.user.profile, ...profile } }),
        ...(themeMode && { themeMode }),
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully in MongoDB.',
      user: updatedUser,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};
