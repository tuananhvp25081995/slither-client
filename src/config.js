import Phaser from 'phaser'
const docElement = document.documentElement
console.log(docElement.clientWidth)
const width = docElement.clientWidth > '100%' ? '100%' : docElement.clientWidth
const height = docElement.clientHeight > '100%' ? '100%' : docElement.clientHeight
export default {
  width: width * 2,
  height: height * 2,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  parent: ['login'],
  dom: {
    createContainer: true
  },
}
