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
  const STAND_JSON = `${RESOURCE_BASE_PATH}/stand.json`;
  return {
    RESOURCE_BASE_PATH,
    BACKGROUND_JSON,
    init() {
      loader.add(BACKGROUND_JSON);
    }
  };
})();
initResource.init();
/**
 * 精灵选渲染及初始化
 */
const initSprite = (() => {
  let bgSprite;
  return {
    bgSprite,
    renderBackground() {
      const bgTextures =
        loader.resources[initResource.BACKGROUND_JSON].textures;
      initResource.bgSprite = createAnimatedSpriteFromTextures(bgTextures);
      const bgSprite = initResource.bgSprite;
      bgSprite.width = CONTAINER_WIDTH;
      bgSprite.height = CONTAINER_HEIGHT;
      bgSprite.animationSpeed = 0.1;
      bgSprite.play();
      stage.addChild(bgSprite);
    }
  };
})();
/**
 * 资源加载完毕
 */
loader.load(() => {
  initSprite.renderBackground();
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
