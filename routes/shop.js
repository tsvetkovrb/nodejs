const router = require('express').Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:id', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
// router.get('/orders', shopController.getOrders);
// router.post('/card-delete-item', shopController.postCartDeleteProduct);
// router.post('/create-order', shopController.postOrder);

module.exports = router;
