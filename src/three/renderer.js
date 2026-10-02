import * as THREE from 'three';

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// Set `alpha: true` only when the canvas must show the page behind it;
// the scene paints its own background, so an opaque canvas is cheaper.
export function createRenderer(container, {
  alpha = false,
  antialias = true,
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2),
} = {}) {
  if (!isWebGLAvailable()) {
    throw new Error('WebGL is not available');
  }

  const renderer = new THREE.WebGLRenderer({
    antialias,
    alpha,
    powerPreference: 'high-performance',
    stencil: false,
  });

  renderer.setPixelRatio(pixelRatio);
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

export function resizeRenderer(renderer, width, height, pixelRatio = renderer.getPixelRatio()) {
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height);
}
