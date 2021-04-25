const argon2 = require('argon2');
const { ObjectId } = require('mongodb');

const { getDatabase } = require('../utils/getDatabase');

const baseUser = {
  validated: false,
  characters: [],
  campaigns: [],
  email: null,
};

async function getById(id) {
  const db = await getDatabase('users');
  const user = await db.findOne({ _id: ObjectId(id) });

  return user
    ? {
        id: user._id,
        ...user,
      }
    : null;
}
module.exports.getById = getById;

async function verify(name, inputPassword) {
  const db = await getDatabase('users');
  const user = await db.findOne({ name });

  if (!user) return false;
  const isPasswordCorrect = await argon2.verify(user.password, inputPassword);
  if (!isPasswordCorrect) return false;

  return user;
}
module.exports.verify = verify;

async function create(name, password) {
  if (!name) {
    return Promise.reject(new Error("name can't be null"));
  }
  if (!password) {
    return Promise.reject(new Error("password can't be null"));
  }

  const [db, hashedPassword] = await Promise.all([
    getDatabase('users'),
    argon2.hash(password),
  ]);

  const user = await db.findOne({ name });
  if (user) throw new Error(`User ${name} already exists`);

  const result = await db.insertOne({
    name,
    password: hashedPassword,
    ...baseUser,
  });

  // This result contains insertedId, insertedCount and ops[] as fields that could be used.
  return result;
}
module.exports.create = create;
