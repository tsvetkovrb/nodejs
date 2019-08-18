const ObjectId = require('mongodb').ObjectId;
const getDb = require('../utils/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex(cp => {
    //   return cp._id === product.id;
    // })

    const updatedCart = {
      items: [{ ...product, quantity: 1 }],
    };
    const db = getDb();

    db.collection('users').updateOne(
      { _id: new ObjectId(this.id) },
      { $set: {cart: updatedCart} },
    );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
