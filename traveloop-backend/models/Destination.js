const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  popularActivities: [{
    name: String,
    price: Number,
    category: String
  }],
  hotels: [{
    name: String,
    pricePerNight: Number,
    rating: Number,
    image: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
