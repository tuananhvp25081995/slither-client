import Phaser from 'phaser'
import Snake from '../sprites/Snake'
import Slot from '../sprites/Slot'
import Timer from '../sprites/Timer'

import CircleBorder from '../sprites/CircleBorder'
import Leaderboard from '../sprites/Leaderboard'
let snake
let Circle
let healthGroup
let foodGroup
let socket
let foodData = [];
let flag = false;
const SPEED = 200
const ROTATION_SPEED = 1.5 * Math.PI
const ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED)
const TOLERANCE = 0.02 * ROTATION_SPEED

const velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation

export default class Game extends Phaser.Scene {
  preload() { }

  create() {
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
      "snake-data": (data) => {
        // console.log(data)
      },

      "food-data": (data) => {
        console.log(foodData.length, data.length);
        if (foodData.length == data.length) {
          // foodGroup.destroy();
          foodData = [];
          flag = true;
        } else {
          foodData = data;
          flag = false;
          foodData.forEach(e => {
            getFood(this, 'food', 1, e.Radius, { min: -e.X, max: e.X }, { min: -e.Y, max: e.Y });
          });
        }
      },
    }


    getSocket()

    // Always add map first. Everything else is added after map.
    const gameWidth = this.game.config.width
    const gameHeight = this.game.config.height
    this.add.tileSprite(0, 0, gameWidth * 3, gameHeight * 3, 'background')

    // Init Snake
    this.game.snakes = []
    snake = new Snake(this, 0, 0, 'circle')
    this.game.playerSnake = snake
    this.cameras.main.width = gameWidth / 2
    this.cameras.main.height = gameHeight / 2
    this.cameras.main.startFollow(snake.head)

    // plusRunes = new PowerRune(this, snake.head, 'plus', 10, { x: -100, y: -100 }, { x: 750, y: 550 });
    //  When the player sprite his the health packs, call this function ...
    // this.physics.add.overlap(snake.head, plusRunes.healthGroup, plusRunes.spriteHitHealth());
    //

    // if (foodData) {
    //   foodData.forEach(e => {
    //     console.log(e)
    //     // getFood(this, 'food', 1, foodData.Radius, { min: -foodData.X, max: foodData.X }, { min: -foodData.Y, max: foodData.Y });
    //   });
    // }

    healthGroup = this.physics.add.staticGroup({
      key: 'plus',
      frameQuantity: 10,
      immovable: true,
      setScale: { x: 0.1, y: 0.1 }
    });

    const children = healthGroup.getChildren()


    for (let i = 0; i < children.length; i++) {
      const x = Phaser.Math.Between(1000, 1750)
      const y = Phaser.Math.Between(1000, 1550)

      children[i].setPosition(x, y)
    }

    healthGroup.refresh()

    //  When the player sprite hits the foods, call this function ...
    this.physics.add.overlap(snake.head, healthGroup, this.spriteHitHealth)
    // minimap
    const minimapSize = gameWidth / 20
    this.minimap = this.cameras.add(this.cameras.main.width - minimapSize, this.cameras.main.height - minimapSize, minimapSize, minimapSize).setZoom(0.016)
    this.minimap.setBackgroundColor(0xffffff)

    // create Circle
    // Circle = CircleBorder.createCircle(this, gameWidth / 2)

    Circle = new CircleBorder(this, gameWidth / 2, { x: -gameWidth / 2, y: -gameHeight / 2 })

    // resize Circle
    Circle.resize(5000, 0.75)

    // slot
    this.slot = new Slot(this, this.cameras.main.width, this.cameras.main.height)
    // time countdown
    this.timer = new Timer(this)

    this.leaderboard = new Leaderboard(this)
  }

  spriteHitHealth(sprite, health) {
    healthGroup.killAndHide(health)
  }

  update(delta) {
    this.slot.update()
    for (let i = this.game.snakes.length - 1; i >= 0; i--) {
      this.game.snakes[i].update()
    }
    pointerMove(this.input.activePointer.updateWorldPoint(this.cameras.main))
    velocityFromRotation(snake.head.rotation, SPEED, snake.head.body.velocity)
    snake.head.body.debugBodyColor = (snake.head.body.angularVelocity === 0) ? 0xff0000 : 0xffff00
    const overlap = this.physics.world.overlap(Circle, snake.head)
    if (!overlap) {
      // console.log('outside')
      const angleToPointer = Phaser.Math.Angle.Between(snake.head.x, snake.head.y, Circle.body.center.x, Circle.body.center.y)
      const angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - snake.head.rotation)

      if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
        snake.head.rotation = angleToPointer
        snake.head.setAngularVelocity(0)
      } else {
        snake.head.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES)
      }
    } else {
      pointerMove(this.input.activePointer.updateWorldPoint(this.cameras.main))
    }
  }

}


function getFood(game, type, quantity, scale, positionX, positionY) {
  foodGroup = game.physics.add.staticGroup({
    key: type,
    frameQuantity: quantity,
    immovable: true,
    setScale: { x: scale / 3, y: scale / 3 }
  })
  if (flag) {
    console.log(flag)
    foodGroup.destroy();
  }
  const childrenFood = foodGroup.getChildren();
  for (let i = 0; i < childrenFood.length; i++) {
    const x = Phaser.Math.Between(positionX.min, positionX.max)
    const y = Phaser.Math.Between(positionY.min, positionY.max)

    childrenFood[i].setPosition(x, y)
  }
  foodGroup.refresh();
  game.physics.add.overlap(snake.head, foodGroup, spriteHitFood)

}
// destroy food
function spriteHitFood(sprite, health) {
  console.log('aaa')
  // foodGroup.killAndHide(health)
  // foodGroup.destroy();
}
function pointerMove(pointer, camera) {
  // if (!pointer.manager.isOver) return;

  // Also see alternative method in
  // <https://codepen.io/samme/pen/gOpPLLx>

  const angleToPointer = Phaser.Math.Angle.Between(snake.head.x, snake.head.y, pointer.worldX, pointer.worldY)
  const angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - snake.head.rotation)
  const event = {
    event: 'change_target',
    data: {
      X: pointer.x,
      Y: pointer.y
    }
  }
  if (socket.readyState === 1) socket.send(JSON.stringify(event))

  if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
    snake.head.rotation = angleToPointer
    snake.head.setAngularVelocity(0)
  } else {
    snake.head.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES)
  }
}
