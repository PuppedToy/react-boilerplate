const users = require('./users');
const campaigns = require('./campaigns');

module.exports = {
  alive: () => true,
  token: (_, req) => req && req.userToken && req.userToken.id,
  ...users,
  ...campaigns,
};
