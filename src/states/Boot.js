import Phaser from "phaser";
import PowerRune from "./PowerRune";
import { Util } from "../utils";
let Ball;
let Circle;
let Food1;
export default class Boot extends Phaser.Scene {
    preload() {
        this.load.image("background", "assets/images/background.jpg");
        this.load.image("food", "assets/images/food.png");
        this.load.image("plus", "assets/images/runes/plus.png");
        this.load.image("star", "assets/images/runes/star.png");
        this.load.image("heart", "assets/images/runes/heart.png");
    }

    create() {
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        this.add.tileSprite(0, 0, gameWidth * 3, gameHeight * 3, "background");

        // Ball
        Ball = this.add.circle(200, 300, 10, 0xffffff, 1);
        this.physics.add.existing(Ball);
        Ball.body.setCollideWorldBounds(true, 1, 1);
        Ball.body.setVelocity(200, 200);
        this.cameras.main.width = gameWidth / 2;
        this.cameras.main.height = gameHeight / 2;
        this.cameras.main.startFollow(Ball);

        Food1 = new PowerRune(this, 400, 400, "plus");
        // let Food2 = new PowerRune(this, 400, 400, "food");

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
        console.log(this, 100);
        console.log(Ball);
        // for (let i = 0; i < 100; i++) {
        //     this.initRune(
        //         this,
        //         Util.randomInt(-Circle.body.width, Circle.body.width),
        //         Util.randomInt(-Circle.body.height, Circle.body.height),
        //         "plus"
        //     );
        // }
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
    initRune(scene, x, y, type) {
        let rune = new PowerRune(scene, x, y, type);
        return rune;
    }
    onCollideRune(item1, item2) {
        const overlap = this.physics.world.overlap(item1, item2)
        console.log(overlap);
        if (overlap) {
            console.log('true');
        }
    }

    update(delta) {
        console.log(Food1);
        this.onCollideRune(Food1, Ball);
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
