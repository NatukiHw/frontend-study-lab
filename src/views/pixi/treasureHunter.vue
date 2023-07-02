<script setup>
import { onMounted, ref } from "vue";
import * as PIXI from "pixi.js";

defineOptions({
  name: "TreasureHunter"
});

const app = new PIXI.Application({
  width: 512,
  height: 512,
  antialias: true,
  transparent: false,
  resolution: 1
});
let gameScene, gameOverScene, state;
let blobs, healthBar, message, door, explorer, treasure;
const stage = app.stage;

const container = ref(null);
onMounted(() => {
  container.value.appendChild(app.view);
});

// 游戏资源
const JSON_PATH = "/static/treasureHunter/resource.json";
app.loader.add(JSON_PATH);

app.loader.load(startup);
function startup() {
  // 游戏贴图
  const textures = app.loader.resources[JSON_PATH].textures;
  // 游戏场景
  gameScene = new PIXI.Container();
  const map = new PIXI.Sprite(textures["dungeon.png"]);
  map.position.set(0, 0);
  gameScene.addChild(map);
  stage.addChild(gameScene);
  // 游戏结束场景
  gameOverScene = new PIXI.Container();
  gameOverScene.visible = false;
  const style = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  });
  message = new PIXI.Text("The End!", style);
  message.x = 120;
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);
  stage.addChild(gameOverScene);
  // 生成猎人
  explorer = new PIXI.Sprite(textures["explorer.png"]);
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);
  // 生成出口
  door = new PIXI.Sprite(textures["door.png"]);
  door.position.set(32, 0);
  gameScene.addChild(door);
  // 生成宝藏
  treasure = new PIXI.Sprite(textures["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);
  // 生成怪物
  const numberOfBlobs = 6,
    spacing = 48,
    xOffset = 150,
    speed = 2;
  let direction = 1;
  blobs = [];
  for (let i = 0; i < numberOfBlobs; i++) {
    const blob = new PIXI.Sprite(textures["blob.png"]);
    const x = spacing * i + xOffset;
    const y = randomInt(0, app.stage.height - blob.height);
    blob.x = x;
    blob.y = y;
    blob.vy = speed * direction;
    direction *= -1;
    blobs.push(blob);
    gameScene.addChild(blob);
  }
  // 生命值显示
  healthBar = new PIXI.Graphics();
  healthBar.position.set(stage.width - 170, 4);
  gameScene.addChild(healthBar);
  const innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(healthBar);
  const outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xff3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);
  healthBar.outer = outerBar;
  gameScene.addChild(healthBar);
  // 键盘事件监听
  const left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
  left.press = function () {
    explorer.vx = -2;
  };
  left.release = function () {
    explorer.vx = 0;
  };
  up.press = function () {
    explorer.vy = -2;
  };
  up.release = function () {
    explorer.vy = 0;
  };
  right.press = function () {
    explorer.vx = 2;
  };
  right.release = function () {
    explorer.vx = 0;
  };
  down.press = function () {
    explorer.vy = 2;
  };
  down.release = function () {
    explorer.vy = 0;
  };
  // 启动游戏循环
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

function play() {
  //All the game logic goes here
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;

  //Contain the explorer inside the area of the dungeon
  contain(explorer, { x: 28, y: 10, width: 488, height: 480 });
  //contain(explorer, stage);

  //Set `explorerHit` to `false` before checking for a collision
  let explorerHit = false;

  //Loop through all the sprites in the `enemies` array
  blobs.forEach(function (blob) {
    //Move the blob
    blob.y += blob.vy;

    //Check the blob's screen boundaries
    const blobHitsWall = contain(blob, {
      x: 28,
      y: 10,
      width: 488,
      height: 480
    });

    //If the blob hits the top or bottom of the stage, reverse
    //its direction
    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob.vy *= -1;
    }

    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
    if (hitTestRectangle(explorer, blob)) {
      explorerHit = true;
    }
  });

  //If the explorer is hit...
  if (explorerHit) {
    //Make the explorer semi-transparent
    explorer.alpha = 0.5;

    //Reduce the width of the health bar's inner rectangle by 1 pixel
    healthBar.outer.width -= 1;
  } else {
    //Make the explorer fully opaque (non-transparent) if it hasn't been hit
    explorer.alpha = 1;
  }

  //Check for a collision between the explorer and the treasure
  if (hitTestRectangle(explorer, treasure)) {
    //If the treasure is touching the explorer, center it over the explorer
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

  //Does the explorer have enough health? If the width of the `innerBar`
  //is less than zero, end the game and display "You lost!"
  if (healthBar.outer.width < 0) {
    state = end;
    message.text = "You lost!";
  }

  //If the explorer has brought the treasure to the exit,
  //end the game and display "You won!"
  if (hitTestRectangle(treasure, door)) {
    state = end;
    message.text = "You won!";
  }
}

function end() {
  //All the code that should run at the end of the game
  gameScene.visible = false;
  gameOverScene.visible = true;
}

//The game's helper functions:
//`keyboard`, `hitTestRectangle`, `contain` and `randomInt`
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  const vx = r1.centerX - r2.centerX;
  const vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

function contain(sprite, container) {
  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}

function keyboard(keyCode) {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
}
</script>

<template>
  <div class="flex justify-center items-center h-[640px]" ref="container" />
</template>
