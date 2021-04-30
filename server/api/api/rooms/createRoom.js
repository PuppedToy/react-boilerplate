const { createRoom } = require('../../utils/socket');

function createRoomGraphQL({ type }, { userToken }) {
  const id = createRoom(userToken.id, type);
  return id;
}

module.exports = createRoomGraphQL;
