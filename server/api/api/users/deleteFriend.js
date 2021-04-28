const db = require('../../db');

async function deleteFriendGraphQL({ id }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  if (!id) {
    throw new Error('The friend request must be sent to someone');
  }

  if (id === userToken.id) {
    throw new Error("The user can't delete themselves as friend");
  }

  return db.users.deleteFriend(userToken.id, id);
}

module.exports = deleteFriendGraphQL;
