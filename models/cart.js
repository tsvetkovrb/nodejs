const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json',
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the preveous cart
    fs.readFile(p, (error, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!error) {
        cart = JSON.parse(fileContent);
      } else {
      }
      // Analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id,
      );
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;
      //  Add new product/ incerease quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), error => {
        console.log(error);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (error, fileContent) => {
      if (error) {
        return;
      }
      const updatedCard = { ...JSON.parse(fileContent) };

      const product = updatedCard.products.find(prod => prod.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;

      updatedCard.products = updatedCard.products.filter(
        prod => prod.id !== id,
      );

      updatedCard.totalPrice =
        updatedCard.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCard), error => {
        console.log(error);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (error, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (error) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
