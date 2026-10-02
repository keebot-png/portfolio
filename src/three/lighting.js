import * as THREE from 'three';

export function addLighting(scene) {
  const ambient = new THREE.HemisphereLight(0xb4c0d4, 0x0b0d12, 0.35);

  const key = new THREE.DirectionalLight(0xfff1e0, 2.2);
  key.position.set(4, 6, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;

  const fill = new THREE.DirectionalLight(0x9db8ff, 0.35);
  fill.position.set(-5, 3, 2);

  const rim = new THREE.DirectionalLight(0x4f8cff, 0.6);
  rim.position.set(-1, 4, -6);

  scene.add(ambient, key, fill, rim);

  return { ambient, key, fill, rim };
}
