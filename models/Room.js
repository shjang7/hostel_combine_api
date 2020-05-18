const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please add a room type'],
  },
  gender: {
    type: String,
    required: [true, 'Please add gender of the room'],
  },
  head: {
    type: Number,
    required: [true, 'Please add a head number'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price info'],
  },
  privateBath: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  hostel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hostel',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Room', RoomSchema);
