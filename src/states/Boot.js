import Phaser from 'phaser'
export default class Boot extends Phaser.Scene {
  preload () {

  }

  create () {
    console.log(this.game)
    const text = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Loading fonts', { font: '16px Arial', fill: 'white', align: 'center' })
    text.setOrigin(0.5, 0.5)
  }
}
