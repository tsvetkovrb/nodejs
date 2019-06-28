const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
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

router.post('/product', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
