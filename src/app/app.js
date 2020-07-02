const express = require('express');
const JWT = require('express-jwt');
const config = require('../config');
const { logger } = require('../common');
const { errorHandlerMiddleware } = require('../middlewares');
const { createUserRoute } = require('../modules/user');

const app = express();

// If the token is valid, request.user will be set with the JSON object decoded,
// otherwise request is rejected with 401 error.
app.use(JWT({ secret: config.jwtSecret }));
app.use(`/${config.version}/users`, createUserRoute());
app.use(errorHandlerMiddleware(logger));

module.exports = app;
