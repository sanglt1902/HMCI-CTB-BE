'use strict';

const http = require('http');
const debug = require('debug')('api:user');
const HttpStatus = require('@tiendq/http-status');
const config = require('../../config');
const { logger } = require('../../common');
const model = require('./model');

// GET /users/:userId
async function loadUser(request, response) {
  debug('GET %s', request.originalUrl);

  let userId = request.params.userId;

  if (userId !== request.user.userId && config.defaultUserId !== request.user.userId) {
    logger.warn('Requested user %s is not same authenticated user %s', userId, request.user.userId);

    return response.status(HttpStatus.BadRequest).json({
      error: {
        message: HttpStatus.Text.BadRequest
      }
    });
  }

  let user = await model.findUserById(userId);

  if (!user) {
    return response.status(HttpStatus.NotFound).json({
      error: {
        message: HttpStatus.Text.NotFound
      }
    });
  }

  response.status(HttpStatus.OK).json(user);
}

// GET /users?field1=value&field2=value...
async function loadAllUsers(request, response) {
  debug('GET %s', request.originalUrl);

  let params = model.getSearchParamsFromQueryString(request.query);

  if (0 === Object.entries(params.filter).length) {
    return response.status(HttpStatus.BadRequest).json({
      error: {
        message: HttpStatus.Text.BadRequest
      }
    });
  }

  let result = await model.findUsers(params);
  debug('Response: %O', result);

  response.status(result.code).json({
    data: {
      ...result.data
    }
  });
}

// POST /users
async function createUser(request, response) {
  debug('POST %s, %O', request.originalUrl, request.body);

  let newUser = {
    ...request.body
  };

  let result = await model.createUser(newUser);

  if (result) {
    response.set('Location', result.self);
    response.status(201).json(result);
  } else {
    response.status(500).json({ message: http.STATUS_CODES[500] });
  }
}

// PUT /users/:userId
async function updateUser(request, response) {
  debug('PUT %s, %O', request.originalUrl, request.body);
  response.status(501).json({ message: http.STATUS_CODES[501] });
}

module.exports = {
  createUser,
  loadUser,
  loadAllUsers,
  updateUser
};
