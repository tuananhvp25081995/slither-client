import Phaser from 'phaser'
import PowerRune from './PowerRune'
import { Util } from '../utils'


let Ball
let Circle
let healthGroup
let foodGroup
const SPEED = 400
const ROTATION_SPEED = 1 * Math.PI
const ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED)
const TOLERANCE = 0.02 * ROTATION_SPEED

const velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation
export default class Boot extends Phaser.Scene {
  preload () {
    this.load.image('background', 'assets/images/background.jpg')
    this.load.image('food', 'assets/images/food.png')
    this.load.image('plus', 'assets/images/runes/plus.png')
    this.load.image('star', 'assets/images/runes/star.png')
    this.load.image('heart', 'assets/images/runes/heart.png')
    this.load.image('rectangle', 'assets/images/Rectangle.png')
    this.load.image('circle', 'assets/images/circle.png')

  }

  create () {
    const gameWidth = this.game.config.width
    const gameHeight = this.game.config.height
    this.add.tileSprite(0, 0, gameWidth * 3, gameWidth * 3, 'background')

    Ball = this.physics.add.image(200, 150, 'circle').setVelocity(SPEED, 0)
    Ball.body.setCollideWorldBounds(true, 1, 1)
    this.cameras.main.width = gameWidth / 2
    this.cameras.main.height = gameHeight / 2
    this.cameras.main.startFollow(Ball)

    // plusRunes = new PowerRune(this, Ball, 'plus', 10, { x: -100, y: -100 }, { x: 750, y: 550 });
    //  When the player sprite his the health packs, call this function ...
    // this.physics.add.overlap(Ball, plusRunes.healthGroup, plusRunes.spriteHitHealth());
    //
    foodGroup = this.physics.add.staticGroup({
      key: 'food',
      frameQuantity: 100,
      immovable: true
      // setScale: { x: 0.1, y: 0.1 }
    })
    healthGroup = this.physics.add.staticGroup({
      key: 'plus',
      frameQuantity: 10,
      immovable: true,
      setScale: { x: 0.1, y: 0.1 }
    })

    const children = healthGroup.getChildren()
    const childrenFood = foodGroup.getChildren()
    for (let i = 0; i < children.length; i++) {
      const x = Phaser.Math.Between(200, 550)
      const y = Phaser.Math.Between(200, 850)

      childrenFood[i].setPosition(x, y)
    }
    for (let i = 0; i < children.length; i++) {
      const x = Phaser.Math.Between(1000, 1750)
      const y = Phaser.Math.Between(1000, 1550)

      children[i].setPosition(x, y)
    }

    healthGroup.refresh()
    foodGroup.refresh()
    //  When the player sprite his the health packs, call this function ...
    this.physics.add.overlap(Ball, foodGroup, this.spriteHitFood)
    this.physics.add.overlap(Ball, healthGroup, this.spriteHitHealth)
    // minimap
    const minimapSize = gameWidth / 20
    this.minimap = this.cameras.add(this.cameras.main.width - minimapSize, this.cameras.main.height - minimapSize, minimapSize, minimapSize).setZoom(0.016)
    this.minimap.setBackgroundColor(0xffffff)

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

    this.slot = this.add.image(this.cameras.main.width, 0, 'rectangle');
    this.slot.setPosition(this.cameras.main.width - this.slot.width/2, this.slot.height/2)
    this.slot.setScrollFactor(0, 0);

    this.minimap.ignore(this.slot)

    this.rightClick(this.slot);
  }

  rightClick(slot){
    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', function (pointer){
        if(pointer.rightButtonDown()){
          slot.visible = !slot.visible
        }
    })
}

  spriteHitHealth (sprite, health) {
    healthGroup.killAndHide(health)
    console.log('power rune')
  }

  spriteHitFood (sprite, health) {
    foodGroup.killAndHide(health)
    console.log('food')
  }

  update (delta) {
    // const angle = Phaser.Math.Angle.Between(
    //   Ball.x,
    //   Ball.y,
    //   this.input.mousePointer.x,
    //   this.input.mousePointer.y
    // )
    // Ball.setRotation(angle + Math.PI / 2)
    // if (this.input.mousePointer) {
    //   // this.physics.moveToObject(Ball, this.input, 240);
    //   Ball.body.setVelocity(
    //     this.input.mousePointer.x - Ball.x,
    //     this.input.mousePointer.y - Ball.y
    //   )
    //   // this.physics.arcade.moveToPointer(Ball, 100)
    //   // console.log(this.input.mousePointer.x, this.input.mousePointer.y)
    //   // console.log(Ball.x, Ball.y)
    // }
    pointerMove(this.input.activePointer)
    velocityFromRotation(Ball.rotation, SPEED, Ball.body.velocity)
    Ball.body.debugBodyColor = (Ball.body.angularVelocity === 0) ? 0xff0000 : 0xffff00
    const overlap = this.physics.world.overlap(Circle, Ball)
    if (!overlap) {
      let { x, y } = Ball.getCenter()
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
      Ball.setPosition(x, y)

      Ball.body.setMaxVelocity(10)
    } else {
      Ball.body.setMaxVelocity(180)
    }
  }
}

function pointerMove (pointer) {
  // if (!pointer.manager.isOver) return;

  // Also see alternative method in
  // <https://codepen.io/samme/pen/gOpPLLx>

  const angleToPointer = Phaser.Math.Angle.Between(Ball.x, Ball.y, pointer.worldX, pointer.worldY)
  const angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - Ball.rotation)

  if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
    Ball.rotation = angleToPointer
    Ball.setAngularVelocity(0)
  } else {
    Ball.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES)
  }
}
