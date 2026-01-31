/**
 * JWT Token Generation Utility
 * Generates and verifies JWT tokens for authentication
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {string} userId - User's MongoDB _id
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate refresh token (longer expiry)
 * @param {string} userId - User's MongoDB _id
 * @returns {string} Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    {
      expiresIn: '90d',
    }
  );
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
};