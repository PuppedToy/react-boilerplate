const users = require('./users');

module.exports = {
  alive: () => true,
  token: (_, req) => req && req.userToken && req.userToken.id,
  ...users,
};
