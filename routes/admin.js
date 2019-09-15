const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const admminController = require('../controllers/admin');
const checkIsLoggedIn = require('../middlewares/checkIsLoggedIn');

router.get('/add-product', checkIsLoggedIn, admminController.getAddProduct);
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 120 }),
  ],
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
  [
    body('title')
      .isString()
      .isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 120 }),
  ],
  checkIsLoggedIn,
  admminController.postEditProduct,
);
router.post(
  '/delete-product',
  checkIsLoggedIn,
  admminController.postDeleteProduct,
);

exports.routes = router;
