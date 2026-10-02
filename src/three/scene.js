import * as THREE from 'three';

// Warm cream backdrop. The floor is a shadow-only plane, so the ground and
// background read as one seamless surface with soft drop shadows on it.
export const BACKGROUND_COLOR = 0xf5eee4;

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  return scene;
}
