const { getRoom } = require('../../utils/room');
const { sendMessage } = require('../../utils/socket');
const { SOCKET_TYPES } = require('../../enums');

function joinRoomGraphQL({ id }, { userToken }) {
  const room = getRoom({ roomId: id });
  room.addUser(userToken.id, { ready: false });
  sendMessage(room.getUserIds(), SOCKET_TYPES.DASHBOARD, 'room-join', {
    userId: userToken.id,
  });
  return true;
}

module.exports = joinRoomGraphQL;
