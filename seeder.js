const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Read JSON files
const hostels = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/hostels.json`, 'utf-8'),
);

const rooms = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/rooms.json`, 'utf-8'),
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'),
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'),
);

// Import into DB
const importData = async () => {
  try {
    await Hostel.create(hostels);
    await Room.create(rooms);
    await User.create(users);
    await Review.create(reviews);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Hostel.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i' || process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-d' || process.argv[2] === '-delete') {
  deleteData();
}
