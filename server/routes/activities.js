const express = require('express');
const Activity = require('../models/Activity');
const { authMiddleware, ownerMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all activities (Owner only)
router.get('/', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      user, 
      action, 
      targetType,
      startDate,
      endDate 
    } = req.query;

    const query = {};
    
    if (user) query.user = user;
    if (action && action !== 'all') query.action = action;
    if (targetType && targetType !== 'all') query.targetType = targetType;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query)
      .populate('user', 'name email')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity statistics (Owner only)
router.get('/stats', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate;
    switch (period) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const stats = await Activity.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get daily activity counts
    const dailyStats = await Activity.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get most active users
    const activeUsers = await Activity.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          count: 1,
          'user.name': 1,
          'user.email': 1
        }
      }
    ]);

    res.json({
      actionStats: stats,
      dailyStats,
      activeUsers,
      period
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own activities
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, action } = req.query;
    
    const query = { user: req.user._id };
    if (action && action !== 'all') {
      query.action = action;
    }

    const activities = await Activity.find(query)
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get my activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;