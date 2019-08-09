const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://tsvetkovrb:k4hqxZvfpqobg8Sv@complete-nodejs-r4pdy.mongodb.net/shop?retryWrites=true&w=majority',
  )
    .then(client => {
      _db = client.db();
      console.log('Connected!');
      callback()
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
}

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw 'No databese found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;