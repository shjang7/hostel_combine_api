const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a review title'],
    maxLength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating from 1 and 5'],
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

// Prevent user from submitting more than one review per hostel
ReviewSchema.index({ hostel: 1, user: 1 }, { unique: true });

// Static method to get avg of review ratings
ReviewSchema.statics.getAverageRating = async function(hostelId) {
  const obj = await this.aggregate([
    {
      $match: { hostel: hostelId },
    },
    {
      $group: {
        _id: '$hostel',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  const averageRating =
    obj.length > 0 ? Math.round(obj[0].averageRating * 10) / 10 : null;

  try {
    await this.model('Hostel').findByIdAndUpdate(hostelId, { averageRating });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.hostel);
});

// Update review
ReviewSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  update.updatedAt = Date.now();
  next();
});

ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.hostel);
});

module.exports = mongoose.model('Review', ReviewSchema);
