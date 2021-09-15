import io from 'socket.io-client';
const SOCKET_SERVER = 'ws://144.202.101.144:8080/';
// const SOCKET_SERVER = 'http://127.0.0.1:8080/';
// const SOCKET_SERVER = '';
let socket;
let UUID = '';
let GUID = '';
const debug = function (args) {
  if (console && console.log) {
    console.log(args);
  }
};
export const initWs = (nameSpace = '') => {
  socket = io(`${SOCKET_SERVER}${nameSpace}`, {
    transports: ['websocket']
  });

  socket.on('connect', () => {
    debug('Connected');
  });
  // Handle ping.
  socket.on('pongcheck', () => {
    const latency = Date.now() - global.startPingTime;
    debug('Latency: ' + latency + 'ms');
    window.chat.addSystemLine('Ping: ' + latency + 'ms');
  });

  // Handle error.
  socket.on('connect_failed', () => {
    socket.close();
    debug('Socket connecting failed');
  });

  socket.on('disconnect', () => {
    socket.close();
    debug('Socket disconnected');
  });
  return socket;
};

export const getWS = () => {
  return socket;
};

export const setUID = (uuid = '', guid = '') => {
  UUID = uuid;
  GUID = guid;
};

export const getUID = () => {
  return {
    uuid: UUID,
    guid: GUID
  };
};
