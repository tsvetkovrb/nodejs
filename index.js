const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5d696fb7c66f040ad162d4d0')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => console.log(error));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://tsvetkovrb:k4hqxZvfpqobg8Sv@complete-nodejs-r4pdy.mongodb.net/shop?retryWrites=true&w=majority',
  )
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Roman',
          email: 'tsvetkovv22@gmail.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(2222, () => console.log('http://localhost:2222'));
  })
  .catch(error => console.log('Error connecting: ', error));
