import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')

    this.load.image('circle', 'assets/images/circle.png')
    this.load.image('blue-circle', 'assets/images/blue-circle.png')
    this.load.image('atom-circle', 'assets/images/atom-circle.png')
    this.load.image('blue-gradient-circle', 'assets/images/blue-gradient-circle.png')
    this.load.image('magic-circle', 'assets/images/magic-circle.png')
    this.load.image('orange-circle', 'assets/images/orange-circle.png')
    this.load.image('pink-gradient-circle', 'assets/images/pink-gradient-circle.png')
    this.load.image('pink-orange-circle', 'assets/images/pink-orange-circle.png')
    this.load.image('spotify-circle', 'assets/images/spotify-circle.png')
    this.load.image('green-circle', 'assets/images/green-circle.png')
    this.load.image('yellow-gradient-circle', 'assets/images/yellow-gradient-circle.png')


    this.load.image('eye-white', 'assets/images/eye-white.png')
    this.load.image('eye-black', 'assets/images/eye-black.png')
    this.load.image('shadow', 'assets/images/white-shadow.png')

    this.load.image('food', 'assets/images/food.png')
    this.load.image('background', 'assets/images/background.jpg')

    this.load.audio('eat', 'assets/audio/eat.mp3')
  }

  create () {
    this.state.start('Game')
  }
}
