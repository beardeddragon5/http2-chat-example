'use strict';

const webapp = require("./webapp");
const message = require("./message");
const register = require("./register");
const users = require("./users");

module.exports = function router(req, res) {
  const reqPath = req.headers[':path'];
  const reqMethod = req.headers[':method'];

  const routeMethod = (app) => {
    if (app[reqMethod]) {
      return app[reqMethod](req, res, reqPath);
    }
    if (app["*"]) {
      return app["*"](req, res, reqPath);
    }
    res.stream.respond({':status': 405 });
    res.stream.end('<h1>METHOD NOT ALLOWD</h1>');
    return;
  }

  console.log(reqMethod, ":", reqPath);

  switch(reqPath) {
    case '/':
      routeMethod(webapp);
      break;
    case '/register':
      routeMethod(register);
      break;
    case '/message':
      routeMethod(message);
      break;
    case '/users':
      routeMethod(users);
      break;
    default:
      res.stream.respond({ 'content-type': 'text/html', ':status': 404 });
      res.stream.end('<h1>Page Not Found</h1>');
      break;
  }
};
