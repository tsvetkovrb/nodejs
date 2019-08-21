const ObjectId = require('mongodb').ObjectId;
const getDb = require('../utils/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
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
      items: [{ productId: new ObjectId(product._id), quantity: 1 }],
    };
    const db = getDb();

    db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } },
    );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
