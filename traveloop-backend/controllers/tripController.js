const Trip = require('../models/Trip');
const User = require('../models/User');

exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user.id });
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

const defaultImages = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200',
  'https://images.unsplash.com/photo-1504280390467-336c5b96796a?q=80&w=1200',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200'
];

exports.createTrip = async (req, res, next) => {
  try {
    const tripData = { ...req.body, userId: req.user.id };
    if (!tripData.coverImage) {
      tripData.coverImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    }
    const trip = await Trip.create(tripData);
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.copyTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    delete trip._id;
    trip.name = trip.name + ' (Copy)';
    const newTrip = await Trip.create({ ...trip, userId: req.user.id });
    res.status(201).json(newTrip);
  } catch (error) {
    next(error);
  }
};

// Stops
exports.addStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.stops.push(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.updateStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const stop = trip.stops.id(req.params.stopId);
    if (!stop) return res.status(404).json({ message: 'Stop not found' });
    Object.assign(stop, req.body);
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.deleteStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.stops = trip.stops.filter(s => s._id.toString() !== req.params.stopId);
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.reorderStops = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const { order } = req.body;
    const newStops = [];
    order.forEach(id => {
      const stop = trip.stops.find(s => s._id.toString() === id);
      if (stop) newStops.push(stop);
    });
    trip.stops = newStops;
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

// Activities
exports.addActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const stop = trip.stops.id(req.params.stopId);
    if (!stop) return res.status(404).json({ message: 'Stop not found' });
    stop.activities.push(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

// Notes
exports.getNotes = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(trip.notes);
  } catch (error) {
    next(error);
  }
};

exports.addNote = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.notes.push(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const note = trip.notes.id(req.body._id || req.body.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    Object.assign(note, req.body);
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.notes = trip.notes.filter(n => n._id.toString() !== req.body.id);
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

// Packing
exports.updatePacking = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.packing = req.body;
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.getBudget = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    let total = 0;
    const categories = {};
    
    trip.stops.forEach(stop => {
      stop.activities.forEach(act => {
        total += (act.cost || 0);
        categories[act.type || 'General'] = (categories[act.type || 'General'] || 0) + (act.cost || 0);
      });
    });
    
    res.status(200).json({ total, categories });
  } catch (error) {
    next(error);
  }
};

exports.uploadImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // expect [{url, caption}]
    const trip = await Trip.findOne({ _id: id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.images = images;
    await trip.save();
    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

exports.getTripImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findOne({ _id: id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(trip.images || []);
  } catch (err) {
    next(err);
  }
};

exports.inviteCollaborator = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) return res.status(404).json({ message: 'User not found with this email' });

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found or you are not the owner' });

    if (!trip.collaborators.includes(userToInvite._id)) {
      trip.collaborators.push(userToInvite._id);
      await trip.save();
    }

    res.status(200).json({ success: true, message: `Successfully added ${userToInvite.name} as collaborator` });
  } catch (err) {
    next(err);
  }
};

exports.getCollaboratedTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ collaborators: req.user.id }).populate('userId', 'name email photoUrl');
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};
