const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'token';

function sendTokenCookie(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  const cookieMaxAge = process.env.COOKIE_MAX_AGE ? parseInt(process.env.COOKIE_MAX_AGE, 10) : 7 * 24 * 60 * 60 * 1000; // 7 days

  // Cookie configuration can be tuned via environment variables for deployment (see .env.example)
  const sameSite = process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : (process.env.NODE_ENV === 'production');

  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: cookieMaxAge,
    path: '/',
  };

  if (process.env.COOKIE_DOMAIN) cookieOptions.domain = process.env.COOKIE_DOMAIN;

  res.cookie(COOKIE_NAME, token, cookieOptions);
}

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ ok: false, message: 'Email already in use' });

    const user = new User({ name, email, password });
    await user.save();

    sendTokenCookie(res, user._id);

    return res.status(201).json({ ok: true, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    sendTokenCookie(res, user._id);

    return res.json({ ok: true, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.logout = async (req, res) => {
  // clear cookie — use same options used when setting the cookie
  const sameSite = process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : (process.env.NODE_ENV === 'production');

  const cookieOptions = { httpOnly: true, secure, sameSite, path: '/' };
  if (process.env.COOKIE_DOMAIN) cookieOptions.domain = process.env.COOKIE_DOMAIN;

  res.clearCookie(COOKIE_NAME, cookieOptions);
  return res.json({ ok: true, message: 'Logged out' });
};

exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ ok: false, message: 'Authentication required' });
  return res.json({ ok: true, user: req.user });
};
