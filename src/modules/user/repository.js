'use strict';

const { ObjectID } = require('mongodb');
const { getDbConnection } = require('../../common');

async function findUserById(userId) {
  let db = await getDbConnection();
  let result = await db.collection('users').findOne({
    _id: ObjectID.createFromHexString(userId)
  });

  return result;
}

async function findUserByEmail(email) {
  let db = await getDbConnection();
  let result = await db.collection('users').findOne({ email });

  return result;
}

async function findUsers(params) {
  let db = await getDbConnection();
  let documents = await db.collection('users').find({
    ...params.filter
  }, {
    projection: {
      fullName: 1,
      email: 1
    }
  }).toArray();

  let result = documents.map(doc => {
    return {
      ...doc,
      _id: undefined,
      id: doc._id.toHexString()
    };
  });

  return result;
}

async function createUser(user) {
  let db = await getDbConnection();
  let result = await db.collection('users').insertOne(user);

  return result ? result.insertedId.toHexString() : '';
}

module.exports = {
  findUserById,
  findUserByEmail,
  findUsers,
  createUser
};
