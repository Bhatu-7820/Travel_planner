const express = require('express');
const { getActivities } = require('../controllers/activityController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Apply auth middleware to protect the activities endpoint
router.use(protect);

router.get('/', getActivities);

module.exports = router;
