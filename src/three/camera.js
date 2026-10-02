import * as THREE from 'three';

export const CAMERA_TARGET = new THREE.Vector3(0, 1, 0);

export function createCamera({ fov = 40, near = 0.1, far = 100 } = {}) {
  const camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  camera.position.set(0, 1.8, 7);
  camera.lookAt(CAMERA_TARGET);
  return camera;
}

export function resizeCamera(camera, width, height) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
