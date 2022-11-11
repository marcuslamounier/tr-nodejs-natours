const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bookingRouter = require('./bookingRoutes');

const router = express.Router();

router
  .post('/signUp', authController.signUp)
  .post('/login', authController.login)
  .get('/logout', authController.logout)
  .post('/forgotPassword', authController.forgotPassword)
  .patch('/resetPassword/:token', authController.resetPassword);

// Protect routes from this point
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router
  .route('/me')
  .get(userController.getMe, userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  )
  .delete(userController.deleteMe);

// Restrict routes from this point
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.get(
  '/guides',
  userController.aliasGuides,
  userController.getAllUsers
);

router
  .route(`/:id`)
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.use('/:userId/bookings', bookingRouter);

module.exports = router;
