const router = require('express').Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/card', shopController.getCard);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);

module.exports = router;
