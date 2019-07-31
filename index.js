const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // можно заменить views по умолчанию на другую дирректорию

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => console.log(error));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
  constrains: true,
  onDelete: 'CASCADE',
});

User.hasMany(Product);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      User.create({
        name: 'Roman',
        email: 'tsvetkovv22@gmail.com',
      });
      return user;
    }
  })
  .then(user => {
    console.log(user);
    app.listen(3001, () => console.log('Server is listen on port 3001'));
  })
  .catch(error => console.log(error));
