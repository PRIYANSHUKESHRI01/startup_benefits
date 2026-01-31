
// External dependencies
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Register a new user
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide name, email, and password',
    });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: 'User with this email already exists',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 6 characters',
    });
  }
  const newUser = await User.create({ name, email, password });
  const jwtToken = generateToken(newUser._id);
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: newUser.getPublicProfile(),
      token: jwtToken,
    },
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password',
    });
  }
  const userRecord = await User.findOne({ email }).select('+password');
  if (!userRecord) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }
  const isPasswordValid = await userRecord.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }
  const jwtToken = generateToken(userRecord._id);
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: userRecord.getPublicProfile(),
      token: jwtToken,
    },
  });
});

// Get current user profile
const getMe = asyncHandler(async (req, res) => {
  const userProfile = await User.findById(req.user._id);
  res.status(200).json({
    status: 'success',
    data: {
      user: userProfile.getPublicProfile(),
    },
  });
});

// Verify user account
const verifyAccount = asyncHandler(async (req, res) => {
  const userRecord = await User.findById(req.user._id);
  if (!userRecord) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  if (userRecord.isVerified) {
    return res.status(400).json({
      status: 'error',
      message: 'Account is already verified',
    });
  }
  userRecord.isVerified = true;
  await userRecord.save();
  res.status(200).json({
    status: 'success',
    message: 'Account verified successfully',
    data: {
      user: userRecord.getPublicProfile(),
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
  verifyAccount,
};