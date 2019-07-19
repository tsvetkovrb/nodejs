const path = require('path');
const router = require('express').Router();

const rootDir = require('../utils/path');

const adminData = require('./admin');

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
  }); // Понимает какой файл использовать, т.к прописан конфиг в index.js
});

module.exports = router;
