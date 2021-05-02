const { createRoom } = require('../../utils/room');

function createRoomGraphQL({ type, userList }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  const room = createRoom(userToken.id, type, {
    userList: [userToken.id, ...userList],
  });
  room.addUser(userToken.id, { ready: false });
  return room.id;
}

module.exports = createRoomGraphQL;
