const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['trip', 'system', 'support', 'budget'], default: 'system' },
  read: { type: Boolean, default: false },
  link: { type: String } // optional link to redirect to
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
