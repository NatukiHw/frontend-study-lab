import * as PIXI from "pixi.js";

/**
 * 根据textures生成AnimatedSprite
 * @param textures
 * @returns {PIXI.AnimatedSprite}
 */
const createAnimatedSpriteFromTextures = textures => {
  const texturesNew = [];
  for (const key in textures) {
    texturesNew.push(textures[key]);
  }
  return new PIXI.AnimatedSprite(texturesNew);
};

export { createAnimatedSpriteFromTextures };
