const express = require('express');
const { createTicket, getMyTickets, getAllTickets, updateTicketStatus, createCoupon, getCoupons } = require('../controllers/supportController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// User routes
router.post('/tickets', createTicket);
router.get('/tickets/me', getMyTickets);

// Admin routes
router.get('/tickets', authorize('admin'), getAllTickets);
router.put('/tickets/:id', authorize('admin'), updateTicketStatus);
router.post('/coupons', authorize('admin'), createCoupon);
router.get('/coupons', authorize('admin'), getCoupons);

module.exports = router;
