const mongoose = require('mongoose');

const aiBudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  budgetType: {
    type: String,
    enum: ['Budget', 'Standard', 'Luxury'],
    required: true
  },
  budgetEstimation: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AiBudget', aiBudgetSchema);
