'use strict';

const config = require('../../config');
const HttpStatus = require('@tiendq/http-status');
const { logger } = require('../../common');
// const { READ_WRITE } = require('../common/scope');
// const { generateAccessToken } = require('../common/utils');
const repository = require('./repository');

const READ_WRITE = 1;

function generateAccessToken(userId, scope) {}

async function findUserById(userId) {
  let result = await repository.findUserById(userId);

  if (!result)
    return result;

  let user = {
    id: result._id.toHexString(),
    ...result
  };

  return user;
}

async function findUserByEmail(email) {
  let result = await repository.findUserByEmail(email);

  if (!result)
    return result;

  let user = {
    id: result._id.toHexString(),
    ...result
  };

  return user;
}

async function createUser(user) {
  let newUser = {
    ...user,
    createdDate: new Date(),
    modifiedDate: new Date()
  };

  let userId = await repository.createUser(newUser);

  if (userId) {
    let result = {
      id: userId,
      type: 'User',
      self: `${config.url}/${config.version}/users/${userId}`
    };

    return result
  } else {
    return null;
  }
}

async function getAccessTokenForUser(userId) {
  let result = await repository.findUserById(userId);

  if (!result) {
    return {
      code: HttpStatus.NotFound,
      message: HttpStatus.Text.NotFound
    };
  }

  try {
    let token = await generateAccessToken(userId, READ_WRITE);

    logger.info('Generated access token for user %s', userId);

    return {
      code: HttpStatus.OK,
      message: HttpStatus.Text.OK,
      data: {
        token
      }
    };
  } catch (error) {
    logger.error('Failed to sign access token for user %s', userId);
    logger.error(error);

    return {
      code: HttpStatus.InternalServerError,
      message: HttpStatus.Text.InternalServerError
    };
  }
}

function getSearchParamsFromQueryString(query) {
  let filter = {};

  for (let [key, value] of Object.entries(query))
    filter[key] = value;

  return {
    filter
  };
}

// Find users by various parameters.
// filter: { field: value }
async function findUsers(params) {
  let users = await repository.findUsers(params);

  let result = {
    code: HttpStatus.OK,
    data: {
      type: 'Collection',
      self: `${config.url}/${config.version}/users`,
      contents: users.map(user => ({
        ...user,
        self: `${config.url}/${config.version}/users/${user.id}`
      }))
    }
  };

  return result;
}

module.exports = {
  findUserById,
  findUserByEmail,
  findUsers,
  getAccessTokenForUser,
  createUser,
  getSearchParamsFromQueryString
};
