const User = require('../models/User');

// Middleware to check if user is logged in and subscription is active
module.exports = async (req, res, next) => {
  try {
    const user = req.user; // set by auth middleware
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!user.isSubscribed || !user.subscriptionEnd || new Date(user.subscriptionEnd) < new Date()) {
      return res.status(403).json({ error: 'Subscription inactive or expired', subscriptionExpired: true });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Subscription check failed' });
  }
};
