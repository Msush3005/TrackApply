const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/auth');
const validate = require('../middleware/validate');

// tighter limiter for login route
const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000), 10),
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
});

// Signup: name, email, password
router.post('/signup', [
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, authController.signup);

// Login: email, password (rate-limited)
router.post('/login', loginLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').exists().withMessage('Password is required'),
], validate, authController.login);

// Logout (require auth to avoid abuse)
router.post('/logout', requireAuth, authController.logout);

// Protected: get current authenticated user
router.get('/me', requireAuth, authController.me);

module.exports = router;
