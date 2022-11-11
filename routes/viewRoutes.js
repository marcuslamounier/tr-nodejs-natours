const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router
  .get(
    '/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewsController.getOverview
  )
  .get(
    '/login',
    authController.isLoggedIn,
    viewsController.getLoginForm
  )
  .get(
    '/tour/:slug',
    authController.isLoggedIn,
    viewsController.getTour
  )
  .get('/me', authController.protect, viewsController.getAccount)
  .get(
    '/my-tours',
    authController.protect,
    viewsController.getMyTours
  )
  .post(
    '/submit-user-data',
    authController.protect,
    viewsController.updateUserData
  );

module.exports = router;
