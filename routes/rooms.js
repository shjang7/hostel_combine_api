const express = require('express');
const router = express.Router({ mergeParams: true });
const { getRooms, getRoom, addRoom } = require('../controllers/rooms');

router
  .route('/')
  .get(getRooms)
  .post(addRoom);
router.route('/:id').get(getRoom);

module.exports = router;
