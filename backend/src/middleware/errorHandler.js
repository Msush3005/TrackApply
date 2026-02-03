module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // In production leak minimal info
  if (process.env.NODE_ENV === 'production' && status === 500) {
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }

  return res.status(status).json({ ok: false, message, ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}) });
};