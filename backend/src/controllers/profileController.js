const { getUserProfile, saveUserInterests } = require('../services/profileStore');
const { normalizeInterests } = require('../utils/normalize');

async function getProfile(req, res, next) {
  try {
    const userId = req.params.userId || req.user?.uid || 'guest';
    const profile = await getUserProfile(userId);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
}

async function updateInterests(req, res, next) {
  try {
    const userId = req.body.userId || req.user?.uid || 'guest';
    const interests = normalizeInterests(req.body.interests);
    const profile = await saveUserInterests(userId, interests);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateInterests
};
