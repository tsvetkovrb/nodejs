const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.findById(id)
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
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(error => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products,
      });
    })
    .catch(error => console.log(error));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(productId);
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => res.redirect('/cart'))
  //   .catch(error => console.log(error));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(error => console.log(error));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(error => console.log(error));
};
