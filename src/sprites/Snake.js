import Phaser, { Color } from 'phaser'
// import EyePair from "./EyePair";
// import Shadow from "./Shadow";
import { Util } from '../utils'
let nickName
export default class extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture)
    // this.anchor.setTo(0.5)

    if (!this.scene.game.snakes) {
      this.scene.game.snakes = []
    }

    this.scene.game.snakes.push(this)
    this.debug = false
    this.snakeLength = 0
    this.spriteKey = texture

    // various quantities
    this.scale = 0.6
    this.fastSpeed = 200
    this.slowSpeed = 130
    this.speed = this.slowSpeed
    this.rotationSpeed = 40

    // init
    // this.collisionGroup = this.scene.physics.p2.createCollisionGroup()
    this.sections = []
    this.headPath = []
    this.food = []
    this.preferredDistance = 17 * this.scale
    this.queuedSections = 0

    // init shadow
    // this.shadow = new Shadow(this.scene, this.sections, this.scale);

    // this.sectionGroup = this.scene.physics.add.group()
    this.sectionGroup = this.scene.add.container(x, y)
    // add nick name
    nickName = localStorage.getItem('username')
    this.textPosition = this.scene.add.text(x, y, nickName, {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#fff'
    })
    // add nickname
    // this.sectionGroup.setSize(300, 300)
    this.scene.physics.world.enable(this.sectionGroup)
    this.sectionGroup.body.setCollideWorldBounds(true)
    // this.scene.physics.add.existing(this.sectionGroup);

    // add the head of the snake
    this.head = this.addSectionAtPosition(x, y)
    this.head.name = 'head'
    this.head.snake = this

    this.lastHeadPosition = new Phaser.Geom.Point(
      this.head.body.x,
      this.head.body.y
    )

    // add 30 sections behind the head
    this.initSections(9)

    // init eyes
    // this.eyes = new EyePair(this.scene, this.head, this.scale);

    this.onDestroyedCallbacks = []
    this.onDestroyedContexts = []

    // the edge is the front body that can collide with other snakes
    // it is locked to the head of this snake
    this.edgeOffset = 3
    this.edge = this.scene.physics.add.sprite(
      x,
      y - this.edgeOffset,
      this.spriteKey
    )
    this.edge.name = 'edge'
    this.edge.alpha = 0
    // this.scene.physics.p2.enable(this.edge, this.debug)
    this.edge.body.setCircle(this.edgeOffset)

    // constrain edge to the front of the head
    // this.edgeLock = this.scene.physics.p2.createLockConstraint(
    //     this.edge.body,
    //     this.head.body,
    //     [0, -this.head.width * 0.5 - this.edgeOffset]
    // );

    // this.scene.physics.world.collide(this.edgeContact, this);
    // this.edge.body.onBeginContact.add(this.edgeContact, this);
  }

  edgeContact (phaserBody) {
    // if the edge hits another snake's section, destroy this snake
    if (phaserBody && this.sections.indexOf(phaserBody.sprite) === -1) {
      this.destroy()
    } else if (phaserBody) {
      // if the edge hits this snake's own section, a simple solution to avoid
      // glitches is to move the edge to the center of the head, where it
      // will then move back to the front because of the lock constraint
      this.edge.body.x = this.head.body.x
      this.edge.body.y = this.head.body.y
    }
  }

  addSectionAtPosition (x, y) {
    // init new section
    const sec = this.scene.physics.add.sprite(x, y, this.spriteKey)

    // this.scene.physics.p2.enable(sec, this.debug)
    // sec.body.setCollisionGroup(this.collisionGroup);
    // sec.body.collides([]);
    // sec.body.kinematic = true;

    this.snakeLength++
    this.sectionGroup.add(sec)
    this.sectionGroup.sendToBack(sec)
    sec.setScale(this.scale)
    this.sections.push(sec)

    // add circle
    // sec.body.clearShapes();
    sec.body.setCircle(sec.width * 0.5)

    // add shadow
    // this.shadow.add(x, y);
    return sec
  }

  initSections (num) {
    for (let i = 1; i <= num; i++) {
      const x = this.head.body.x
      const y = this.head.body.y + i * this.preferredDistance
      this.addSectionAtPosition(x, y)

      this.headPath.push(new Phaser.Geom.Point(x, y))
    }
  }

  addSectionsAfterLast (amount) {
    this.queuedSections += amount
  }

  update () {
    // const angle = Phaser.Math.Angle.Between(
    //   this.head.x,
    //   this.head.y,
    //   this.scene.input.mousePointer.x,
    //   this.scene.input.mousePointer.y
    // )
    // this.head.setRotation(angle + Math.PI / 2)
    // if (this.scene.input.mousePointer) {
    //   this.head.body.setVelocity(
    //     this.scene.input.mousePointer.x - this.head.x,
    //     this.scene.input.mousePointer.y - this.head.y
    //   )
    // }

    this.textPosition.setPosition(this.head.body.x, this.head.body.y - 16)
    // const point = this.headPath.pop()
    // point.setTo(this.head.body.x, this.head.body.y)
    // this.headPath.unshift(point)
    // // place each section of the snake on the path of the snake head
    // // certain distance from the section before it
    // let index = 0
    // let lastIndex = null
    for (let i = 0; i < this.snakeLength; i++) {
      // console.log(this.sections[i].body.x, this.sections[i].body.y)
      if (this.scene.sections) {
        // console.log(this.scene.sections[i])
        this.sections[i].body.x = this.scene.sections[i].x
        this.sections[i].body.y = this.scene.sections[i].y
      }

      // hide sections if they are at same pos
      // if (lastIndex && index === lastIndex) {
      //   this.sections[i].alpha = 0
      // } else {
      //   this.sections[i].alpha = 1
      // }

      // lastIndex = index
      // // this finds the index in the head path array that the next point
      // // should be at
      // index = this.findNextPointIndex(index)
    }

    // // continuously adjust the size of the head path
    // if (index >= this.headPath.length - 1) {
    //   const lastPos = this.headPath[this.headPath.length - 1]
    //   this.headPath.push(new Phaser.Geom.Point(lastPos.x, lastPos.y))
    // } else {
    //   this.headPath.pop()
    // }

    // // this calls onCycleComplete every time a cycle is completed.

    // let i = 0
    // let found = false
    // while (
    //   this.headPath[i].x !== this.sections[1].body.x &&
    //   this.headPath[i].y !== this.sections[1].body.y
    // ) {
    //   if (
    //     this.headPath[i].x === this.lastHeadPosition.x &&
    //     this.headPath[i].y === this.lastHeadPosition.y
    //   ) {
    //     found = true
    //     break
    //   }
    //   i++
    // }
    // if (!found) {
    //   this.lastHeadPosition = new Phaser.Geom.Point(
    //     this.head.body.x,
    //     this.head.body.y
    //   )
    //   this.onCycleComplete()
    // }

    // update the eyes
    // this.eyes.update();

    // update shadow
    // this.shadow.update();
  }

  findNextPointIndex (currentIndex) {
    // const pt = this.headPath[currentIndex]
    // we are trying to find a point at approximately this distance away
    // from the point before it, where the distance is the total length of
    // all the lines connecting the two points
    const prefDist = this.preferredDistance
    let len = 0
    let dif = len - prefDist
    let i = currentIndex
    let prevDif = null
    // this loop sums the distances between points on the path of the head
    // starting from the given index of the function and continues until
    // this sum nears the preferred distance between two snake sections
    while (i + 1 < this.headPath.length && (dif === null || dif < 0)) {
      // get distance between next two points
      const dist = Util.distanceFormula(
        this.headPath[i].x,
        this.headPath[i].y,
        this.headPath[i + 1].x,
        this.headPath[i + 1].y
      )
      len += dist
      prevDif = dif
      // we are trying to get the difference between the current sum and
      // the preferred distance close to zero
      dif = len - prefDist
      i++
    }

    // choose the index that makes the difference closer to zero
    // once the loop is complete
    if (prevDif === null || Math.abs(prevDif) > Math.abs(dif)) {
      return i
    } else {
      return i - 1
    }
  }

  /**
     * Called each time the snake's second section reaches where the
     * first section was at the last call (completed a single cycle)
     */
  onCycleComplete () {
    if (this.queuedSections > 0) {
      const lastSec = this.sections[this.sections.length - 1]
      this.addSectionAtPosition(lastSec.body.x, lastSec.body.y)
      this.queuedSections--
    }
  }

  setScale (scale) {
    this.scale = scale
    this.preferredDistance = 17 * this.scale

    // scale sections and their bodies
    for (let i = 0; i < this.sections.length; i++) {
      const sec = this.sections[i]
      sec.scale.setTo(this.scale)
      // sec.body.data.shapes[0].radius = this.scene.physics.p2.pxm(sec.width * 0.5)
    }
  }

  // update edge lock location with p2 physics
  // this.edgeLock.localOffsetB = [
  //   0, this.scene.physics.p2.pxm(this.head.width * 0.5 + this.edgeOffset)
  // ]

  // this.eyes.setScale(scale);

  incrementSize () {
    this.addSectionsAfterLast(1)
    this.setScale(this.scale * 1.01)
  }

  addDestroyedCallback (callback, context) {
    this.onDestroyedCallbacks.push(callback)
    this.onDestroyedContexts.push(context)
  }

  destroy () {
    this.scene.snakes.splice(this.scene.snakes.indexOf(this), 1)
    this.sections.forEach(function (sec, index) {
      sec.destroy()
    })

    // call this snake's destruction callbacks
    for (let i = 0; i < this.onDestroyedCallbacks.length; i++) {
      if (typeof this.onDestroyedCallbacks[i] === 'function') {
        this.onDestroyedCallbacks[i].apply(
          this.onDestroyedContexts[i],
          [this]
        )
      }
    }
    // this.scene.physics.p2.removeConstraint(this.edgeLock)
    this.edge.destroy()
    // this.eyes.destroy();
    // this.shadow.destroy();
  }
}
