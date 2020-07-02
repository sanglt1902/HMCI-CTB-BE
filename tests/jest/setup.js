'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function (globalConfig) {
  let mongod = new MongoMemoryServer({
    autoStart: false
  });

  await mongod.start();

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;

  process.env.DB_URL = await mongod.getConnectionString();
  process.env.DB_NAME = await mongod.getDbName();
  process.env.DB_POOL_SIZE = 5;
}
