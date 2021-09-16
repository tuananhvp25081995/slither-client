import {
  SOCKET_EVENT
} from '../constants';
import {
  getWS
} from '../socket';
let socket;
export default class Slot {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = 30;
    this.y = y - 30;

    this.skill1 = this.scene.add
      .image(this.x, this.y, 'skill1')
      .setScrollFactor(0, 0).setDepth(1);
    this.skill2 = this.scene.add
      .image(this.skill1.x + +this.skill1.width + 10, this.y, 'skill2')
      .setScrollFactor(0, 0).setDepth(1);
    this.skill3 = this.scene.add
      .image(this.skill2.x + +this.skill2.width + 10, this.y, 'skill3')
      .setScrollFactor(0, 0).setDepth(1);
    this.skill4 = this.scene.add
      .image(this.skill3.x + +this.skill3.width + 10, this.y, 'skill4')
      .setScrollFactor(0, 0).setDepth(1);

    this.keys = this.scene.input.keyboard.addKeys('Q,W,E,R');

    const cooldown1 = 15000;
    const cooldown2 = 15000;
    const cooldown3 = 15000;
    const cooldown4 = 15000;

    socket = getWS();

    this.keys.Q.on('down', () => {
      socket.emit(
        SOCKET_EVENT.USE_SKILL,
        JSON.stringify({
          tag: 'invisible'
        })
      );
      this.cooldownSkill(this.keys.Q, cooldown1, this.skill1);
    });
    this.keys.W.on('down', () => {
      socket.emit(
        SOCKET_EVENT.USE_SKILL,
        JSON.stringify({
          tag: 'through'
        })
      );
      this.cooldownSkill(this.keys.W, cooldown2, this.skill2);
    });
    this.keys.E.on('down', () => {
      socket.emit(
        SOCKET_EVENT.USE_SKILL,
        JSON.stringify({
          tag: 'zoom'
        })
      );
      this.cooldownSkill(this.keys.E, cooldown3, this.skill3);
    });
    this.keys.R.on('down', () => {
      socket.emit(
        SOCKET_EVENT.USE_SKILL,
        JSON.stringify({
          tag: 'suck'
        })
      );
      this.cooldownSkill(this.keys.R, cooldown4, this.skill4);
    });
    this.scene.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        console.log('speeding...');
        socket.emit(
          SOCKET_EVENT.USE_SKILL,
          JSON.stringify({
            tag: 'speed',
            active: true
          })
        );
      }
    });
    this.scene.input.on('pointerup', (pointer) => {
      if (pointer.leftButtonReleased()) {
        console.log('No speed');
        socket.emit(
          SOCKET_EVENT.USE_SKILL,
          JSON.stringify({
            tag: 'speed',
            active: false
          })
        );
      }
    });
  }

  cooldownSkill(key, timeout, skill) {
    key.enabled = false;
    skill.setAlpha(0.5);
    setTimeout(() => {
      key.reset();
      skill.setAlpha(1);
    }, timeout);
  }
}
