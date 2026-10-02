import * as THREE from 'three';

// Soft, warm "clay render" lighting: a strong hemisphere light keeps shadows
// gentle, one key light casts soft shadows, a cool fill adds a little depth.
export function addLighting(scene, { shadowMapSize = 2048 } = {}) {
  const ambient = new THREE.HemisphereLight(0xfff8ee, 0xd9c2a8, 1.6);

  const key = new THREE.DirectionalLight(0xfff1dc, 2.4);
  key.position.set(-3.5, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 25;
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 8;

  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.7);
  fill.position.set(5, 3, 3);

  scene.add(ambient, key, fill);
  return { ambient, key, fill };
}

export function setShadowMapSize({ key }, size) {
  if (key.shadow.mapSize.x === size) return;
  key.shadow.mapSize.set(size, size);
  if (key.shadow.map) {
    key.shadow.map.dispose();
    key.shadow.map = null;
  }
}
