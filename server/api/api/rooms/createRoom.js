const { createRoom } = require('../../utils/room');

function createRoomGraphQL({ type }, { userToken }) {
  const room = createRoom(userToken.id, type);
  room.addUser(userToken.id, { ready: false });
  return room.id;
}

module.exports = createRoomGraphQL;
