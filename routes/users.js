'use strict';

const UserService = require("../src/UserService");

module.exports = {
  GET: function users(req, res, path) {
    res.stream.respond({ 'content-type': 'application/json', ':status': 200 });
    res.stream.end(JSON.stringify(UserService.usernames()));
    return;
  }
};
