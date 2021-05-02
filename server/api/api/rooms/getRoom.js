const { getRoom } = require('../../utils/room');
const { USER_ROOM_STATES } = require('../../enums');

function getRoomGraphQL({ id }, { userToken }) {
  if (!userToken) throw new Error('The user is not authenticated');

  const room = getRoom({ roomId: id });
  const userList = room.properties.userList.map(userId => {
    const foundUser = room.getUser(userId);
    let state = USER_ROOM_STATES.DISCONNECTED;
    if (foundUser && foundUser.ready) state = USER_ROOM_STATES.READY;
    else if (foundUser) state = USER_ROOM_STATES.CONNECTED;
    return {
      id: userId,
      state,
    };
  });

  return {
    id: room.id,
    userList,
    ownerId: room.ownerId,
  };
}

module.exports = getRoomGraphQL;
