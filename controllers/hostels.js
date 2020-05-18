const Hostel = require('../models/Hostel');
const asyncHandler = require('../middleware/async');

// @desc    Get all hostels
// @route   GET /api/v1/hostels
// @access  Public
exports.getHostels = asyncHandler(async (req, res, next) => {
  const hostels = await Hostel.find();
  res.status(200).json({ success: true, data: hostels });
});

// @desc    Get single hostel
// @route   GET /api/v1/hostels/:id
// @access  Public
exports.getHostel = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.id);
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

  res.status(200).json({ success: true, data: hostel });
});

// @desc    Delete hostel
// @route   DELETE /api/v1/hostels/:id
// @access  Private
exports.deleteHostel = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.id);

  await Hostel.remove();

  res.status(200).json({ success: true, data: {} });
});
