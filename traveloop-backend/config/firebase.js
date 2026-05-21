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
    if (!serviceAccount.private_key || serviceAccount.private_key.length < 100) {
      // Empty or placeholder key — Firebase Admin not configured
      throw new Error('SKIP: serviceAccountKey.json is a placeholder');
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
    // Expected cases — Firebase Admin not needed for core features
    const isSilent = 
      err.message.startsWith('SKIP:') ||
      err.message.includes('Cannot find module');
    
    if (!isSilent) {
      console.warn('[Firebase Admin] Not initialized:', err.message);
    }
    
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
