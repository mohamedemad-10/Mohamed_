const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'signup', 'like', 'unlike', 'comment', 'view_project', 'view_profile', 'update_profile']
  },
  targetType: {
    type: String,
    enum: ['project', 'user', 'comment'],
    required: function() {
      return ['like', 'unlike', 'comment', 'view_project', 'view_profile'].includes(this.action);
    }
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: function() {
      return ['like', 'unlike', 'comment', 'view_project', 'view_profile'].includes(this.action);
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for better performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });
activitySchema.index({ targetType: 1, targetId: 1 });

// Static method to log activity
activitySchema.statics.logActivity = async function(userId, action, targetType = null, targetId = null, metadata = {}, req = null) {
  try {
    const activity = new this({
      user: userId,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent')
    });
    
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = mongoose.model('Activity', activitySchema);