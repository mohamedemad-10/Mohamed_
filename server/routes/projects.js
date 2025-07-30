const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const { authMiddleware, ownerMiddleware, optionalAuth, logActivity, logActivityAfter } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('image')
    .isURL()
    .withMessage('Please enter a valid image URL'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('Please enter a valid GitHub URL'),
  body('liveUrl')
    .optional()
    .isURL()
    .withMessage('Please enter a valid live URL')
];

// Get all projects
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 12, search, technology } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (technology) {
      query.technologies = { $in: [technology] };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .populate('commentCount')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    // Add user-specific data if authenticated
    const projectsWithUserData = projects.map(project => {
      const projectObj = project.toObject();
      if (req.user) {
        projectObj.isLikedByUser = project.likes.some(like => 
          like.user.toString() === req.user._id.toString()
        );
      }
      return projectObj;
    });

    res.json({
      projects: projectsWithUserData,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project by ID
router.get('/:id', optionalAuth, logActivity('view_project', 'project'), logActivityAfter, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('commentCount');

    if (!project || !project.isActive) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment view count
    project.views += 1;
    await project.save();

    const projectObj = project.toObject();
    if (req.user) {
      projectObj.isLikedByUser = project.likes.some(like => 
        like.user.toString() === req.user._id.toString()
      );
    }

    res.json({ project: projectObj });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (Owner only)
router.post('/', authMiddleware, ownerMiddleware, projectValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, image, technologies, githubUrl, liveUrl } = req.body;

    const project = new Project({
      title,
      description,
      image,
      technologies,
      githubUrl,
      liveUrl,
      createdBy: req.user._id
    });

    await project.save();
    await project.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (Owner only)
router.put('/:id', authMiddleware, ownerMiddleware, projectValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, image, technologies, githubUrl, liveUrl } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, image, technologies, githubUrl, liveUrl },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (Owner only)
router.delete('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Soft delete
    project.isActive = false;
    await project.save();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike project
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || !project.isActive) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id;
    const existingLike = project.likes.find(like => 
      like.user.toString() === userId.toString()
    );

    if (existingLike) {
      // Unlike
      project.likes = project.likes.filter(like => 
        like.user.toString() !== userId.toString()
      );
      await Activity.logActivity(userId, 'unlike', 'project', project._id, {}, req);
    } else {
      // Like
      project.likes.push({ user: userId });
      await Activity.logActivity(userId, 'like', 'project', project._id, {}, req);
    }

    await project.save();

    res.json({
      message: existingLike ? 'Project unliked' : 'Project liked',
      likeCount: project.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project likes
router.get('/:id/likes', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('likes.user', 'name email')
      .select('likes');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ likes: project.likes });
  } catch (error) {
    console.error('Get project likes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;