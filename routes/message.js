'use strict';

const UserService = require("../src/UserService");
const cookie = require("cookie");

module.exports = {
  POST: function message(req, res, path) {
    const cookies = cookie.parse(req.headers.cookie)
    if (!cookies.user) {
      console.log('user unknown')
      res.stream.respond({ 'content-type': 'text/html', ':status': 401 });
      res.stream.end();
      return;
    }

    let jsonString = '';
    req.on('data', (data) => {
        jsonString += data;
    });
    req.on('end', () => {
      const json = JSON.parse(jsonString);
      UserService.send('info', {
        sender: cookies.user,
        msg: json.msg
      });
    });
    res.stream.respond({ 'content-type': 'text/html', ':status': 204 });
    res.stream.end();
    return;
  }
};
