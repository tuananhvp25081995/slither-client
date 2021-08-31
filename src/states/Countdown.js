import Phaser from 'phaser'

let socket

export default class Countdown extends Phaser.Scene {
  preload () {
    
  }

    create () {
        this.notice = this.add.text(window.innerWidth/2, window.innerHeight/2,'',{fontSize: 24});
        this.notice.setOrigin(0.5, 0.5)
        const name = localStorage.getItem('username')
        socket = new WebSocket(`ws://66.42.51.96/ws/${name}`)
        const getSocket = () => {
            socket.onopen = () => {
                heartbeat()
            }
            socket.onclose = () => {
                getSocket()
            }
            socket.onerror = (error) => {
                console.log('Socket Error: ', error)
            }
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                webSocketAction[data.Action](data.Data)
            }
        }
        const heartbeat = () => {
            if (!socket) return
            socket.send('Ping')
            setTimeout(heartbeat, 5000)
        }
        const webSocketAction = {
            'count-down': (data) => {
                this.notice.setText(data);
                console.log(data);
                if(data == 'Match start after 0 Minutes, 1 Seconds \n'){
                    this.scene.start('game')
                }
            },
        }

        console.log(socket)
        getSocket()
    }
}
