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

    .catch(err => console.log(err));
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({
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
    .catch(error => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId: _id } = req.body;
  const { _id: userId } = req.user;

  Product.deleteOne({ _id, userId })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
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
    .catch(error => console.log(error));
};
