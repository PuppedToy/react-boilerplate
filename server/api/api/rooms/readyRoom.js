const { getRoom } = require('../../utils/socket');

function readyRoomGraphQL({ id, ready }, { userToken }) {
  const room = getRoom({ roomId: id });
  room.getUser(userToken.id).ready = ready;
  room.broadcast('room-ready', { userId: userToken.id });
  return true;
}

module.exports = readyRoomGraphQL;
