import './styles/main.css';

import { createScene } from './three/scene.js';
import { createCamera } from './three/camera.js';
import { createRenderer, handleResize } from './three/renderer.js';
import { addLighting } from './three/lighting.js';
import { createPlaceholderCube } from './three/objects.js';
import { startAnimationLoop } from './three/animation.js';

const container = document.getElementById('app');

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer(container);

addLighting(scene);

const cube = createPlaceholderCube();
scene.add(cube);

handleResize(renderer, camera);

startAnimationLoop(renderer, scene, camera, (time) => {
  const t = time / 1000;
  cube.rotation.x = t * 0.5;
  cube.rotation.y = t * 0.8;
});
