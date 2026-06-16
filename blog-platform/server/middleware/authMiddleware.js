const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Verifies the JWT sent in the Authorization header (Bearer <token>)
 * and attaches the corresponding user document (without password) to req.user.
 * Responds with 401 if the token is missing, invalid, or the user no longer exists.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed or expired');
  }
});

/**
 * Optional auth: attaches req.user if a valid token is present,
 * but does not block the request if it is missing/invalid.
 * Useful for endpoints that behave differently for logged-in users
 * (e.g. showing whether the current user has liked a post).
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // Invalid token on an optional route is simply ignored
      req.user = null;
    }
  }

  next();
});

module.exports = { protect, optionalAuth };
