const jwt = require('jsonwebtoken');

const db = require('../../db');

async function loginGraphQL({ name, password }) {
  const user = await db.users.verify(name, password);
  let token = null;
  if (user) {
    token = jwt.sign({ id: user._id, name }, process.env.JWT_SECRET);
  }
  if (!token) throw new Error('User or password incorrect');
  return token;
}

module.exports = loginGraphQL;
