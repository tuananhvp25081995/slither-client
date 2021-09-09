import Phaser from 'phaser';
import Snake from '../sprites/Snake';
import Slot from '../sprites/Slot';
import Timer from '../sprites/Timer';
import {
  getWS
} from '../socket';
import CircleBorder from '../sprites/CircleBorder';
import Leaderboard from '../sprites/Leaderboard';
import {
  SOCKET_EVENT
} from '../contants';

let snake;
let Circle;
let healthGroup;
let foodGroup;
const foodData = [];
const flag = false;

const RENDER_DELAY = 20;
const gameUpdates = [];
let gameStart = 0;
let firstServerTimestamp = 0;
let isInitSnake = false;
let isInitSnakes = false;

let meTest = {};
let snakeData = [];
export default class Game extends Phaser.Scene {
  preload () {
    this.socket = getWS();
  }

  create () {
    gameStart = 0;
    firstServerTimestamp = 0;
    // const name = localStorage.getItem('username')

    // Always add map first. Everything else is added after map.
    const gameWidth = this.game.config.width;
    const gameHeight = this.game.config.height;
    this.add.tileSprite(0, 0, gameWidth * 3, gameHeight * 3, 'background');
    this.physics.world.setBounds(-gameWidth * 3 / 2, -gameHeight * 3 / 2, gameWidth * 3, gameHeight * 3);

    this.cameras.main.width = gameWidth / 2;
    this.cameras.main.height = gameHeight / 2;

    this.game.snakes = [];

    this.socket.on(SOCKET_EVENT.SERVER_TELL_PLAYER_TO_MOVE, (e) => {
      const playerData = JSON.parse(e);
      meTest = playerData;
      // console.log(playerData);
      if (!isInitSnake) {
        // Init Snake
        const circleSnake = [...playerData.circleSnake];
        const head = circleSnake.shift();

        const snake = new Snake(this, head.x, head.y, 'circle');
        snake.initSections(circleSnake);
        this.game.playerSnake = snake;
        isInitSnake = true;
        this.cameras.main.startFollow(snake.head);
        this.cameras.main.setLerp(0.05);
      }
    });

    this.socket.on(SOCKET_EVENT.SERVER_UPDATE_ALL_PLAYERS, (e) => {
      const data = JSON.parse(e);
      // console.log(data);
      snakeData = data.data;
      if (!isInitSnakes) {
        // Init Snakes

        for (const item of snakeData) {
          const circleSnake = [...item.circleSnake];
          const head = circleSnake.shift();
          const snake = new Snake(this, head.x, head.y, 'circle');
          snake.initSections(circleSnake);
          isInitSnakes = true;
        }
      }
    });
    this.socket.on(SOCKET_EVENT.SERVER_UPDATE_FOOD, (e) => {
      const data = JSON.parse(e);
      console.log(data);
    });

    // plusRunes = new PowerRune(this, snake.head, 'plus', 10, { x: -100, y: -100 }, { x: 750, y: 550 });
    //  When the player sprite his the health packs, call this function ...
    // this.physics.add.overlap(snake.head, plusRunes.healthGroup, plusRunes.spriteHitHealth());
    //

    // if (foodData) {
    //   foodData.forEach(e => {
    //     console.log(e)
    //     // getFood(this, 'food', 1, foodData.Radius, { min: -foodData.X, max: foodData.X }, { min: -foodData.Y, max: foodData.Y });
    //   });
    // }
    // healthGroup = this.physics.add.staticGroup({
    //   key: 'plus',
    //   frameQuantity: 10,
    //   immovable: true,
    //   setScale: {
    //     x: 0.1, y: 0.1
    //   }
    // });

    const children = healthGroup.getChildren();

    for (let i = 0; i < children.length; i++) {
      const x = Phaser.Math.Between(1000, 1750);
      const y = Phaser.Math.Between(1000, 1550);

      children[i].setPosition(x, y);
    }

    healthGroup.refresh();

    //  When the player sprite hits the foods, call this function ...
    // this.physics.add.overlap(snake.head, healthGroup, this.spriteHitHealth)
    // minimap
    const minimapSize = gameWidth / 20;
    this.minimap = this.cameras.add(this.cameras.main.width - minimapSize, this.cameras.main.height - minimapSize, minimapSize, minimapSize).setZoom(0.016);
    this.minimap.setBackgroundColor(0xffffff);

    // create Circle
    // Circle = CircleBorder.createCircle(this, gameWidth / 2)

    Circle = new CircleBorder(this, gameWidth / 2, {
      x: -gameWidth / 2, y: -gameHeight / 2
    });

    // resize Circle
    Circle.resize(5000, 0.75);

    // slot
    this.slot = new Slot(this, this.cameras.main.width, this.cameras.main.height);
    // time countdown
    this.timer = new Timer(this);

    this.leaderboard = new Leaderboard(this);
  }

