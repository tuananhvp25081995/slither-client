import Phaser from 'phaser'

export default class extends Phaser.GameObjects.Graphics {
  constructor (scene, radius, options = {}) {
    super(scene, options)

    this.lineStyle(5, 0x00ffff)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.body.allowGravity = false
    this.body.setCircle(radius)
    this.body.immovable = true
    this.strokeCircle(
      this.body.halfWidth,
      this.body.halfHeight,
      this.body.radius)
  }

  resize (delay, scale) {
    const config = {
      delay: delay,
      callback: () => {
        console.log('Initiate Resizing')
        console.log(
          'Resizing in Progress... Will take about 25 seconds'
        )

        const interval = setInterval(() => {
          if (this.scale >= scale) {
            this.scale -= 0.001
            this.x += this.body.halfWidth * 0.001
            this.y += this.body.halfHeight * 0.001
          } else {
            clearInterval(interval)
            console.log('Finish Resizing')
          }
        }, 100)
      }
    }

    this.scene.time.addEvent(config)
  }
}
