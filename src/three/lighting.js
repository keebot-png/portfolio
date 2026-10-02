import * as THREE from 'three';

export function addLighting(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const directional = new THREE.DirectionalLight(0xffffff, 1.2);
  directional.position.set(3, 5, 4);
  scene.add(ambient, directional);
}
