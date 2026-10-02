import * as THREE from 'three';

export function startAnimationLoop(renderer, scene, camera, onFrame) {
  const timer = new THREE.Timer();
  timer.connect(document);
  let frameId;

  function tick(timestamp) {
    frameId = requestAnimationFrame(tick);
    timer.update(timestamp);
    onFrame?.(timer.getDelta(), timer.getElapsed());
    renderer.render(scene, camera);
  }

  frameId = requestAnimationFrame(tick);

  return function stop() {
    cancelAnimationFrame(frameId);
    timer.dispose();
  };
}
