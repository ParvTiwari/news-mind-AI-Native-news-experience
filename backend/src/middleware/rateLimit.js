const bucket = new Map();

function rateLimit({ windowMs = 15 * 60 * 1000, max = 200 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const item = bucket.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > item.resetAt) {
      item.count = 0;
      item.resetAt = now + windowMs;
    }

    item.count += 1;
    bucket.set(ip, item);

    if (item.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please retry later.' });
    }

    return next();
  };
}

module.exports = { rateLimit };
