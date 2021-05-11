const users = require('./users');
const campaigns = require('./campaigns');
const rooms = require('./rooms');
const battles = require('./battles');

module.exports = {
  alive: () => true,
  token: (_, req) => req && req.userToken && req.userToken.id,
  ...users,
  ...campaigns,
  ...rooms,
  ...battles,
};
