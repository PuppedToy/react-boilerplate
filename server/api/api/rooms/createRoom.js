const { createRoom } = require('../../utils/room');
const { sendMessage } = require('../../utils/socket');
const { SOCKET_TYPES } = require('../../enums');

function createRoomGraphQL({ type, userList }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  const room = createRoom(userToken.id, type, {
    userList: [userToken.id, ...userList],
  });
  room.addUser(userToken.id, { ready: false });
  sendMessage([...userList], SOCKET_TYPES.DASHBOARD, 'room-invite', {
    host: userToken,
    roomId: room.id,
  });
  return room.id;
}

module.exports = createRoomGraphQL;