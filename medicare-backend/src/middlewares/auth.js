const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Alternatively, check for token in cookies (if access token is stored there)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(
        new AppError('Not authorized to access this route', 401)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

    // Fetch user and attach to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
       return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};
