let config = {
  logger: {
    level: process.env.LOGGER_LEVEL,
    enabled: process.env.LOGGER_ENABLED,
    fileName: process.env.LOGGER_FILENAME
  }
};

module.exports = config;
