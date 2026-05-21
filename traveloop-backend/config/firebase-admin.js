const admin = require('firebase-admin');

let firebaseAdmin = null;

try {
  // Only initialize if serviceAccountKey.json exists (not required for core features)
  const serviceAccount = require('../serviceAccountKey.json');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  firebaseAdmin = admin;
  console.log('[Firebase Admin] Initialized successfully.');
} catch (err) {
  // serviceAccountKey.json is gitignored for security — not available in this env
  // Firebase Admin is optional — only used for push notifications
  console.warn('[Firebase Admin] Skipped:', err.message);
  // Return a stub so callers don't crash
  firebaseAdmin = {
    messaging: () => ({
      send: async () => { console.warn('[Firebase Admin] Push notifications disabled.'); }
    })
  };
}

module.exports = firebaseAdmin;

