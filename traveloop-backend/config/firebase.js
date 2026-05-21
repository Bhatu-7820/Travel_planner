const admin = require('firebase-admin');
const path = require('path');

// Only initialize if not already initialized by firebase-admin.js
if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[Firebase] Admin initialized');
  } catch (error) {
    // serviceAccountKey.json is gitignored — this is expected in most envs
    // Firebase Admin features (push notifications) will be disabled
    if (!error.message.includes('Cannot find module')) {
      console.warn('[Firebase] Init warning:', error.message);
    }
  }
}

module.exports = admin;

