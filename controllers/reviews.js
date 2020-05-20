const Review = require('../models/Review');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/hostels/:hostelId/reviews
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

// @desc    Get single reviews
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'hostel',
    select: 'name description',
  });

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  res.status(200).json({ success: true, data: review });
});

exports.addReview = asyncHandler(async (req, res, next) => {});
exports.updateReview = asyncHandler(async (req, res, next) => {});
exports.deleteReview = asyncHandler(async (req, res, next) => {});
