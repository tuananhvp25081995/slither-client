import Phaser from 'phaser';
import {
  getWS,
  setUID
} from '../socket';
import {
  SOCKET_EVENT
} from '../contants';

export default class Login extends Phaser.Scene {
  preload () {
    this.socket = getWS();
  }

  create () {
    const self = this;
    self.cameras.main.setBackgroundColor(0x161c22);

    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    localStorage.setItem('username', '');

    self.form = self.add.dom(x, y).createFromCache('loginform');

    self.form.addListener('click');
    self.form.on('click', function (e) {
      if (e.target.name === 'playBtn') {
        const inputText = this.getChildByName('usernameField').value;
        if (inputText !== '') {
          localStorage.setItem('username', inputText);
          self.socket.emit(SOCKET_EVENT.GOTIT, JSON.stringify({
            name: inputText
          }));
          self.scene.start('countdown');
        }
      }
    });
  }
}
