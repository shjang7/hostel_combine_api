const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
// Load env vars
dotenv.config({ path: './config/config.env' });
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

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
