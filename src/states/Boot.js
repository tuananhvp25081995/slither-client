import Phaser from 'phaser'
let Ball

export default class Boot extends Phaser.Scene {
  preload () {
    this.load.image('background', 'assets/images/background.jpg')
  }

  create () {
    const gameWidth = this.game.config.width
    const gameHeight = this.game.config.height
    this.add.tileSprite(0, 0, gameWidth * 3, gameHeight * 3, 'background')

    Ball = this.add.circle(200, 300, 10, 0xffffff, 1)
    this.physics.add.existing(Ball)
    Ball.body.setCollideWorldBounds(true, 1, 1)
    Ball.body.setVelocity(200, 200)
    console.log(this.physics)
    this.cameras.main.width = gameWidth / 2
    this.cameras.main.height = gameHeight / 2
    this.cameras.main.startFollow(Ball)
  }

  update (delta) {
    const angle = Phaser.Math.Angle.Between(Ball.x, Ball.y, this.input.mousePointer.x, this.input.mousePointer.y)
    Ball.setRotation(angle + Math.PI / 2)
    if (this.input.mousePointer) {
      // this.physics.moveToObject(Ball, this.input, 240);
      Ball.body.setVelocity(this.input.mousePointer.x - Ball.x, this.input.mousePointer.y - Ball.y)
      // this.physics.arcade.moveToPointer(Ball, 100)
      // console.log(this.input.mousePointer.x, this.input.mousePointer.y)
      // console.log(Ball.x, Ball.y)
    }
  }
}
