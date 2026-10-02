import './styles/main.css';

import { createScene } from './three/scene.js';
import { createCamera, resizeCamera } from './three/camera.js';
import { createRenderer, resizeRenderer } from './three/renderer.js';
import { addLighting } from './three/lighting.js';
import { createEnvironment } from './three/environment.js';
import { loadAvatar } from './three/avatar.js';
import { startAnimationLoop } from './three/animation.js';

const container = document.getElementById('app');

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer(container);

addLighting(scene);
createEnvironment(scene);

window.addEventListener('resize', () => {
  const { innerWidth: width, innerHeight: height } = window;
  resizeCamera(camera, width, height);
  resizeRenderer(renderer, width, height);
});

let avatar = null;
loadAvatar(scene).then((loaded) => {
  avatar = loaded;
});

startAnimationLoop(renderer, scene, camera, (delta, elapsed) => {
  avatar?.update(delta, elapsed);
});
