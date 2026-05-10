const { SupportTicket, Coupon } = require('../models/Support');

exports.createTicket = async (req, res, next) => {
  try {
    const { subject, message, priority } = req.body;
    const ticket = await SupportTicket.create({
      userId: req.user.id,
      subject,
      message,
      priority
    });
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// Admin handlers
exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find().populate('userId', 'name email').sort('-createdAt');
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    
    // Notify user via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(ticket.userId.toString()).emit('new_notification', {
        title: 'Ticket Updated',
        message: `Your ticket "${ticket.subject}" is now ${ticket.status}.`,
        type: 'support'
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

// Coupon handlers
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};
