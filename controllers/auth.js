const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY,
    },
  }),
);

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash('error');

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(error => {
              return res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        })
        .catch(error => {
          console.log(error);
          res.redirect('/login');
        });
    })
    .catch(error => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(error => {
    console.log(error);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash('error');

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email exists alredy.');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'tsvetkovv22@gmail.com',
            subject: 'Signup succseded',
            html: '<h1>You succsessfuly signed up!</h1>',
          });
        })
        .catch(error => {});
    })
    .catch(error => console.log(error));
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash('error');

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;

  crypto.randomBytes(32, (error, butffer) => {
    if (error) {
    }
    const token = butffer.toString('hex');
    console.log(token);
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        user.save().then(result => {
          res.redirect('/');
          transporter.sendMail({
            to: email,
            from: 'tsvetkovv22@gmail.com',
            subject: 'Password reset',
            html: `
            <h1>You requested a password reset</h1>
            <p>Click this <a href="http://localhost:2222/reset/${token}">link</a> to set a new password. </p>
            `,
          });
        });
      })
      .catch(error => {});
  });
};

exports.getNewPassword = (req, res, nex) => {
  const { token } = req.params;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      let errorMessage = req.flash('error');

      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New password',
        errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(error => {});
};

exports.postNewPassword = (req, res, next) => {
  const {
    password: newPassword,
    userId: _id,
    passwordToken: resetToken,
  } = req.body;

  let resetUser;

  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() }, _id })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.token = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      });
    })

    .then(() => {
      res.redirect('/login');
    })
    .catch(error => {});
};
