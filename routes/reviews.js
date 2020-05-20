const express = require('express');
const router = express.Router();
const { getReviews } = require('../controllers/reviews');

const advancedResults = require('../middleware/advancedResults');

const Review = require('../models/Review');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, { path: 'hostel', select: 'name description' }),
    getReviews,
  );

module.exports = router;
