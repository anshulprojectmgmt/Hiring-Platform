const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Signup
router.post('/signup', authController.signup);
// Verify OTP
router.post('/verify-otp', authController.verifyOtp);
// Login
router.post('/login', authController.login);
// Example protected route
router.get('/create-test', auth, (req, res) => {
  res.json({ message: 'Access granted to create test', user: req.user });
});

module.exports = router;
