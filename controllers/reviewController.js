const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const factory = require('./handleFactory');

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.restrictToBookedTours = catchAsync(
  async (req, res, next) => {
    const bookings = await Booking.find({
      user: req.user.id,
      tour: req.body.tour,
    });

    if (bookings <= 0) {
      return next(
        new AppError(
          'Review may be posted only by users that booked the tour',
          401
        )
      );
    }

    next();
  }
);

exports.setBodyForTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.setQueryForTourId = (req, res, next) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;
  next();
};
