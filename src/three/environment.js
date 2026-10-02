import * as THREE from 'three';

const ACCENT_COLOR = 0x4f8cff;

function createGround() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.9,
      metalness: 0.1,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}

function createGrid() {
  const grid = new THREE.GridHelper(40, 40, 0x3a4456, 0x262d3a);
  grid.material.transparent = true;
  grid.material.opacity = 0.45;
  grid.material.depthWrite = false;
  grid.position.y = 0.001;
  return grid;
}

function createGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.35)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFloorGlow() {
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.MeshBasicMaterial({
      map: createGlowTexture(),
      color: ACCENT_COLOR,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.002;
  return glow;
}

function createPlatform() {
  const platform = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.25, 0.08, 96),
    new THREE.MeshStandardMaterial({
      color: 0x1a1d24,
      roughness: 0.75,
      metalness: 0.1,
    })
  );
  base.position.y = 0.04;
  base.castShadow = true;
  base.receiveShadow = true;

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.3, 1.33, 128),
    new THREE.MeshBasicMaterial({
      color: ACCENT_COLOR,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.003;

  platform.add(base, ring);
  return platform;
}

export function createEnvironment(scene) {
  const environment = new THREE.Group();
  environment.name = 'environment';
  environment.add(createGround(), createGrid(), createFloorGlow(), createPlatform());
  scene.add(environment);
  return environment;
}
