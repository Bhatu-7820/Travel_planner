const express = require('express');
const { createRequest, getMyRequests } = require('../controllers/requestController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.post('/', createRequest);
router.get('/me', getMyRequests);

module.exports = router;
