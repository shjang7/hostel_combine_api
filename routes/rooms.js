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

router
  .route('/')
  .get(
    advancedResults(Room, {
      path: 'hostel',
      select: 'name description',
    }),
    getRooms,
  )
  .post(addRoom);

router
  .route('/:id')
  .get(getRoom)
  .put(updateRoom)
  .delete(deleteRoom);

module.exports = router;
