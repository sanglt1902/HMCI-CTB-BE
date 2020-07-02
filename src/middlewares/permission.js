const Boom = require('@hapi/boom');

function accessPermissionMiddleware(scope) {
  return function (request, response, next) {
    if (scope === request.user.scope & scope)
      next();
    else
      next(Boom.forbidden());
  };
}

module.exports = accessPermissionMiddleware;
