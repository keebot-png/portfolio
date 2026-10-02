import * as THREE from 'three';

export const BACKGROUND_COLOR = 0x0b0c10;

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  scene.fog = new THREE.FogExp2(BACKGROUND_COLOR, 0.055);
  return scene;
}
