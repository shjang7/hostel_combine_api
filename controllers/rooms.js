const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all rooms
// @route   GET /api/v1/rooms
// @route   GET /api/v1/hostels/:hostelId/rooms
// @access  Public
exports.getRooms = asyncHandler(async (req, res, next) => {
  let results;

  if (req.params.hostelId) {
    const rooms = await Room.find({ hostel: req.params.hostelId });

    results = {
      success: true,
      count: rooms.length,
      data: rooms,
    };
  } else {
    results = res.advancedResults;
  }
  res.status(200).json(results);
});

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Public
exports.getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate({
    path: 'hostel',
    select: 'name description',
  });

  if (!room) {
    return next(new ErrorResponse(`Room not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Create new room
// @route   POST /api/v1/hostels/:hostelId/rooms
// @access  Private
exports.addRoom = asyncHandler(async (req, res, next) => {
  const hostel = await Hostel.findById(req.params.hostelId);

  if (!hostel) {
    return next(new ErrorResponse(`No hostel found`, 404));
  }

  req.body.hostel = req.params.hostelId;
  req.body.user = req.user.id;

  // Make sure user is hostel owner
  if (hostel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a room to hostel ${hostel._id}`,
        403,
      ),
    );
  }

  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    data: room,
  });
});

// @desc    Update room
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse(`Room not found`, 404));
  }

  // Make sure user is hostel owner
  if (room.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update room ${room._id}`,
        403,
      ),
    );
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Delete room
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse(`Room not found`, 404));
  }
  req.body.user = req.user.id;

  // Make sure user is room owner
  if (room.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete room ${room._id}`,
        403,
      ),
    );
  }

  await room.remove();

  res.status(204).json();
});
