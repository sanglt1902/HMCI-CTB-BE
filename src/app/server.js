const http = require('http');
const config = require('../config');
const { logger } = require('../common');
const app = require('./app');

function start() {
  // Separate Express 'app' and 'server'
  // https://github.com/goldbergyoni/nodebestpractices#-14-separate-express-app-and-server
  const server = http.createServer(app);

  server.listen(config.port, () => {
    logger.info(`Started application in ${config.env} mode`);
    logger.info('Listening at %o', server.address());
  });
}

module.exports = {
  start
};
