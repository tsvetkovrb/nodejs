const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://tsvetkovrb:k4hqxZvfpqobg8Sv@complete-nodejs-r4pdy.mongodb.net/test?retryWrites=true&w=majority',
  )
    .then(result => {
      callback(result)
    })
    .catch(error => console.log(error));
}
module.exports = mongoConnect;