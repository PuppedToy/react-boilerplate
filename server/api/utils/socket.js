const jwt = require('jsonwebtoken');

const sockets = {};

function socketExists(id, type) {
  return (
    Object.hasOwnProperty.call(sockets, id) &&
    (!type || Object.hasOwnProperty.call(sockets[id].sockets, type))
  );
}

function sendMessage(ids, type, message, payload = {}) {
  if (!(ids instanceof Array) && typeof ids !== 'string') {
    throw new Error(
      `ids must be of type array or string. Instead found ${typeof ids}`,
    );
  }
  if (typeof message !== 'string') {
    throw new Error(
      `message must be of type array or string. Instead found ${typeof message}`,
    );
  }
  if (typeof type !== 'string') {
    throw new Error(
      `type must be of type array or string. Instead found ${typeof type}`,
    );
  }
  // If ids is an array, broadcast to them
  if (ids instanceof Array) {
    ids.forEach(id => sendMessage(id, type, message, payload));
  }
  if (!socketExists(ids, type)) return;
  const socket = sockets[ids].sockets[type];
  socket.emit(message, payload);
}

function socketHandler(io) {
  io.on('connection', socket => {
    let id;
    let socketType;
    socket.emit('hello');

    try {
      socket.on('hello', ({ token, type }) => {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken && decodedToken.id) {
          // eslint-disable-next-line prefer-destructuring
          id = decodedToken.id;
          socketType = type;
          if (!socketExists(id)) {
            sockets[id] = {
              sockets: {},
            };
          }
          sockets[id].sockets[socketType] = socket;
          socket.emit('authorized');
        } else {
          throw new Error('Unauthorized');
        }
      });

      socket.on('disconnect', () => {
        if (socketExists(id)) {
          delete sockets[id].sockets[socketType];
        }
        if (!Object.keys(sockets[id].sockets).length) {
          delete sockets[id];
        }
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
}

module.exports = { socketHandler, sendMessage };
