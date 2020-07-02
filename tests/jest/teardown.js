'use strict';

module.exports = async function (globalConfig) {
  await global.__MONGOD__.stop();
}
