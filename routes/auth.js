const express = require('express');
const { check, body } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('password', 'Please enter a valid password')
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin,
);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email exists alredy.');
          }
        });
      }),
    body('password', 'Please, enter a valid password')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    }),
  ],
  authController.postSignup,
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
