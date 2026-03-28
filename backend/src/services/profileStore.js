const { initFirebase } = require('../config/firebase');

const memoryProfiles = new Map();

function defaultProfile(userId = 'guest') {
  return {
    id: userId,
    name: 'Guest User',
    email: '',
    interests: ['markets', 'ai'],
    roleType: 'student',
    updatedAt: new Date().toISOString()
  };
}

async function getUserProfile(userId = 'guest') {
  const normalizedUserId = String(userId || 'guest');
  const { db, enabled } = initFirebase();

  if (!enabled) {
    return memoryProfiles.get(normalizedUserId) || defaultProfile(normalizedUserId);
  }

  const doc = await db.collection('users').doc(normalizedUserId).get();
  if (!doc.exists) {
    return defaultProfile(normalizedUserId);
  }

  return doc.data();
}

async function saveUserInterests(userId, interests = []) {
  const normalizedUserId = String(userId || 'guest');
  const { db, enabled } = initFirebase();

  if (!enabled) {
    const current = memoryProfiles.get(normalizedUserId) || defaultProfile(normalizedUserId);
    const updated = {
      ...current,
      id: normalizedUserId,
      interests,
      updatedAt: new Date().toISOString()
    };
    memoryProfiles.set(normalizedUserId, updated);
    return updated;
  }

  const ref = db.collection('users').doc(normalizedUserId);
  const snapshot = await ref.get();
  const current = snapshot.exists ? snapshot.data() : defaultProfile(normalizedUserId);

  const updated = {
    ...current,
    id: normalizedUserId,
    interests,
    updatedAt: new Date().toISOString()
  };

  await ref.set(updated, { merge: true });
  return updated;
}

module.exports = {
  getUserProfile,
  saveUserInterests
};
