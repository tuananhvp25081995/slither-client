import Phaser from 'phaser'
import config from './config'
import Boot from './states/Boot'
import Login from './states/Login'

const game = new Phaser.Game(config)

game.scene.add('boot', Boot)
game.scene.add('login', Login)
game.scene.start('login')
