const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;



const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(error => console.log(error));

  next();
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(2222, () => console.log('http://localhost:2222'));
})