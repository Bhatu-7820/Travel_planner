const AgentRequest = require('../models/AgentRequest');

exports.createRequest = async (req, res, next) => {
  try {
    const { tripId, type, details } = req.body;
    const request = await AgentRequest.create({
      userId: req.user.id,
      tripId,
      type,
      details
    });
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await AgentRequest.find({ userId: req.user.id }).populate('tripId', 'name');
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};
