const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const API_URL = '/api/v1';
const app = express();

// 1) GLOBAL MIDDLEWARES
app
  .set('view engine', 'pug')
  .set('views', path.join(__dirname, 'views'))

  // Serving static files
  .use(express.static(path.join(__dirname, 'public')))

  // Set security HTTP headers

  // .use(helmet())
  .use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],

        fontSrc: ["'self'", 'https:', 'data:'],

        frameSrc: ["'self'", 'https:', 'data:'],

        scriptSrc: [
          "'self'",
          'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
          'unsafe-inline',
        ],

        scriptSrcElem: [
          "'self'",
          'https:',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
        ],

        styleSrc: ["'self'", 'https:', 'unsafe-inline'],

        connectSrc: [
          "'self'",
          'data',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
        ],
      },
    })
  );

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app
  // Limit requests from same IP
  .use(
    '/api',
    rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message:
        'Too many requests from this IP. Please try again later!',
    })
  )

  // Body parser, reading data from body into req.body
  .use(express.json({ limit: '10kb' }))
  .use(express.urlencoded({ extended: true, limit: '10kb' }))
  .use(cookieParser())

  // Data sanitization against NoSQL query injection
  .use(mongoSanitize())

  // Data sanitization against XSS
  .use(xss())

  // Prevent parameter pollution
  .use(
    hpp({
      whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price',
      ],
    })
  )

  // Testing headers
  .use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  })

  // Routes
  .use('/', viewRouter)
  .use(`${API_URL}/tours`, tourRouter)
  .use(`${API_URL}/users`, userRouter)
  .use(`${API_URL}/reviews`, reviewRouter)
  .use(`${API_URL}/bookings`, bookingRouter)
  .all('*', (req, res, next) => {
    const err = new AppError(
      `Cannot find ${req.originalUrl}`,
      404
    );

    next(err);
  })
  .use(globalErrorHandler);

module.exports = app;
