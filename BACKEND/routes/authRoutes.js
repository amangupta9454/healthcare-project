const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  verifyRegOtp,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getMe,
  getDoctors,
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/verify-reg-otp', verifyRegOtp);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/doctors', getDoctors);

// Protected route
router.get('/me', auth, getMe);

module.exports = router;