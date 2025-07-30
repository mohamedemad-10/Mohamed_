const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid or user is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is owner
const ownerMiddleware = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Owner role required.' });
  }
  next();
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

// Activity logging middleware
const logActivity = (action, targetType = null) => {
  return async (req, res, next) => {
    // Store activity info for later logging
    req.activityInfo = {
      action,
      targetType,
      targetId: req.params.id || req.params.projectId || req.params.userId
    };
    next();
  };
};

// Log activity after successful request
const logActivityAfter = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log activity if request was successful and user is authenticated
    if (req.user && req.activityInfo && res.statusCode < 400) {
      Activity.logActivity(
        req.user._id,
        req.activityInfo.action,
        req.activityInfo.targetType,
        req.activityInfo.targetId,
        {},
        req
      );
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  authMiddleware,
  ownerMiddleware,
  optionalAuth,
  logActivity,
  logActivityAfter
};