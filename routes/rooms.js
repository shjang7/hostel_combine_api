const express = require('express');
const router = express.Router({ mergeParams: true });
const { getRooms, getRoom } = require('../controllers/rooms');

router.route('/').get(getRooms);
router.route('/:id').get(getRoom);

module.exports = router;
