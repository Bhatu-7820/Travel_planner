const express = require('express');
const { getTrips, getTrip, createTrip, updateTrip, deleteTrip, addStop, deleteStop, updateStop, reorderStops, addActivity, getNotes, addNote, updateNote, deleteNote, updatePacking, getBudget, copyTrip, uploadImages, getTripImages, inviteCollaborator, getCollaboratedTrips } = require('../controllers/tripController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTrips)
  .post(createTrip);

router.get('/shared', getCollaboratedTrips);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

router.post('/:id/invite', inviteCollaborator);
router.post('/:id/stops', addStop);
router.put('/:id/stops/:stopId', updateStop);
router.put('/:id/stops/reorder', reorderStops);
router.post('/:id/stops/:stopId/activities', addActivity);
router.get('/:id/notes', getNotes);
router.post('/:id/notes', addNote);
router.put('/:id/notes', updateNote);
router.delete('/:id/notes', deleteNote);
router.put('/:id/packing', updatePacking);
router.get('/:id/budget', getBudget);
router.post('/:id/images', uploadImages);
router.get('/:id/images', getTripImages);
router.post('/copy/:id', copyTrip);

module.exports = router;
