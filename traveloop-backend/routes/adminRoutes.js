const express = require('express');
const { getStats, getUsers, deleteUser, getRequests, updateRequest, getAllTrips } = require('../controllers/adminController');
const { getDestinations, createDestination, updateDestination, deleteDestination } = require('../controllers/destinationController');
const { getAuditLogs } = require('../controllers/auditLogController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/trips', getAllTrips);
router.delete('/users/:id', deleteUser);
router.get('/requests', getRequests);
router.put('/requests/:id', updateRequest);
router.get('/logs', getAuditLogs);

router.get('/destinations', getDestinations);
router.post('/destinations', createDestination);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

module.exports = router;
