const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  const { productId } = req.params;

  let editProduct;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findByPk(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch(error => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, editProductId } = req.body;
  Product.findByPk(editProductId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;

  Product.create({
    title,
    price,
    imageUrl,
    description,
  })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findByPk(productId)
    .then(product => product.destroy())
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin products',
        path: '/admin/products',
      }); // Понимает какой файл использовать, т.к прописан конфиг в index.js
    })
    .catch(error => console.log(error));
};
