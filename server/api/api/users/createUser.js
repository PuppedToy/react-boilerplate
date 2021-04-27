const db = require('../../db');
const login = require('./login');

async function createUserGraphQL({ name, password }) {
  await db.users.create(name, password);
  const token = await login({ name, password });
  return token;
}

module.exports = createUserGraphQL;
