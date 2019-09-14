// const ObjectId = require('mongoose').Types.ObjectId;
const { validationResult } = require('express-validator/check');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  const { productId } = req.params;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      return res.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, editProductId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
        _id: editProductId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(editProductId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save().then(result => {
        console.log('Updated product');
        res.redirect('/admin/products');
      });
    })
    .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const product = new Product({
    // _id: new ObjectId('5d7aaa63a87c9b399c808ea8'),
    price,
    title,
    description,
    imageUrl,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId: _id } = req.body;
  const { _id: userId } = req.user;

  Product.deleteOne({ _id, userId })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};

exports.getProducts = (req, res, next) => {
  const { _id: userId } = req.user;
  Product.find({ userId })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin products',
        path: '/admin/products',
      });
    })
    .catch(error => {
      const err = new Error(error)
      err.httpStatusCode = 500;
      return next(err)
    });
};
