const Hostel = require('../models/Hostel');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all hostels
// @route   GET /api/v1/hostels
// @access  Public
exports.getHostels = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Hostel.find(JSON.parse(queryStr)).populate('rooms');

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log('fields', fields);
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    console.log('sort by', sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Hostel.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // executing query
  const hostels = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (0 < startIndex) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(200)
    .json({ success: true, count: hostels.length, pagination, data: hostels });
});

// @desc    Get single hostel
// @route   GET /api/v1/hostels/:id
// @access  Public
exports.getHostel = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) {
    return next(new ErrorResponse('Hostel not found', 404));
  }
  res.status(200).json({ success: true, data: hostel });
});

// @desc    Create hostel
// @route   POST /api/v1/hostels
// @access  Private
exports.createHostel = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.create(req.body);

  res.status(201).json({
    success: true,
    data: hostel,
  });
});

// @desc    Update hostel
// @route   PUT /api/v1/hostels/:id
// @access  Private
exports.updateHostel = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!hostel) {
    return next(new ErrorResponse('Hostel not found', 404));
  }

  res.status(200).json({ success: true, data: hostel });
});

// @desc    Delete hostel
// @route   DELETE /api/v1/hostels/:id
// @access  Private
exports.deleteHostel = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) {
    return next(new ErrorResponse('Hostel not found', 404));
  }

  await hostel.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get hostels within a radius
// @route   GET /api/v1/hostels/radius/:zipcode/:distance
// @access  Private
exports.getHostelsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians;
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const hostels = await Hostel.find({
    location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } },
  });

  res.status(200).json({ success: true, count: hostels.length, data: hostels });
});
