import Phaser from 'phaser';

export default class extends Phaser.GameObjects.Graphics {
  constructor (scene, radius, x, y) {
    const realX = x - radius;
    const realY = y - radius;
    const options = {
      x: realX, y: realY
    };
    super(scene, options);

    this.lineStyle(10, 0x00ffff);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.allowGravity = false;
    this.body.setCircle(radius);
    this.body.immovable = true;
    this.strokeCircle(this.body.halfWidth, this.body.halfHeight, radius);
  }

  resize (delay, scale) {
    const config = {
      delay: delay,
      callback: () => {
        const interval = setInterval(() => {
          if (this.scale >= scale) {
            this.scale -= 0.001;
            this.x += this.body.halfWidth * 0.001;
            this.y += this.body.halfHeight * 0.001;
          } else {
            clearInterval(interval);
          }
        }, 100);
      }
    };

    this.scene.time.addEvent(config);
  }
}
