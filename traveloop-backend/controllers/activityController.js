const aiService = require('../services/ai.service');

/**
 * Get activities for a destination with optional filters
 */
exports.getActivities = async (req, res, next) => {
  try {
    const { city, type, maxCost } = req.query;
    
    // Resolve destination data (falls back to Paris if city is empty)
    const destData = aiService.getDestData(city || 'Paris');
    
    // Build fallback activities for this destination
    let activities = aiService.buildActivitiesFallback(destData);
    
    // Add unique IDs to activities for frontend keys and matching
    activities = activities.map((act, index) => ({
      id: act.id || `act_${index}_${act.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      ...act
    }));
    
    // Filter by activity type if specified and not 'All'
    if (type && type !== 'All') {
      activities = activities.filter(
        act => act.type && act.type.toLowerCase() === type.toLowerCase()
      );
    }
    
    // Filter by max cost if specified
    if (maxCost !== undefined && maxCost !== '') {
      const costLimit = Number(maxCost);
      if (!isNaN(costLimit)) {
        activities = activities.filter(act => act.cost <= costLimit);
      }
    }
    
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};
