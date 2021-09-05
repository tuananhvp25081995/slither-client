import Phaser from 'phaser'
import { SOCKET_EVENT } from '../contants'
import { getWS } from '../socket'
export default class Countdown extends Phaser.Scene {
  preload () {
    this.socket = getWS()
  }

  create () {
    const self = this
    self.notice = this.add.text(window.innerWidth / 2, window.innerHeight / 2, '', { fontSize: 24 })
    self.notice.setOrigin(0.5, 0.5)

    self.socket.on(SOCKET_EVENT.COUNTDOWN, (e) => {
      const { Data } = JSON.parse(e)
      self.notice.setText(Data)
    })

    self.socket.on('game:notify', function (msg) {
      const { Data } = JSON.parse(msg)
      if (Data === 'Start Game.') {
        self.scene.start('game')
      }
    })
  }
}
