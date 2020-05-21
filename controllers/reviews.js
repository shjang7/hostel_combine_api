const Review = require('../models/Review');
const Hostel = require('../models/Hostel');
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

// @desc    Add review
// @route   POST /api/v1/hostels/:hostelId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.hostelId);

  if (!hostel) {
    return next(new ErrorResponse(`Hostel not found`, 404));
  }

  req.body.hostel = req.params.hostelId;
  req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});
exports.updateReview = asyncHandler(async (req, res, next) => {});
exports.deleteReview = asyncHandler(async (req, res, next) => {});
