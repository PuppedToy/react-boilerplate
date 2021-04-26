const db = require('../../db');

async function sendFriendRequestGraphQL({ id }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  if (!id) {
    throw new Error('The friend request must be sent to someone');
  }

  if (id === userToken.id) {
    throw new Error("The user can't send a friend request to themselves");
  }

  return db.users.sendFriendRequest(userToken.id, id);
}

module.exports = sendFriendRequestGraphQL;
