const argon2 = require('argon2');
const { ObjectId } = require('mongodb');

const { getDatabase } = require('../utils/getDatabase');

const baseUser = {
  validated: false,
  characters: [],
  campaigns: [],
  email: null,
  friends: [],
  friendRequests: [],
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

async function search({ name, ids }) {
  const db = await getDatabase('users');

  const $and = [];
  if (name) $and.push({ name: RegExp(name, 'i') });
  if (ids) $and.push({ _id: { $in: ids.map(id => ObjectId(id)) } });

  const users = await db.find({ $and }).toArray();

  return users.map(user => ({
    id: user._id,
    ...user,
  }));
}
module.exports.search = search;

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

async function sendFriendRequest(idSender, idReceiver) {
  const db = await getDatabase('users');
  const filters = { friends: true, friendRequests: true, name: true };
  const [sender, receiver] = await Promise.all([
    db.findOne({ _id: ObjectId(idSender) }, filters),
    db.findOne({ _id: ObjectId(idReceiver) }, filters),
  ]);

  if (!sender) throw new Error(`User ${idSender} does not exist`);
  if (!receiver) throw new Error(`User ${idReceiver} does not exist`);
  if (sender.friends.includes(idReceiver))
    throw new Error(`You are already friends with ${receiver.name}`);
  if (receiver.friendRequests.includes(idSender))
    throw new Error(
      `You have already sent them a friend request to ${receiver.name}`,
    );
  if (sender.friendRequests.includes(idReceiver)) {
    await Promise.all([
      await db.updateOne(
        { _id: ObjectId(idSender) },
        {
          $push: { friends: idReceiver },
          $pull: { friendRequests: idReceiver },
        },
      ),
      await db.updateOne(
        { _id: ObjectId(idReceiver) },
        {
          $push: { friends: idSender },
          $pull: { friendRequests: idSender },
        },
      ),
    ]);
  } else {
    await db.updateOne(
      { _id: ObjectId(idReceiver) },
      { $push: { friendRequests: idSender } },
    );
  }

  return true;
}
module.exports.sendFriendRequest = sendFriendRequest;
