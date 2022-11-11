const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./bookingRoutes');

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .get(
    '/top-5-cheapest',
    tourController.aliasTop5Cheapest,
    tourController.getAllTours
  )
  .get('/tour-stats', tourController.getTourStats)
  .get(
    '/monthly-plan/:year',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .get(
    '/tours-within/:distance/center/:latlng/unit/:unit',
    tourController.getToursWithin
  )
  .get(
    '/distances/:latlng/unit/:unit',
    tourController.getDistances
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.use('/:tourId/reviews', reviewRouter);
router.use(
  '/:tourId/bookings',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  bookingRouter
);

module.exports = router;
