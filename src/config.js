import Phaser from 'phaser'
const docElement = document.documentElement
console.log(docElement.clientWidth)
const width = docElement.clientWidth > '100%' ? '100%' : docElement.clientWidth
const height = docElement.clientHeight > '100%' ? '100%' : docElement.clientHeight
export default {
  width: width,
  height: height,
  type: Phaser.AUTO,
  physics: {
    default: 'matter',
    matter: {
        gravity: {
            x: 0,
            y: 0
        },
    }
  }
}
