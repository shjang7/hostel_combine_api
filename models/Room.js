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

// Static method to get min of room price
RoomSchema.statics.getMinimumPrice = async function(hostelId) {
  console.log('Calculating min price...'.blue);

  const obj = await this.aggregate([
    {
      $match: { hostel: hostelId },
    },
    {
      $group: {
        _id: '$hostel',
        minimumPrice: { $min: '$price' },
      },
    },
  ]);

  try {
    await this.model('Hostel').findByIdAndUpdate(hostelId, {
      minimumPrice: Math.ceil(obj[0].minimumPrice / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getMinimumPrice after save
RoomSchema.post('save', function() {
  this.constructor.getMinimumPrice(this.hostel);
});

// Call getMinimumPrice before remove
RoomSchema.pre('remove', function() {
  this.constructor.getMinimumPrice(this.hostel);
});

module.exports = mongoose.model('Room', RoomSchema);
