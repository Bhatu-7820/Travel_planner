const User = require('../models/User');
const Trip = require('../models/Trip');
const AgentRequest = require('../models/AgentRequest');
const mongoose = require('mongoose');
const { logAction } = require('../controllers/auditLogController');

// Get overall stats: total users, total trips, top 5 cities by trip count
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    
    // Aggregations
    const popularCities = await Trip.aggregate([
      { $unwind: "$stops" },
      { $group: { _id: "$stops.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    const popularActivityTypes = await Trip.aggregate([
      { $unwind: "$stops" },
      { $unwind: "$stops.activities" },
      { $group: { _id: "$stops.activities.type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    const averageStopsPerTrip = await Trip.aggregate([
      { $project: { stopsCount: { $size: "$stops" } } },
      { $group: { _id: null, avgStops: { $avg: "$stopsCount" } } }
    ]);

    res.status(200).json({
      totalUsers,
      totalTrips,
      popularCities,
      popularActivityTypes: popularActivityTypes.filter(a => a.name),
      averageStopsPerTrip: averageStopsPerTrip[0]?.avgStops || 0
    });
  } catch (err) {
    next(err);
  }
};

// List all users (admin view)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'trips',
          localField: '_id',
          foreignField: 'userId',
          as: 'trips'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          tripCount: { $size: '$trips' }
        }
      }
    ]);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Delete a user by ID (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    await User.findByIdAndDelete(id);
    await logAction(req.user.id, 'DELETE_USER', 'User', id, `Deleted user ${id}`, req.ip);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('userId', 'name email').sort('-createdAt');
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const requests = await AgentRequest.find()
      .populate('userId', 'name email')
      .populate('tripId', 'name')
      .sort('-createdAt');
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

exports.updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, response, discount } = req.body;
    const request = await AgentRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status || request.status;
    request.response = response || request.response;
    await request.save();

    await logAction(req.user.id, 'UPDATE_REQUEST', 'AgentRequest', id, `Status set to ${status}`, req.ip);

    // Notify user
    const io = req.app.get('io');
    if (io) {
      io.to(request.userId.toString()).emit('new_notification', {
        title: 'Agent Request Update',
        message: `Your planning request has been ${request.status}.`,
        type: 'agent'
      });
    }

    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};
