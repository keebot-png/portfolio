import './styles/main.css';

import { portfolio } from './data/portfolio.js';
import { SECTIONS } from './data/sections.js';

import { createScene } from './three/scene.js';
import { createCamera, createCameraRig, resizeCamera } from './three/camera.js';
import { createRenderer, resizeRenderer } from './three/renderer.js';
import { addLighting } from './three/lighting.js';
import { createEnvironment } from './three/environment.js';
import { loadAvatar } from './three/avatar.js';
import { createPortfolioObjects, updatePortfolioObjects } from './three/objects.js';
import { createInteraction } from './three/interaction.js';
import { startAnimationLoop } from './three/animation.js';

import { createNavigation } from './ui/navigation.js';
import { createPanels } from './ui/panels.js';
import { createModal } from './ui/modal.js';
import { createSectionRenderers } from './ui/sections.js';

document.title = `${portfolio.about.name} — ${portfolio.about.title}`;

// 3D scene
const container = document.getElementById('app');

const scene = createScene();
const camera = createCamera();
const cameraRig = createCameraRig(camera);
const renderer = createRenderer(container);

addLighting(scene);
createEnvironment(scene);

const portfolioObjects = createPortfolioObjects(scene);
const objectsBySection = new Map(
  portfolioObjects.map((object) => [object.userData.section, object])
);

const interaction = createInteraction({
  camera,
  domElement: renderer.domElement,
  objects: portfolioObjects,
  onSelect: (section) => openSection(section),
});

let avatar = null;
loadAvatar(scene).then((loaded) => {
  avatar = loaded;
});

// HTML interface
const uiRoot = document.getElementById('ui');

const modal = createModal(uiRoot);

const navigation = createNavigation({
  root: uiRoot,
  about: portfolio.about,
  sections: SECTIONS,
  onSelect: (section) => openSection(section),
  onHome: () => closeSection(),
});

const panels = createPanels({
  root: uiRoot,
  sections: SECTIONS,
  renderers: createSectionRenderers(portfolio, { modal }),
  onClose: () => closeSection(),
});

function updateViewOffset() {
  const { right, bottom } = panels.getOcclusion();
  cameraRig.setViewOffset(right / 2, bottom / 2);
}

function openSection(section) {
  const object = objectsBySection.get(section);
  interaction.setSelected(section);
  navigation.setActive(section);
  panels.open(section);
  if (object) cameraRig.focus(object.userData.basePosition);
  updateViewOffset();
}

function closeSection() {
  const section = panels.active;
  const hadFocus = panels.close();
  interaction.clearSelection();
  navigation.setActive(null);
  cameraRig.reset();
  updateViewOffset();
  if (hadFocus && section) navigation.focus(section);
}

window.addEventListener('resize', () => {
  const { innerWidth: width, innerHeight: height } = window;
  resizeCamera(camera, width, height);
  resizeRenderer(renderer, width, height);
  updateViewOffset();
});

startAnimationLoop(renderer, scene, camera, (delta, elapsed) => {
  avatar?.update(delta, elapsed);
  cameraRig.update(delta);
  interaction.update();
  updatePortfolioObjects(portfolioObjects, delta, elapsed);
});
