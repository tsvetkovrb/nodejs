const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: '/products',
    }); // Понимает какой файл использовать, т.к прописан конфиг в index.js
  });
};

exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id, product => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCard = (req, res, next) => {
  res.render('shop/card', {
    path: '/card',
    pageTitle: 'Your card',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Your Checkout',
  });
};

exports.postCard = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};
