export default class Slot extends Phaser.Class{
    constructor(game, x, y){
        super(game, x, y);

        this.game = game;
        console.log('game', this.game);
        this.x = x;
        this.y = y;
        this.width =  500;
        this.height = 200;

        this.slot = this.game.add.rectangle(this.x, this.y, this.width, this.height, 0x6666ff);
        this.slot.setScrollFactor(0, 0);

        this.setVisible
    }

    setVisible() {
        console.log('asadsa');
        this.slot.visible = false;
    }
}