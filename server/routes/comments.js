const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const { authMiddleware, ownerMiddleware } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
];

// Get comments for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { projectId } = req.params;

    const comments = await Comment.find({ 
      project: projectId, 
      isActive: true,
      parentComment: { $exists: false } // Only top-level comments
    })
      .populate('user', 'name email')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ 
      project: projectId, 
      isActive: true,
      parentComment: { $exists: false }
    });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/', authMiddleware, commentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { content, project, parentComment } = req.body;

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists || !projectExists.isActive) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If it's a reply, verify parent comment exists
    if (parentComment) {
      const parentExists = await Comment.findById(parentComment);
      if (!parentExists || !parentExists.isActive) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = new Comment({
      content,
      user: req.user._id,
      project,
      parentComment
    });

    await comment.save();
    await comment.populate('user', 'name email');

    // If it's a reply, add to parent's replies array
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id }
      });
    }

    // Log activity
    await Activity.logActivity(req.user._id, 'comment', 'project', project, { commentId: comment._id }, req);

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment (own comments only or owner)
router.put('/:id', authMiddleware, commentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment || !comment.isActive) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check permissions
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.content = content;
    await comment.save();
    await comment.populate('user', 'name email');

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (own comments only or owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check permissions
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete
    comment.isActive = false;
    await comment.save();

    // Also soft delete replies
    await Comment.updateMany(
      { parentComment: comment._id },
      { isActive: false }
    );

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's comments (for profile/dashboard)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { userId } = req.params;

    // Check permissions
    if (req.user._id.toString() !== userId && req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comments = await Comment.find({ 
      user: userId, 
      isActive: true 
    })
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments({ 
      user: userId, 
      isActive: true 
    });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;