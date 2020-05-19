const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const path = require('path');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/error');
// Load env vars
dotenv.config({ path: './config/config.env' });
const connectDB = require('./config/db');
// Connect to database
connectDB();
// Route files
const hostels = require('./routes/hostels');
const rooms = require('./routes/rooms');
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());
app.use(fileupload());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Cookie parser
app.use(cookieParser());

// Dev logging morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/hostels', hostels);
app.use('/api/v1/rooms', rooms);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  ),
);

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.cyan.underline.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
