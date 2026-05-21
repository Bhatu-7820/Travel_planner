const express = require('express');
const {
  chatWithAI,
  getChatHistory,
  clearChatHistory,
  generateItinerary,
  generateBudget,
  recommendDestinations,
  recommendHotels,
  generatePackingList,
  optimizeTrip,
  getAnalytics,
  generateActivities
} = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication shield to all AI routes
router.use(protect);

router.post('/chat', chatWithAI);
router.get('/chat/history', getChatHistory);
router.delete('/chat/history', clearChatHistory);
router.post('/itinerary', generateItinerary);
router.post('/budget', generateBudget);
router.post('/destination', recommendDestinations);
router.post('/hotels', recommendHotels);
router.post('/packing', generatePackingList);
router.post('/optimize', optimizeTrip);
router.get('/analytics', getAnalytics);
router.post('/generate', generateActivities);

module.exports = router;
