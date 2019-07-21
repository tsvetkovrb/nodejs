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

  Product.findById(productId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, editProductId } = req.body;

  const updatedProduct = new Product(
    editProductId,
    title,
    imageUrl,
    price,
    description,
  );

  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(null, title, imageUrl, price, description);
  product.save();

  res.redirect('/products');
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.deleteById(productId);

  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    }); // Понимает какой файл использовать, т.к прописан конфиг в index.js
  });
};
