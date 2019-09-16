const User = require('../models/user');

const { check, body } = require('express-validator');

exports.postAddProduct = (req, res, next) => {
  body('title')
    .isString()
    .isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 120 }),
    next();
};

exports.postEditProduct = (req, res, next) => {
  body('title')
    .isString()
    .isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 120 });
  next();
};

exports.postLogin = (req, res, next) => {
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password', 'Please enter a valid password')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim();

  next();
};

exports.postSignup = (req, res, next) => {
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('Email exists alredy.');
        }
      });
    })
    .normalizeEmail(),
    body('password', 'Please, enter a valid password')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match');
        }
        return true;
      })
      .trim();

  next();
};
