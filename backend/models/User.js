const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isSubscribed: { type: Boolean, default: false },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
