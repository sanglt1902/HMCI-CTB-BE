const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(process.env.DB_URL, {
  poolSize: process.env.DB_POOL_SIZE,
  reconnectInterval: 5000,
  useNewUrlParser: true
});

async function getDbConnection() {
  if (!client.isConnected()) {
    try {
      await client.connect();
    } catch (error) {
      console.log(error.message);
    }
  }

  return client.db(process.env.DB_NAME);
}

async function setupUserDb(db) {
  await db.collection('users').insertOne({
    _id: ObjectId.createFromHexString('a00000000000000000000000'),
    name: 'Tien Do',
    email: 'tiendq@gmail.com',
    provider: {
      name: 'Google'
    }
  });

  await db.collection('users').insertOne({
    _id: ObjectId.createFromHexString('b00000000000000000000000'),
    name: 'Tester',
    email:'tester@example.com'
  });

  await db.collection('users').insertOne({
    _id: ObjectId.createFromHexString('c00000000000000000000000'),
    name: 'Bill Gates',
    email: 'bill@test.com',
    provider: {
      name: 'Google'
    }
  });

  await db.collection('users').insertOne({
    _id: ObjectId.createFromHexString('aaaa00000000000000000000'),
    name: 'Test AAAA',
    email: 'aaaa@test.com',
    provider: {
      name: 'Facebook'
    }
  });

  await db.collection('users').insertOne({
    _id: ObjectId.createFromHexString('bbbb00000000000000000000'),
    name: 'Test BBBB',
    email: 'bbbb@test.com',
    provider: {
      name: 'Facebook'
    }
  });

  await db.collection('users').insertOne({
    _id: ObjectId.createFromHexString('cccc00000000000000000000'),
    name: 'Test CCCC',
    email: 'cccc@test.com',
    provider: {
      name: 'Facebook'
    }
  });
}

async function teardownUserDb(db) {
  await db.collection('users').deleteMany({});
}

module.exports = {
  getDbConnection,
  setupUserDb,
  teardownUserDb
};
