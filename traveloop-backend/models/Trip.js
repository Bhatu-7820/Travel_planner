const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  duration: { type: String },
  cost: { type: Number, default: 0 },
  description: { type: String }
});

const stopSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  cityId: { type: String },
  dateFrom: { type: String },
  dateTo: { type: String },
  activities: [activitySchema]
});

const packingSchema = new mongoose.Schema({
  item: { type: String, required: true },
  category: { type: String, default: 'Essentials' },
  isPacked: { type: Boolean, default: false }
});

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  coverImage: { type: String },
  images: [{ url: String, caption: String }],
  isPublic: { type: Boolean, default: false },
  stops: [stopSchema],
  packing: [packingSchema],
  notes: [noteSchema],
  members: { type: Number, default: 1 },
  vehicleOption: { type: String, enum: ['Bus', 'Train', 'Car', 'Flight'], default: 'Car' },
  hotelOption: { type: String, enum: ['Budget', 'Standard', 'Premium', 'Luxury'], default: 'Standard' },
  budgetLimit: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  expenses: [{
    title: { type: String, required: true },
    category: { type: String, default: 'Miscellaneous' },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
