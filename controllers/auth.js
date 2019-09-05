const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1];
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5d696fb7c66f040ad162d4d0')
  .then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect('/');
  })
  .catch(error => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(error => {
    console.log(error);
    res.redirect('/');
  });
};
