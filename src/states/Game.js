/* globals __DEV__ */
import Phaser from 'phaser'
import PlayerSnake from '../sprites/PlayerSnake'
import BotSnake from '../sprites/BotSnake'
import Food from '../sprites/Food'
import PowerRunes from '../states/PowerRune'
import { Util } from '../utils'
import config from '../config'
import Sync from '../network/Sync'

export default class extends Phaser.State {
  init() {
    this.game.desiredFps = 45
    this.game.sound.mute = config.muteSound
    this.sync = new Sync(this.game)
  }
  preload() {
  }

  create() {
    const width = this.game.width
    const height = this.game.height

    this.game.world.setBounds(-width, -height, width * 2, height * 2)
    this.game.stage.backgroundColor = '#444'

    // add background
    this.game.add.tileSprite(-width, -height,
      this.game.world.width, this.game.world.height, 'background')

    // init physics & groups
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.foodGroup = this.game.add.group()
    this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup()

    // add food randomly
    for (let i = 0; i < 100; i++) {
      this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height))
    }
    for (let i = 0; i < 100; i++) {
      this.initRunePlus(Util.randomInt(-width, width), Util.randomInt(-height, height), 'plus')
    }

    this.game.snakes = []

    // create player
    const snake = new PlayerSnake(this.game, 'circle', 0, 0)
    this.game.playerSnake = snake
    this.game.camera.follow(snake.head)

    // create bots
    new BotSnake(this.game, 'atom-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))
    new BotSnake(this.game, 'orange-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))
    new BotSnake(this.game, 'yellow-gradient-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))
    new BotSnake(this.game, 'green-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))
    new BotSnake(this.game, 'green-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))
    new BotSnake(this.game, 'atom-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))
    new BotSnake(this.game, 'orange-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))
    new BotSnake(this.game, 'yellow-gradient-circle', Util.randomInt(-width, width), Util.randomInt(-height, height))

    // initialize snake groups and collision
    for (let i = 0; i < this.game.snakes.length; i++) {
      const snake = this.game.snakes[i]
      snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup)
      snake.head.body.collides([this.foodCollisionGroup])
      // callback for when a snake is destroyed
      snake.addDestroyedCallback(this.snakeDestroyed, this)
    }

    this.game.time.events.loop(Phaser.Timer.SECOND, this.updatePosition, this)
  }

  updatePosition() {
    const mousePosX = this.game.input.activePointer.worldX
    const mousePosY = this.game.input.activePointer.worldY
    const snakeX = this.game.playerSnake.head.x
    const snakeY = this.game.playerSnake.head.y
    // console.log(mousePosX, mousePosY);
    this.sync.updatePos(mousePosX, mousePosY, snakeX, snakeY)
  }

  initFood(x, y) {
    const f = new Food(this.game, x, y)
    f.sprite.body.setCollisionGroup(this.foodCollisionGroup)
    this.foodGroup.add(f.sprite)
    f.sprite.body.collides([this.snakeHeadCollisionGroup])
    return f
  }
  initRunePlus(x, y, type) {
    const rune = new PowerRunes(this.game, x, y, type);
    rune.sprite.body.setCollisionGroup(this.foodCollisionGroup)
    this.foodGroup.add(rune.sprite)
    rune.sprite.body.collides([this.snakeHeadCollisionGroup])
    return rune
  }

  snakeDestroyed(snake) {
    // place food where snake was destroyed
    for (let i = 0; i < snake.headPath.length;
      i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
      this.initFood(
        snake.headPath[i].x + Util.randomInt(-10, 10),
        snake.headPath[i].y + Util.randomInt(-10, 10)
      )
    }
  }

  update() {
    // update game components
    for (let i = this.game.snakes.length - 1; i >= 0; i--) {
      this.game.snakes[i].update()
    }

    for (let i = this.foodGroup.children.length - 1; i >= 0; i--) {
      const f = this.foodGroup.children[i]
      f.food.update()
    }
    // const rune = new PowerRunes;
    // rune.update();
  }

  render() {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
      this.game.debug.inputInfo(32, 32)
    }
  }
}
