const joi = require('@hapi/joi');

let schema = joi.object({
  NODE_ENV: joi.string().allow('development', 'production', 'staging', 'test').required(),
  HOST_PORT: joi.string().required(),
  HOST_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  VERSION: joi.string().required()
}).unknown().required();

let { error, value } = schema.validate(process.env);

if (error)
  throw new Error(`Config validation error: ${error.message}`);

let config = {
  env: value.NODE_ENV,
  port: value.HOST_PORT,
  url: value.HOST_URL,
  jwtSecret: value.JWT_SECRET,
  version: value.VERSION
};

module.exports = config;
