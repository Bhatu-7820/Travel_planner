const admin = require('../config/firebase-admin');

exports.sendPushNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      notification: { title, body },
      data,
      token
    };
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.error('FCM Error:', error);
    throw error;
  }
};
