let config = {
  db: {
    name: process.env.DB_NAME,
    url: process.env.DB_URL,
    poolSize: process.env.DB_POOL_SIZE
  }
};

module.exports = config;
