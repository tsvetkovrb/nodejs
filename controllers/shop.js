const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
      }); // Понимает какой файл использовать, т.к прописан конфиг в index.js
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products,
      });
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
  .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(result => {
      res.redirect('/cart');
    })
   .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};
