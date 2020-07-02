const { MongoClient } = require('mongodb');
const config = require('../config');
const logger = require('./logger');

// Ref: http://mongodb.github.io/node-mongodb-native/3.2/api/MongoClient.html
const client = new MongoClient(config.db.url, {
  poolSize: config.db.poolSize,
  reconnectInterval: 5000,
  useNewUrlParser: true
});

async function connectToDb() {
  try {
    await client.connect();
  } catch (error) {
    logger().error(error.message);
  }
}

async function getDbConnection() {
  if (!client.isConnected())
    await connectToDb();

  return client.db(config.db.name);
}

module.exports = getDbConnection;
