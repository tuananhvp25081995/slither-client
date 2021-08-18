import Phaser from 'phaser'
import Snake from '../sprites/Snake'
let snake
let Circle

export default class Boot extends Phaser.Scene {
  preload () {
    this.load.image('background', 'assets/images/background.jpg')
    this.load.image('circle', 'assets/images/circle.png')
  }

  create () {
    this.game.snakes = []
    console.log(this)
    snake = new Snake(this, 400, 400, 'circle')
    console.log(snake)
    const gameWidth = this.game.config.width
    const gameHeight = this.game.config.height
    this.add.tileSprite(0, 0, gameWidth * 3, gameHeight * 3, 'background')

    // snake = this.add.circle(200, 300, 10, 0xffffff, 1);
    // this.physics.add.existing(snake);
    // snake.body.setCollideWorldBounds(true, 1, 1);
    // snake.body.setVelocity(200, 200);
    this.game.playerSnake = snake

    this.cameras.main.width = gameWidth / 2
    this.cameras.main.height = gameHeight / 2
    this.cameras.main.startFollow(snake.head)

    // create Circle
    Circle = this.add.graphics().lineStyle(5, 0x00ffff)

    this.physics.add.existing(Circle)
    Circle.body.allowGravity = false
    Circle.body.setCircle(gameWidth / 4)
    Circle.body.immovable = true
    Circle.strokeCircle(
      Circle.body.halfWidth,
      Circle.body.halfHeight,
      Circle.body.radius
    )
    console.log(Circle)
    console.log(snake)

    // Resize Circle
    const circleBorderConfig = {
      delay: 5000,
      callback: () => {
        console.log('Initiate Resizing')
        console.log(
          'Resizing in Progress... Will take about 25 seconds'
        )

        const interval = setInterval(() => {
          if (Circle.scale >= 0.75) {
            Circle.scale -= 0.001
            Circle.x += Circle.body.halfWidth * 0.001
            Circle.y += Circle.body.halfHeight * 0.001
          } else {
            clearInterval(interval)
            console.log('Finish Resizing')
          }
        }, 100)
      }
    }

    this.time.addEvent(circleBorderConfig)
  }

  update (delta) {
    for (let i = this.game.snakes.length - 1; i >= 0; i--) {
      this.game.snakes[i].update()
    }

    const overlap = this.physics.world.overlap(Circle, snake.head)
    if (!overlap) {
      let { x, y } = snake.head.getCenter()
      if (Circle.body.halfWidth >= x) {
        x = Math.abs(Circle.body.halfWidth - x) * 0.1 + x
      } else {
        x = x - Math.abs(Circle.body.halfWidth - x) * 0.1
      }
      if (Circle.body.halfHeight >= y) {
        y = Math.abs(Circle.body.halfHeight - y) * 0.1 + y
      } else {
        y = y - Math.abs(Circle.body.halfHeight - y) * 0.1
      }
      snake.head.setPosition(x, y)

      snake.head.body.setMaxVelocity(10)
    } else {
      snake.head.body.setMaxVelocity(800)
    }
  }
}
