const mongoose = require('mongoose');

const agentRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  type: { type: String, enum: ['Planning', 'Discount', 'Support'], default: 'Planning' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  details: { type: String },
  response: { type: String },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned agent
}, { timestamps: true });

module.exports = mongoose.model('AgentRequest', agentRequestSchema);
