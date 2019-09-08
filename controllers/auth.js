const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SEND_GRID_API_KEY,
  }
}))

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
              console.log('TCL: exports.postLogin -> error', error);
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
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email exists alredy.');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashePassword => {
          const user = new User({
            email,
            password: hashePassword,
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
            html: '<h1>You succsessfuly signed up!</h1>'
          })
        }).catch(error => {
          console.log('TCL: exports.postSignup -> error', error);
        });
    })
    .catch(error => console.log(error));
};
