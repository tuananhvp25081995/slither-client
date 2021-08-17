import Phaser from "phaser";
let Ball;
let Circle;

export default class Boot extends Phaser.Scene {
    preload() {
        this.load.image("background", "assets/images/background.jpg");
    }

    create() {
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        this.add.tileSprite(0, 0, gameWidth * 3, gameWidth * 3, "background");

        Ball = this.add.circle(200, 300, 20, 0xffffff, 1);
        this.physics.add.existing(Ball);
        Ball.body.setCollideWorldBounds(true, 1, 1);
        Ball.body.setVelocity(200, 200);
        console.log(this.physics);
        this.cameras.main.width = gameWidth / 2;
        this.cameras.main.height = gameHeight / 2;
        this.cameras.main.startFollow(Ball);

        // minimap
        let minimapSize = gameWidth/20;
        this.minimap = this.cameras.add(this.cameras.main.width - minimapSize, this.cameras.main.height - minimapSize, minimapSize, minimapSize).setZoom(0.016);
        this.minimap.setBackgroundColor(0xffffff);  

        // create Circle
        Circle = this.add.graphics().lineStyle(5, 0x00ffff);

        this.physics.add.existing(Circle);
        Circle.body.allowGravity = false;
        Circle.body.setCircle(gameWidth / 4);
        Circle.body.immovable = true;
        Circle.strokeCircle(
            Circle.body.halfWidth,
            Circle.body.halfHeight,
            Circle.body.radius
        );
        console.log(Circle);
        console.log(Ball);

        // Resize Circle
        const circleBorderConfig = {
            delay: 5000,
            callback: () => {
                console.log("Initiate Resizing");
                console.log(
                    "Resizing in Progress... Will take about 25 seconds"
                );

                const interval = setInterval(() => {
                    if (Circle.scale >= 0.75) {
                        Circle.scale -= 0.001;
                        Circle.x += Circle.body.halfWidth * 0.001;
                        Circle.y += Circle.body.halfHeight * 0.001;
                    } else {
                        clearInterval(interval);
                        console.log("Finish Resizing");
                    }
                }, 100);
            },
        };

        this.time.addEvent(circleBorderConfig);
    }

    update(delta) {
        const angle = Phaser.Math.Angle.Between(
            Ball.x,
            Ball.y,
            this.input.mousePointer.x,
            this.input.mousePointer.y
        );
        Ball.setRotation(angle + Math.PI / 2);
        if (this.input.mousePointer) {
            // this.physics.moveToObject(Ball, this.input, 240);
            Ball.body.setVelocity(
                this.input.mousePointer.x - Ball.x,
                this.input.mousePointer.y - Ball.y
            );
            // this.physics.arcade.moveToPointer(Ball, 100)
            // console.log(this.input.mousePointer.x, this.input.mousePointer.y)
            // console.log(Ball.x, Ball.y)
        }

        const overlap = this.physics.world.overlap(Circle, Ball);
        if (!overlap) {
            let { x, y } = Ball.getCenter();
            if (Circle.body.halfWidth >= x) {
                x = Math.abs(Circle.body.halfWidth - x) * 0.1 + x;
            } else {
                x = x - Math.abs(Circle.body.halfWidth - x) * 0.1;
            }
            if (Circle.body.halfHeight >= y) {
                y = Math.abs(Circle.body.halfHeight - y) * 0.1 + y;
            } else {
                y = y - Math.abs(Circle.body.halfHeight - y) * 0.1;
            }
            Ball.setPosition(x, y);

            Ball.body.setMaxVelocity(10);
        } else {
            Ball.body.setMaxVelocity(180);
        }
 
    }
}
