<script setup>
import { onMounted, ref } from "vue";
import * as PIXI from "pixi.js";
import { createAnimatedSpriteFromTextures } from "./utils/SpriteUtils";

defineOptions({
  name: "TreasureHunter"
});
const CONTAINER_WIDTH = 1020, CONTAINER_HEIGHT = 628;
const container = ref(null);
const app = new PIXI.Application({
  width: CONTAINER_WIDTH,
  height: CONTAINER_HEIGHT,
  antialias: true,
  resolution: 1,
  backgroundColor: 0
});
app.renderer.backgroundColor = 0x000000;
const loader = app.loader,
  stage = app.stage;
onMounted(() => {
  container.value.appendChild(app.view);
});
/**
 * 加载游戏资源
 */
const initResource = (() => {
  const RESOURCE_BASE_PATH = "/static/kofExample";
  const BACKGROUND_JSON = `${RESOURCE_BASE_PATH}/bg.json`;
  const PLAYER_STAND_JSON = `${RESOURCE_BASE_PATH}/stand.json`;
  return {
    RESOURCE_BASE_PATH,
    BACKGROUND_JSON,
    PLAYER_STAND_JSON,
    init() {
      loader
        .add(BACKGROUND_JSON)
        .add(PLAYER_STAND_JSON);
    }
  };
})();
initResource.init();
/**
 * 精灵选渲染及初始化
 */
const initSprite = (() => {
  let bgSprite;
  let playerSprite;
  return {
    bgSprite,
    playerSprite,
    renderBackground() {
      const bgTextures = loader.resources[initResource.BACKGROUND_JSON].textures;
      bgSprite = createAnimatedSpriteFromTextures(bgTextures);
      bgSprite.width = CONTAINER_WIDTH;
      bgSprite.height = CONTAINER_HEIGHT;
      bgSprite.animationSpeed = 0.1;
      bgSprite.play();
      stage.addChild(bgSprite);
    },
    renderPlayer() {
      const playerContainer = new PIXI.Container();
      const playerTextures = loader.resources[initResource.PLAYER_STAND_JSON].textures;
      playerSprite = createAnimatedSpriteFromTextures(playerTextures)
      playerSprite.width = 120;
      playerSprite.height = 165;
      playerSprite.animationSpeed = 0.3
      playerSprite.play();
      playerContainer.addChild(playerSprite);
      playerContainer.y = 410
      stage.addChild(playerContainer);
    }
  };
})();
/**
 * 资源加载完毕
 */
loader.load(() => {
  initSprite.renderBackground();
  initSprite.renderPlayer();
});
</script>

<template>
  <div class="container flex justify-center items-center" ref="container" />
</template>

<style lang="scss" scoped>
.container {
  margin: 0 !important;
  padding: 0;
  width: 100%;
  max-width: 100%;
  height: calc(100vh - 48px);
}
</style>
