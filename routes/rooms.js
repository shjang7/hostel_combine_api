const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getRooms,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/rooms');

const advancedResults = require('../middleware/advancedResults');

const Room = require('../models/Room');

// Include other resource routers
const roomRouter = require('./rooms');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Room, {
      path: 'hostel',
      select: 'name description',
    }),
    getRooms,
  )
  .post(protect, authorize('publisher', 'admin'), addRoom);

router
  .route('/:id')
  .get(getRoom)
  .put(protect, authorize('publisher', 'admin'), updateRoom)
  .delete(protect, authorize('publisher', 'admin'), deleteRoom);

module.exports = router;
