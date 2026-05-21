const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['destination', 'hotel'],
    required: true
  },
  inputs: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AiRecommendation', aiRecommendationSchema);
