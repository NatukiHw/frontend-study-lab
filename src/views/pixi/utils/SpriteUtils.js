import * as PIXI from "pixi.js";

/**
 * 根据textures生成AnimatedSprite
 * @param textures
 * @returns {PIXI.AnimatedSprite}
 */
const createAnimatedSpriteFromTextures = textures => {
  const bgTexturesNew = [];
  for (const key in textures) {
    bgTexturesNew.push(textures[key]);
  }
  return new PIXI.AnimatedSprite(bgTexturesNew);
};

export { createAnimatedSpriteFromTextures };
