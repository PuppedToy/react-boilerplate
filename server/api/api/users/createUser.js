const db = require('../../db');
const login = require('./login');

// TODO return creation result instead of true or false
async function createUserGraphQL({ name, password }) {
  await db.users.create(name, password);
  const token = await login({ name, password });
  return token;
}

module.exports = createUserGraphQL;
