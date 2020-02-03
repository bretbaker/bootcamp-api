// import modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');

// load environament variables
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// initialize express
const app = express();

// instantiate body-parser middleware
app.use(express.json());

// instantiate cookie-parser middleware
app.use(cookieParser());

// instantiate morgan for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// instantiate file upload for bootcamp images
app.use(fileupload());

// serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// import and mount routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// instantiate error handler middleware
app.use(errorHandler);

// declare port
const PORT = process.env.PORT || 5000;

// instantiate server
const server = app.listen(
  PORT,
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

// error handle server connection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
