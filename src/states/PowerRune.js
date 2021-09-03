import Phaser from 'phaser'
let healthGroup
export default class {
  constructor (scene, snake, type, amount, min, max) {
    this.scene = scene
    // sprite.setCollideWorldBounds(true);
    this.healthGroup = healthGroup
    //  Create 10 random health pick-ups
    this.healthGroup = this.scene.physics.add.staticGroup({
      key: type,
      frameQuantity: amount,
      immovable: true,
      setScale: { x: 0.1, y: 0.1 }
    })
    const children = this.healthGroup.getChildren()
    for (let i = 0; i < children.length; i++) {
      const x = Phaser.Math.Between(min.x, max.x)
      const y = Phaser.Math.Between(min.y, max.y)

      children[i].setPosition(x, y)
    }
    this.healthGroup.refresh()
    // this.scene.physics.add.overlap(snake, this.healthGroup, this.spriteHitHealth);
  }

  spriteHitHealth (health) {
    this.healthGroup.killAndHide(health)
  }
}
