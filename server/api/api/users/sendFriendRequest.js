const db = require('../../db');
const { sendMessage } = require('../../utils/socket');
const { SOCKET_TYPES } = require('../../enums');

async function sendFriendRequestGraphQL({ id }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  if (!id) {
    throw new Error('The friend request must be sent to someone');
  }

  if (id === userToken.id) {
    throw new Error("The user can't send a friend request to themselves");
  }

  sendMessage(id, SOCKET_TYPES.DASHBOARD, 'reload');

  return db.users.sendFriendRequest(userToken.id, id);
}

module.exports = sendFriendRequestGraphQL;
