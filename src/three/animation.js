export function startAnimationLoop(renderer, scene, camera, onFrame) {
  renderer.setAnimationLoop((time) => {
    onFrame?.(time);
    renderer.render(scene, camera);
  });
}
