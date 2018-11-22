'use strict';

const users = new Map();

module.exports = class UserService {

  static register(username, res) {
    users.set(username, res);
    UserService.send('oper', { oper: 'add', user: username });
  }

  static unregister(username) {
    users.delete(username);
    UserService.send('oper', { oper: 'del', user: username });
  }

  static send(event, json) {
    Array.from(users.values())
      .forEach(res => res.write(`event: ${event}\ndata: ${JSON.stringify(json).replace('\n', '<br/>')}\n\n`, 'utf8'));
  }

  static usernames() {
    return Array.from(users.keys());
  }

}
