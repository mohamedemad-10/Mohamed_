const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { authMiddleware, ownerMiddleware, logActivity, logActivityAfter } = require('../middleware/auth');

const router = express.Router();

// Get all users (Owner only)
router.get('/', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, logActivity('view_profile', 'user'), logActivityAfter, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only view their own full profile or public info of others
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'owner') {
      // Return limited public info
      const publicUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        age: user.age,
        createdAt: user.createdAt
      };
      return res.json({ user: publicUser });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (Owner only)
router.put('/:id/role', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'owner'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Owner only)
router.delete('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent owner from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user activities (Owner only or own activities)
router.get('/:id/activities', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, action } = req.query;
    const userId = req.params.id;

    // Check permissions
    if (req.user._id.toString() !== userId && req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = { user: userId };
    if (action && action !== 'all') {
      query.action = action;
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
    console.error('Get user activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;