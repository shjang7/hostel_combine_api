const Room = require('../models/Room');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all rooms
// @route   GET /api/v1/rooms
// @route   GET /api/v1/hostels/:hostelId/rooms
// @access  Public
exports.getRooms = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.hostelId) {
    query = Room.find({ hostel: req.params.hostelId });
  } else {
    query = Room.find().populate({
      path: 'hostel',
      select: 'name description',
    });
  }

  const rooms = await query;

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});
