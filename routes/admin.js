const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const admminController = require('../controllers/admin');
const checkIsLoggedIn = require('../middlewares/checkIsLoggedIn');
const validation = require('../middlewares/validation');

router.get('/add-product', checkIsLoggedIn, admminController.getAddProduct);
router.post(
  '/add-product',
  validation.postAddProduct,
  checkIsLoggedIn,
  admminController.postAddProduct,
);
router.get('/products', checkIsLoggedIn, admminController.getProducts);
router.get(
  '/edit-product/:productId',
  checkIsLoggedIn,
  admminController.getEditProduct,
);
router.post(
  '/edit-product',
  validation.postEditProduct,
  checkIsLoggedIn,
  admminController.postEditProduct,
);
router.delete(
  '/product/:productId',
  checkIsLoggedIn,
  admminController.deleteProduct,
);

exports.routes = router;
