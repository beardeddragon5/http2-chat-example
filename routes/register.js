'use strict';

const UserService = require("../src/UserService");
const cookie = require("cookie");

module.exports = {
  "*": function register(req, res, path) {
    const cookies = cookie.parse(req.headers.cookie)
    const username = cookies.user;

    req.socket.setTimeout(2147483647); // MAX Integer
    res.stream.respond({
      ':status': 200,
      'content-type': 'text/event-stream',
      'access-control-allow-origin': '*',
      'cache-control': 'no-cache',
    });

    UserService.register(username, res);
    res.on("close", () => UserService.unregister(username))
  }
};
