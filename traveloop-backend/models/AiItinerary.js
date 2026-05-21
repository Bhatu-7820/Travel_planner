const mongoose = require('mongoose');

const aiItinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  interests: {
    type: [String],
    default: []
  },
  travelStyle: {
    type: String
  },
  groupType: {
    type: String
  },
  itinerary: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AiItinerary', aiItinerarySchema);
