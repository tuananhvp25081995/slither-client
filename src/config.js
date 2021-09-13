import Phaser from 'phaser';
const docElement = document.documentElement;
const width = docElement.clientWidth > '100%' ? '100%' : docElement.clientWidth;
const height = docElement.clientHeight > '100%' ? '100%' : docElement.clientHeight;
export default {
  width: width * 2,
  height: height * 2,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: false
    }
  },
  parent: 'content',
  dom: {
    createContainer: true
  }
};
