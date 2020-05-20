const path = require('path');
const Hostel = require('../models/Hostel');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all hostels
// @route   GET /api/v1/hostels
// @access  Public
exports.getHostels = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published hostels
  const publishedHostel = await Hostel.findOne({ user: req.user.id });

  // If the user is not and admin, they can only add one hostel
  if (publishedHostel && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a hostel`,
        400,
      ),
    );
  }

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
  let hostel = await Hostel.findById(req.params.id);

  if (!hostel) {
    return next(new ErrorResponse('Hostel not found', 404));
  }

  // Make sure user is hostel owner
  if (hostel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this hostel`,
        403,
      ),
    );
  }

  hostel = await Hostel.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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

  // Make sure user is hostel owner
  if (hostel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this hostel`,
        403,
      ),
    );
  }

  await hostel.remove();

  res.status(204).json();
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

// @desc    Upload photo for hostel
// @route   PUT /api/v1/hostels/:id/photo
// @access  Private
exports.hostelPhotoUpload = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.id);

  if (!hostel) {
    return next(new ErrorResponse(`Hostel not found`, 404));
  }

  // Make sure user is hostel owner
  if (hostel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this hostel`,
        403,
      ),
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400,
      ),
    );
  }

  // Create custom filename
  file.name = `photo_${hostel._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);

      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });

  await Hostel.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});
