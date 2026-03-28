const env = require('./env');

let cached = null;

function initFirebase() {
  if (cached) return cached;

  const canInit =
    Boolean(env.FIREBASE_PROJECT_ID) &&
    Boolean(env.FIREBASE_CLIENT_EMAIL) &&
    Boolean(env.FIREBASE_PRIVATE_KEY);

  if (!canInit) {
    cached = { db: null, auth: null, enabled: false };
    return cached;
  }

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const admin = require('firebase-admin');
    const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey
        })
      });
    }

    cached = { db: admin.firestore(), auth: admin.auth(), enabled: true };
  } catch (error) {
    console.error('Firebase admin unavailable; falling back to in-memory profiles.', error.message);
    cached = { db: null, auth: null, enabled: false };
  }

  return cached;
}

module.exports = { initFirebase };
