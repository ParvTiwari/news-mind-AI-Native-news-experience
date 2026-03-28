const { initFirebase } = require('../config/firebase');

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  const { auth, enabled } = initFirebase();
  if (!enabled) {
    req.user = null;
    return next();
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
  } catch (_error) {
    req.user = null;
  }

  return next();
}

module.exports = { optionalAuth };
