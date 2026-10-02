import * as THREE from 'three';
import { updatePortfolioObjects } from './objects.js';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Basic requestAnimationFrame render loop. `onFrame(delta, elapsed)` runs
// before each render; returns a function that stops the loop.
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

// Orchestrates everything that moves each frame: the camera rig (including a
// small pointer parallax), the avatar (which also glances toward the pointer),
// hover state and the interactive props.
export function createAnimationSystem({ renderer, scene, camera, cameraRig, interaction, objects, getAvatar }) {
  const pointer = new THREE.Vector2();
  const reducedMotion = prefersReducedMotion();

  function onPointerMove(event) {
    if (event.pointerType === 'touch') return;
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -((event.clientY / window.innerHeight) * 2 - 1)
    );
  }

  function onPointerOut(event) {
    if (!event.relatedTarget) pointer.set(0, 0);
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerout', onPointerOut);
  window.addEventListener('blur', () => pointer.set(0, 0));

  const stopLoop = startAnimationLoop(renderer, scene, camera, (delta, elapsed) => {
    const look = reducedMotion ? null : pointer;

    cameraRig.setParallax(look?.x ?? 0, look?.y ?? 0);
    cameraRig.update(delta);

    getAvatar()?.update(delta, elapsed, { pointer: look });

    interaction.update();
    updatePortfolioObjects(objects, delta, elapsed);
  });

  return {
    pointer,
    reducedMotion,
    stop() {
      stopLoop();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerOut);
    },
  };
}
