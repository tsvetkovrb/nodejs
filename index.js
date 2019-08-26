const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5d51612b779d34549802f439')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(error => console.log(error));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://tsvetkovrb:k4hqxZvfpqobg8Sv@complete-nodejs-r4pdy.mongodb.net/shop?retryWrites=true&w=majority',
  )
  .then(() => {
    app.listen(2222, () => console.log('http://localhost:2222'));
  })
  .catch(error => console.log('Error connecting: ', error));
