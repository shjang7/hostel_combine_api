const express = require('express');
const router = express.Router({ mergeParams: true });
const { getRooms } = require('../controllers/rooms');

router.route('/').get(getRooms);

module.exports = router;
