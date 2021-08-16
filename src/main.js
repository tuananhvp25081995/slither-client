import Phaser from 'phaser'
import config from './config'
import Boot from './states/Boot'
import Minimap from './scene/Minimap'

const game = new Phaser.Game(config)

// game.scene.add('boot', Boot)
// game.scene.start('boot')

console.log('mini');
game.scene.add('minimap', Minimap)
game.scene.start('minimap')
