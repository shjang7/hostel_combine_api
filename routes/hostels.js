const express = require('express');
const router = express.Router();
const {
  getHostels,
  getHostel,
  createHostel,
  updateHostel,
  deleteHostel,
  getHostelsInRadius,
  hostelPhotoUpload,
} = require('../controllers/hostels');

const advancedResults = require('../middleware/advancedResults');

const Hostel = require('../models/Hostel');

// Include other resource routers
const roomRouter = require('./rooms');

const { protect } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:hostelId/rooms', roomRouter);

router.route('/radius/:zipcode/:distance').get(getHostelsInRadius);
router.route('/:id/photo').put(protect, hostelPhotoUpload);

router
  .route('/')
  .get(advancedResults(Hostel, 'rooms'), getHostels)
  .post(protect, createHostel);

router
  .route('/:id')
  .get(getHostel)
  .put(protect, updateHostel)
  .delete(protect, deleteHostel);

module.exports = router;
