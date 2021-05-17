import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

const type = 'SOCKET_TYPES_DASHBOARD';

const SocketContext = createContext();
const socket = socketIOClient();

let authorized = false;

socket.on('hello', () => {
  tryAuthorize();
});

const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

function useSocket() {
  return useContext(SocketContext);
}

function tryAuthorize() {
  if (!authorized) {
    const token = localStorage.getItem('token');
    socket.emit('hello', { token, type });
  }
}

socket.on('authorized', () => {
  authorized = true;
});

socket.on('unauthorized', () => {
  authorized = false;
});

function isAuthorized() {
  return authorized;
}

export default SocketProvider;
SocketProvider.propTypes = {
  children: PropTypes.node,
};

export { useSocket, tryAuthorize, isAuthorized };
