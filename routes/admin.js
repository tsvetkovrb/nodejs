const express = require('express');

const path = require('path');

const router = express.Router();

const rootDir = require('../utils/path');

const products = [];

router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
  });
});

router.post('/add-product', (req, res) => {
  const title = req.body.title;

  products.push({ title });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
