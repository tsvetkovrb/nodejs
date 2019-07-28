const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
      }); // Понимает какой файл использовать, т.к прописан конфиг в index.js
    })
    .catch(error => console.log(error));
};

exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  // Product.findAll({
  //   where: {
  //     id,
  //   },
  // })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       pageTitle: products[0].title,
  //       path: '/products',
  //       product: products[0],
  //     });
  //   })
  //   .catch(error => console.log(error));
  Product.findByPk(id)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(error => console.log(error));
};

exports.getCard = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cardProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id,
        );
        if (cartProductData) {
          cardProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products: cardProducts,
      });
    });
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
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};
