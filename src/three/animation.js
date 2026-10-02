import * as THREE from 'three';
import { updatePortfolioObjects } from './objects.js';
import { getViewport } from './viewport.js';

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
// hover state and the interactive props. Pointer-driven motion is skipped on
// touch screens and when the user prefers reduced motion.
export function createAnimationSystem({ renderer, scene, camera, cameraRig, interaction, objects, getAvatar, getViewport: readViewport = getViewport }) {
  const pointer = new THREE.Vector2();
  let viewport = readViewport();

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

  function onBlur() {
    pointer.set(0, 0);
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerout', onPointerOut);
  window.addEventListener('blur', onBlur);

  const stopLoop = startAnimationLoop(renderer, scene, camera, (delta, elapsed) => {
    const followPointer = !viewport.reducedMotion && !viewport.coarse;
    const look = followPointer ? pointer : null;
    const simple = viewport.small || viewport.reducedMotion;

    cameraRig.setParallax(look?.x ?? 0, look?.y ?? 0);
    cameraRig.update(delta);

    getAvatar()?.update(delta, elapsed, { pointer: look, simple });

    interaction.update();
    updatePortfolioObjects(objects, delta, elapsed, { simple });
  });

  return {
    pointer,
    // Call after a resize so the system picks up a changed input mode or motion preference.
    refresh() {
      viewport = readViewport();
    },
    stop() {
      stopLoop();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('blur', onBlur);
    },
  };
}
