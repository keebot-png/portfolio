import * as THREE from 'three';

// Set `alpha: true` only when the canvas must show the page behind it;
// the scene paints its own background, so an opaque canvas is cheaper.
export function createRenderer(container, { alpha = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral keeps the pastel palette true to its colours (ACES would desaturate it).
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  container.appendChild(renderer.domElement);
  return renderer;
}

export function resizeRenderer(renderer, width, height) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
}
