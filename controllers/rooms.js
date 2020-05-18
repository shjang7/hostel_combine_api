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

  await room.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
