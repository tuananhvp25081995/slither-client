export default class Minimap extends Phaser.Scene
{
    constructor (){
        super();
    }

    preload (){
        this.load.image('background', 'assets/images/background.jpg');
        this.load.image('circle', 'assets/images/circle.png');
    }

    create(){
        this.matter.world.setBounds(0, 0, 3000, 1000);
        this.cameras.main.setBounds(0, 0, 3000, 1000).setName('main');

        this.minimap = this.cameras.add(0, 0, 200, 200).setZoom(0.2).setName('mini');
        this.minimap.setBackgroundColor(0x002244);
        this.minimap.scrollX = 1600;
        this.minimap.scrollY = 450;

        this.background = this.add.tileSprite(0, 0, 3000, 1200, 'background');
        this.background.setOrigin(0,0)

        this.player = this.matter.add.sprite(1000, 200, 'circle').setFixedRotation().setFrictionAir(1)
        console.log('snake', this.player);

        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update(){
        if (this.cursors.left.isDown)
        {
            this.player.thrustBack(0.1);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.thrust(0.1);
            this.player.flipX = false;
        }
        if (this.cursors.up.isDown)
        {
            this.player.thrustLeft(0.1);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.thrustRight(0.1);
        }
        
        this.minimap.scrollX = Phaser.Math.Clamp(this.player.x , 400, 2400);
    }
}


