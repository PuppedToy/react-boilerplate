const db = require('../../db');

async function searchUserGraphQL({ name, ids }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  return db.users.search({ name, ids });
}

module.exports = searchUserGraphQL;
