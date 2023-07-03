<script setup>
import { onMounted, ref } from "vue";
import * as PIXI from "pixi.js";
defineOptions({
  name: "TreasureHunter"
});
const container = ref(null);
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight - 48,
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
  return {
    RESOURCE_BASE_PATH,
    BACKGROUND_JSON,
    init() {
      loader.add(BACKGROUND_JSON);
    }
  };
})();
initResource.init();
loader.load(() => {
  const bgTextures = loader.resources[initResource.BACKGROUND_JSON].textures;
  const bgTexturesNew = [];
  for (const key in bgTextures) {
    bgTexturesNew.push(bgTextures[key]);
  }
  console.log(bgTexturesNew);
  const bgSprite = new PIXI.AnimatedSprite(bgTexturesNew);
  bgSprite.width = window.innerWidth;
  bgSprite.height = window.innerHeight;
  bgSprite.animationSpeed = 0.1;
  bgSprite.play();
  stage.addChild(bgSprite);
});
</script>

<template>
  <div class="container" ref="container" />
</template>

<style lang="scss" scoped>
.container {
  margin: 0 !important;
  padding: 0;
  width: 100%;
  max-width: 100%;
}
</style>
