let idCount = 0;
const MAX_ROOMS = 1000000;

class Room {
  constructor(ownerId, type) {
    this.id = idCount;
    idCount = (idCount + 1) % MAX_ROOMS;
    this.ownerId = ownerId;
    this.type = type;
    this.users = {};
  }

  addUser(userId, properties = {}) {
    this.users[userId] = {
      id: userId,
      ...properties,
    };
  }

  getUser(userId) {
    return this.users[userId];
  }

  getUserIds() {
    return this.users.map(({ id }) => id);
  }

  removeUser(userId) {
    delete this.users[userId];
  }

  isEmpty() {
    return Object.keys(this.users).length === 0;
  }
}

const rooms = {};

function createRoom(ownerId, type) {
  const room = new Room(ownerId, type);
  rooms[room.id] = room;
  return room;
}

function getRoom({ roomId, userId }) {
  if (roomId) {
    return rooms[roomId];
  }
  if (userId) {
    return rooms.find(room => room.users.find(user => user.id === userId));
  }
  throw new Error('Not specified any query to get a room');
}

module.exports = { Room, createRoom, getRoom };
