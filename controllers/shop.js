const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 1;

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
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
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
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then(numberProduct => {
      totalItems = numberProduct;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch(error => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
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
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
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
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
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
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
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
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
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
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }

      const invoiceNmae = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoiceNmae);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${invoiceNmae}`);

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
      });
      pdfDoc.text('---------------------------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`,
          );
      });
      pdfDoc.text('------------------------');
      pdfDoc.fontSize(20).text(`Total price: ${totalPrice}`);
      pdfDoc.end();

      // fs.readFile(invoicePath, (error, data) => {
      //   if (error) {
      //     console.log('TCL: exports.getInvoice -> error', error);
      //     return next(error);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', `inline; filename=${invoiceNmae}`);
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch(error => next(error));
};
