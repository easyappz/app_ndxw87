const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT signing (hardcoded as per instructions)
const JWT_SECRET = 'mysecretkey123';

// Middleware to authenticate user based on JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user has required permissions
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      if (user.role === 'admin') {
        return next(); // Admin has access to everything
      }

      const permission = user.permissions.find(p => p.resource === resource);
      if (!permission || !permission.actions.includes(action)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error.message);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

// Middleware to restrict access based on role
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied for this role' });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error.message);
      return res.status(500).json({ message: 'Error checking role' });
    }
  };
};

module.exports = {
  authenticateUser,
  checkPermission,
  checkRole,
  JWT_SECRET
};
