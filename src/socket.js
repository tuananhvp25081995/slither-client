import io from 'socket.io-client';
let socket;
const debug = function (args) {
  if (console && console.log) {
    console.log(args);
  }
};
export const initWs = (nameSpace = '') => {
  socket = io(`http://127.0.0.1:8080/${nameSpace}`, {
    transports: ['polling']
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
