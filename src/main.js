import Phaser from 'phaser'
import config from './config'
import Boot from './states/Boot'
import Game from './states/Game'
import Login from './states/Login'
import Countdown from './states/Countdown'

const game = new Phaser.Game(config)

game.scene.add('boot', Boot)
game.scene.add('login', Login)
game.scene.add('countdown', Countdown)
game.scene.add('game', Game)
game.scene.start('boot')
