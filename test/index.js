const { MongoMemoryServer } = require('mongodb-memory-server');
const tester = require('greenlock-store-test');
const Store = require('../');

let store;
let mongoServer;

MongoMemoryServer.create({
  instance: {
    dbName: 'mongodb-test',
  },
})
  .then((mongod) => {
    mongoServer = mongod;
    store = Store.create({
      datastore: {
        url: mongoServer.getUri(),
        database: 'mongodb-test',
      },
    });
  })
  .then(() => {
    return tester.test(store);
  })
  .then(function () {
    console.info('PASS');
  })
  .catch(function (err) {
    console.error('FAIL');
    console.error(err);
    process.exit(20);
  })
  .then(() => {
    store._data.close();
    return mongoServer.stop();
  });
