const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/product', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

app.get('/add-product', (req, res, next) => {
  res.send(`
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Hello</title>
    </head>
    <body>
      <form action="/product" method="POST">
        <input type="text" name="title">
        <input type="button" value="Submit">
      </form>
    </body>
    </html>
  `);
});

app.get('/', (req, res, next) => {
  res.send('<h1>Hello from Express</h1>');
});

app.listen(3001, () => console.log('Server is listen on port 3001'));
