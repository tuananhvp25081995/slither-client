import Phaser from 'phaser';
import {
  initWs
} from '../socket';
export default class Boot extends Phaser.Scene {
  preload () {
    this.load.image('background', 'assets/images/background.jpg');
    this.load.image('food', 'assets/images/food.png');
    this.load.image('plus', 'assets/images/runes/plus.png');
    this.load.image('star', 'assets/images/runes/star.png');
    this.load.image('heart', 'assets/images/runes/heart.png');
    this.load.image('rectangle', 'assets/images/Rectangle.png');
    this.load.image('item', 'assets/images/orange-circle.png');
    this.load.image('circle', 'assets/images/circle.png');
    this.load.image('skill1', 'assets/images/skill1.png');
    this.load.image('skill2', 'assets/images/skill2.png');
    this.load.image('skill3', 'assets/images/skill3.png');
    this.load.image('skill4', 'assets/images/skill4.png');
    this.load.html('leaderboard', 'assets/html/leaderboard.html');
    this.load.html('loginform', 'assets/html/login.html');
    initWs();
  }

  create () {
    this.scene.start('login');
  }
}
