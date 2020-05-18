const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Read JSON files
const hostels = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/hostels.json`, 'utf-8'),
);

// Read JSON files
const rooms = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/rooms.json`, 'utf-8'),
);

// Import into DB
const importData = async () => {
  try {
    await Hostel.create(hostels);
    await Room.create(rooms);

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
