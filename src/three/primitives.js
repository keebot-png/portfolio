import * as THREE from 'three';

// Shared helpers for the primitive-built "clay" look used by the character,
// the room decor and the interactive props.

export function clay(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });
}

export function mesh(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

export function box(w, h, d, material, position, rotation) {
  return mesh(new THREE.BoxGeometry(w, h, d), material, position, rotation);
}

export function cylinder(rTop, rBottom, h, material, position, rotation, segments = 24) {
  return mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), material, position, rotation);
}

export function sphere(r, material, position, segments = 20) {
  return mesh(new THREE.SphereGeometry(r, segments, Math.round(segments * 0.7)), material, position);
}

export function group(children, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Group();
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.add(...children);
  return object;
}
