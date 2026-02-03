const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.status(401).json({ ok: false, message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user from DB and exclude password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ ok: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Invalid or expired token' });
  }
};
