import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

const type = 'SOCKET_TYPES_DASHBOARD';

const SocketContext = createContext();
const socket = socketIOClient();

socket.on('hello', () => {
  const token = localStorage.getItem('token');
  socket.emit('hello', { token, type });
});

const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);
function useSocket() {
  return useContext(SocketContext);
}

export default SocketProvider;
SocketProvider.propTypes = {
  children: PropTypes.node,
};

export { useSocket };
