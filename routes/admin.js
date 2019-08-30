const express = require('express');
const router = express.Router();

const admminController = require('../controllers/admin');

router.get('/add-product', admminController.getAddProduct);
router.post('/add-product', admminController.postAddProduct);
router.get('/products', admminController.getProducts);
router.get('/edit-product/:productId', admminController.getEditProduct);
router.post('/edit-product', admminController.postEditProduct);
router.post('/delete-product', admminController.deleteProduct);

exports.routes = router;
