const db = require('../../db');

async function getUserGraphQL({ id }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  if (!id) {
    return db.users.getById(userToken.id);
  }

  return db.users.getById(id);
}

module.exports = getUserGraphQL;
