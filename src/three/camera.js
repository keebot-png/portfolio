import * as THREE from 'three';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.5, 5);
  camera.lookAt(0, 0, 0);
  return camera;
}
