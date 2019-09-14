exports.get404 = (req, res, next) => {
res.status(404).render('404', {
  layout: false,
    pageTitle: 'Page Not Found',
    path: '/not-found',
    isAuthenticated: req.session.isLoggedIn,
    });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    layout: false,
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
};
