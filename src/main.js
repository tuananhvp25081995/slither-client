import Phaser from 'phaser'
import config from './config'
import Boot from './states/Boot'

const game = new Phaser.Game(config)

game.scene.add('boot', Boot)
game.scene.start('boot')
