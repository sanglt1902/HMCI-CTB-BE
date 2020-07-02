const asyncMiddleware = require('./async');
const errorHandlerMiddleware = require('./error');
const accessPermissionMiddleware = require('./permission');

module.exports = {
  asyncMiddleware,
  errorHandlerMiddleware,
  accessPermissionMiddleware
};
