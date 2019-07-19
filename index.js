const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expresHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // можно заменить views по умолчанию на другую дирректорию

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', {
    layout: false,
    pageTitle: 'Page Not Found',
  });
});

app.listen(3001, () => console.log('Server is listen on port 3001'));
