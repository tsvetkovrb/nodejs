const express = require('express');
const router = express.Router();

const admminController = require('../controllers/admin');

router.get('/add-product', admminController.getAddProduct);
router.get('/products', admminController.getProducts);
router.post('/add-product', admminController.postAddProduct);

exports.routes = router;
