import * as THREE from 'three';

export function createPlaceholderCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x4f8cff });
  return new THREE.Mesh(geometry, material);
}
