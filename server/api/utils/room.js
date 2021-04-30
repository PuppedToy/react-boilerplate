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

  emit(userId, message, payload) {
    if (!userId || !Object.hasOwnProperty.call(this.users, userId)) {
      throw new Error(`User ${userId} not in room ${this.id}`);
    }

    if (!message || typeof message !== 'string') {
      throw new Error(
        `Expected type to be of message string but found ${typeof type}`,
      );
    }

    if (Object.hasOwnProperty.call(this.users[userId], 'socket')) {
      this.users[userId].socket.emit(message, payload);
    }
  }

  broadcast(message, payload) {
    this.users.forEach(user => {
      try {
        this.emit(user.id, message, payload);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });
  }

  addUser(userId, socket) {
    this.users[userId] = {
      socket,
    };
  }

  getUser(userId) {
    return this.users[userId];
  }

  removeUser(userId) {
    this.users[userId].socket.emit('disconnect');
    delete this.users[userId];
  }

  isEmpty() {
    return Object.keys(this.users).length === 0;
  }
}

module.exports = Room;
