let socket

export const initWs = (mesg) => {
  const name = localStorage.getItem('username')
  socket = new WebSocket(`ws://66.42.51.96/ws/${name}`)
  return socket
}

export const getWs = () => {
  return socket
}

// export const getSocket = () => {
//   socket.onopen = () => {
//     heartbeat()
//   }
//   socket.onclose = () => {
//     getSocket()
//   }
//   socket.onerror = (error) => {
//     console.log('Socket Error: ', error)
//   }
//   socket.onmessage = (e) => {
//     const data = JSON.parse(e.data)
//     webSocketAction[data.action](data)
//   }

//   const heartbeat = () => {
//     if (!socket) return
//     socket.send('Ping')
//     setTimeout(heartbeat, 5000)
//   }
// }
// const webSocketAction = {
// 'data-slither': (data) => {
//   console.log(data)
//   // goatData.holder = data;
// }

// window.onload = getSocket()
