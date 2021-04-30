const { getRoom } = require('../../utils/room');

function getRoomGraphQL({ id }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  const room = getRoom({ roomId: id });
  return {
    id: room.id,
    userList: room.properties.userList,
    ownerId: room.ownerId,
  };
}

module.exports = getRoomGraphQL;