  spriteHitHealth (sprite, health) {
    healthGroup.killAndHide(health);
  }

  update (time, delta) {
    if (isInitSnake && isInitSnakes) {
      // const { me } = getCurrentState()

      this.slot.update();
      for (let i = this.game.snakes.length - 1; i >= 0; i--) {
        this.game.snakes[i].update(snakeData[i]);
      }
      const pointer = this.input.activePointer.updateWorldPoint(this.cameras.main);
 
      const event = {
        x: pointer.worldX,
        y: pointer.worldY
      };
      this.socket.emit(SOCKET_EVENT.PLAYERSENDTARGET, JSON.stringify(event));
    }
  }
}

function getFood (game, type, quantity, scale, positionX, positionY) {
  foodGroup = game.physics.add.staticGroup({
    key: type,
    frameQuantity: quantity,
    immovable: true,
    setScale: {
      x: scale / 3, y: scale / 3
    }
  });
  if (flag) {
    foodGroup.destroy();
  } else {
    const childrenFood = foodGroup.getChildren();
    for (let i = 0; i < childrenFood.length; i++) {
      const x = Phaser.Math.Between(positionX.min, positionX.max);
      const y = Phaser.Math.Between(positionY.min, positionY.max);

      childrenFood[i].setPosition(x, y);
    }
    foodGroup.refresh();
    game.physics.add.overlap(snake.head, foodGroup, spriteHitFood);
  }
}
// destroy food
function spriteHitFood (sprite, health) {
  console.log('aaa');
  // foodGroup.killAndHide(health)
  // foodGroup.destroy();
}

function processGameUpdate (update) {
  if (!firstServerTimestamp) {
    firstServerTimestamp = update.t;
    gameStart = Date.now();
  }
  gameUpdates.push(update);

  // Keep only one game update before the current server time
  const base = getBaseUpdate();
  if (base > 0) {
    gameUpdates.splice(0, base);
  }
}

function currentServerTime () {
  return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY;
}

// Returns the index of the base update, the first game update before
// current server time, or -1 if N/A.
function getBaseUpdate () {
  const serverTime = currentServerTime();
  for (let i = gameUpdates.length - 1; i >= 0; i--) {
    if (gameUpdates[i].t <= serverTime) {
      return i;
    }
  }
  return -1;
}

function getCurrentState () {
  if (!firstServerTimestamp) {
    return {};
  }

  const base = getBaseUpdate();
  const serverTime = currentServerTime();

  // If base is the most recent update we have, use its state.
  // Otherwise, interpolate between its state and the state of (base + 1).
  if (base < 0 || base === gameUpdates.length - 1) {
    return gameUpdates[gameUpdates.length - 1];
  } else {
    const baseUpdate = gameUpdates[base];
    const next = gameUpdates[base + 1];
    const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t);
    return {
      me: interpolateObject(baseUpdate.me, next.me, ratio),
      others: interpolateObjectArray(baseUpdate.others, next.others, ratio)
    };
  }
}

function interpolateObject (object1, object2, ratio) {
  if (!object2) {
    return object1;
  }

  const interpolated = {};
  Object.keys(object1).forEach(key => {
    if (key === 'circleSnake') {
      interpolated[key] = interpolateCircleSnake(object1[key], object2[key], ratio);
    } else {
      interpolated[key] = object1[key];
    }
  });
  return interpolated;
}
function interpolateCircleSnake (circleSnakes1, circleSnakes2, ratio) {
  circleSnakes1.map((i, v) => {
    return v + (circleSnakes2[i] - v) * ratio;
  });

  return circleSnakes1;
}

function interpolateObjectArray (objects1, objects2, ratio) {
  return objects1.map(o => interpolateObject(o, objects2.find(o2 => o.id === o2.id), ratio));
}
