const db = require('../../db');

async function searchUserGraphQL({ name }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  if (!name) {
    return [];
  }

  return db.users.search({ name });
}

module.exports = searchUserGraphQL;
