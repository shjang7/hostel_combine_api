const express = require('express');
const router = express.Router();
const {
  getHostels,
  getHostel,
  createHostel,
  updateHostel,
  deleteHostel,
} = require('../controllers/hostels');

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
