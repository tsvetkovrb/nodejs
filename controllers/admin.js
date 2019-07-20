const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(title, imageUrl, price, description);
  product.save();

  res.redirect('/products');
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
