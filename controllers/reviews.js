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

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found`, 404));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${review._id}`,
        403,
      ),
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Recalculate rating
  if (req.body.rating) {
    review.save();
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found`, 404));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete review ${review._id}`,
        403,
      ),
    );
  }

  review.remove();

  return res.status(204).json();
});
