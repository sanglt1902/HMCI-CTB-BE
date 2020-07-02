const debug = require('debug')('app');
const { parsed } = require('dotenv-safe').config({ silent: true });
const common = require('./common');
const logger = require('./logger');
const db = require('./db');

debug('Environment variables: %O', parsed);

module.exports = {
  ...common,
  ...db,
  ...logger
};
