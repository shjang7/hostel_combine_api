const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
// Load env vars
dotenv.config({ path: './config/config.env' });
const connectDB = require('./config/db');
// Connect to database
connectDB();
// Route files
const hostels = require('./routes/hostels');

const app = express();

// Dev logging morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/hostels', hostels);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
