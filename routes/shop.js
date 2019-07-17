const path = require('path');
const router = require('express').Router();

const rootDir = require('../utils/path');

const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log(adminData.products);
  res.render('shop'); // Понимает какой файл использовать, т.к прописан конфиг в index.js
});

module.exports = router;
