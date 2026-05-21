/**
 * config/firebase.js
 * Firebase Admin SDK — gracefully optional.
 * If serviceAccountKey.json is missing or invalid, returns a safe stub.
 * Core app features (auth via JWT, AI, trips) work without Firebase Admin.
 * Only push notifications require it.
 */

let adminInstance = null;

function getFirebaseAdmin() {
  if (adminInstance) return adminInstance;

  try {
    const admin = require('firebase-admin');

    // Already initialized by another module
    if (admin.apps && admin.apps.length > 0) {
      adminInstance = admin;
      return adminInstance;
    }

    // Try loading service account
    const serviceAccount = require('../serviceAccountKey.json');

    // Validate the private key before attempting init
    if (!serviceAccount.private_key || !serviceAccount.private_key.includes('BEGIN')) {
      throw new Error('serviceAccountKey.json has invalid private_key format');
    }

    // Fix newlines in private key (common issue when copying from .env)
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    adminInstance = admin;
    console.log('[Firebase Admin] Initialized successfully');
    return adminInstance;

  } catch (err) {
    // Expected: serviceAccountKey.json missing or invalid — push notifications disabled
    // App continues to work normally without Firebase Admin
    const isExpected = 
      err.message.includes('Cannot find module') || 
      err.message.includes('invalid') ||
      err.message.includes('PEM') ||
      err.message.includes('FIREBASE_APP_NOT_FOUND');
    
    if (!isExpected) console.warn('[Firebase Admin] Init skipped:', err.message);
    
    // Return safe stub — callers won't crash
    adminInstance = {
      apps: [],
      auth: () => ({
        verifyIdToken: async () => { throw new Error('Firebase Admin not initialized'); }
      }),
      messaging: () => ({
        send: async () => { /* silently skip push notification */ }
      })
    };
    return adminInstance;
  }
}

module.exports = getFirebaseAdmin();
