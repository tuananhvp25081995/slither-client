import Eye from './Eye';

export default class {
  constructor (game, head, scale) {
    this.game = game;
    this.head = head;
    this.scale = scale;
    this.eyes = [];

    this.debug = false;

    // create 2 eyes
    const offset = this.getOffset();
    this.leftEye = new Eye(this.game, this.head, this.scale);
    this.leftEye.updateConstraints([-offset.x, -offset.y]);
    this.eyes.push(this.leftEye);

    this.rightEye = new Eye(this.game, this.head, this.scale);
    this.rightEye.updateConstraints([offset.x, -offset.y]);
    this.eyes.push(this.rightEye);
    // debugger;
  }

  getOffset () {
    const xDim = this.head.width * 0.25;
    const yDim = this.head.width * 0.125;
    return {
      x: xDim, y: yDim
    };
  }

  setScale (scale) {
    this.leftEye.setScale(scale);
    this.rightEye.setScale(scale);
    // update constraints to place them at the right offset
    const offset = this.getOffset();
    this.leftEye.updateConstraints([-offset.x, -offset.y]);
    this.rightEye.updateConstraints([offset.x, -offset.y]);
  }

  update () {
    for (let i = 0; i < this.eyes.length; i++) {
      this.eyes[i].update();
    }
  }

  destroy () {
    this.leftEye.destroy();
    this.rightEye.destroy();
  }
}
