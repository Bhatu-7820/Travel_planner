const express = require('express');
const { generateActivities, chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/generate', protect, generateActivities);
router.post('/chat', protect, chatWithAI);

module.exports = router;
