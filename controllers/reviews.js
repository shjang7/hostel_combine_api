const Review = require('../models/Review');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/hostels/:hostelsId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let results;
  if (req.params.hostelId) {
    const reviews = await Review.find({ hostel: req.params.hostelId });
    results = {
      success: true,
      count: reviews.length,
      data: reviews,
    };
  } else {
    results = res.advancedResults;
  }
  res.status(200).json(results);
});
