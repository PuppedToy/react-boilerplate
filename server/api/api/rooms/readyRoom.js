const { getRoom } = require('../../utils/room');
const { sendMessage } = require('../../utils/socket');
const { SOCKET_TYPES } = require('../../enums');

function readyRoomGraphQL({ id, ready }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  const room = getRoom({ roomId: id });
  room.getUser(userToken.id).ready = ready;
  sendMessage(room.getUserIds(), SOCKET_TYPES.DASHBOARD, 'room-ready', {
    userId: userToken.id,
    ready,
  });
  return true;
}

module.exports = readyRoomGraphQL;
