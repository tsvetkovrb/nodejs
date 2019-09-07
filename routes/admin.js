const express = require('express');
const router = express.Router();

const admminController = require('../controllers/admin');
const checkIsLoggedIn = require('../middlewares/checkIsLoggedIn');

router.get('/add-product', checkIsLoggedIn, admminController.getAddProduct);
router.post('/add-product', checkIsLoggedIn, admminController.postAddProduct);
router.get('/products', checkIsLoggedIn, admminController.getProducts);
router.get('/edit-product/:productId', checkIsLoggedIn, admminController.getEditProduct);
router.post('/edit-product', checkIsLoggedIn, admminController.postEditProduct);
router.post('/delete-product', checkIsLoggedIn, admminController.deleteProduct);

exports.routes = router;
