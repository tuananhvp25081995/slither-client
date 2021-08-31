import Phaser from 'phaser'
import { initWs } from '../socket'

let socket

export default class Countdown extends Phaser.Scene {
  preload () {

  }

  create () {
    this.notice = this.add.text(window.innerWidth / 2, window.innerHeight / 2, '', { fontSize: 24 })
    this.notice.setOrigin(0.5, 0.5)
    socket = initWs()

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      webSocketAction[data.Action](data.Data)
    }

    const webSocketAction = {
      'count-down': (data) => {
        this.notice.setText(data)
        console.log(data)
        if (data === 'Match start after 0 Minutes, 1 Seconds \n') {
          this.scene.start('game')
        }
      }
    }

    console.log(socket)
  }
}
