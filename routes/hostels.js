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

// Include other resource routers
const roomRouter = require('./rooms');

// Re-route into other resource routers
router.use('/:hostelId/rooms', roomRouter);

router.route('/radius/:zipcode/:distance').get(getHostelsInRadius);
router.route('/:id/photo').put(hostelPhotoUpload);

router
  .route('/')
  .get(getHostels)
  .post(createHostel);

router
  .route('/:id')
  .get(getHostel)
  .put(updateHostel)
  .delete(deleteHostel);

module.exports = router;
