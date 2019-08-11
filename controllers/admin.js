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

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId)
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
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    editProductId,
  );
  product
    .save()
    .then(result => {
      console.log('Updated product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin products',
        path: '/admin/products',
      }); // Понимает какой файл использовать, т.к прописан конфиг в index.js
    })
    .catch(error => console.log(error));
};
