const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getRooms,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/rooms');

router
  .route('/')
  .get(getRooms)
  .post(addRoom);

router
  .route('/:id')
  .get(getRoom)
  .put(updateRoom)
  .delete(deleteRoom);

module.exports = router;
