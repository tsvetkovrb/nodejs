const router = require('express').Router();

const shopController = require('../controllers/shop');
const checkIsLoggedIn = require('../middlewares/checkIsLoggedIn');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct);

router.get('/cart', checkIsLoggedIn, shopController.getCart);
router.post('/cart', checkIsLoggedIn, shopController.postCart);
router.post('/card-delete-item', checkIsLoggedIn, shopController.postCartDeleteProduct);
router.get('/orders', checkIsLoggedIn, shopController.getOrders);
router.post('/create-order', checkIsLoggedIn, shopController.postOrder);

module.exports = router;
