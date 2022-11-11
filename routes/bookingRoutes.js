const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.get('/my-bookings', bookingController.getMyBookings);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(
    bookingController.setQueryForTourId,
    bookingController.setQueryForUserId,
    bookingController.getAllBookings
  )
  .post(
    bookingController.setBodyForTourAndUserIds,
    bookingController.createBooking
  );

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
