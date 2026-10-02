import './styles/main.css';

import { portfolio } from './data/portfolio.js';
import { SECTIONS } from './data/sections.js';

import { createScene } from './three/scene.js';
import { createCamera, createCameraRig, resizeCamera } from './three/camera.js';
import { createRenderer, resizeRenderer, isWebGLAvailable } from './three/renderer.js';
import { addLighting, setShadowMapSize } from './three/lighting.js';
import { createEnvironment, setDecorVisible } from './three/environment.js';
import { loadAvatar } from './three/avatar.js';
import { createPortfolioObjects, setDetailVisible } from './three/objects.js';
import { createInteraction } from './three/interaction.js';
import { createAnimationSystem } from './three/animation.js';
import { getViewport, layoutFor } from './three/viewport.js';

import { createNavigation } from './ui/navigation.js';
import { createPanels } from './ui/panels.js';
import { createSectionRenderers } from './ui/sections.js';
import { hideLoader } from './ui/loader.js';
import { startFallback, scrollToSection, scrollToTop } from './ui/fallback.js';

document.title = `${portfolio.about.name} — ${portfolio.about.title}`;

const uiRoot = document.getElementById('ui');
uiRoot.inert = true;

function revealUi() {
  uiRoot.inert = false;
  hideLoader();
}

if (!isWebGLAvailable()) {
  startHtmlPortfolio();
} else {
  try {
    startScene();
  } catch {
    startHtmlPortfolio();
  }
}

function startHtmlPortfolio() {
  const navigation = createNavigation({
    root: uiRoot,
    about: portfolio.about,
    sections: SECTIONS,
    onSelect: (section) => {
      navigation.setActive(section);
      scrollToSection(section);
    },
    onHome: () => {
      navigation.setActive(null);
      scrollToTop();
    },
  });
  startFallback({ root: uiRoot, portfolio, sections: SECTIONS });
  revealUi();
}

function startScene() {
  const container = document.getElementById('app');

  let viewport = getViewport();
  let layout = layoutFor(viewport);

  const scene = createScene();
  const camera = createCamera();
  const cameraRig = createCameraRig(camera, { layout });
  const renderer = createRenderer(container, {
    pixelRatio: viewport.pixelRatio,
    antialias: !viewport.small,
  });

  const lights = addLighting(scene, { shadowMapSize: viewport.shadowMapSize });
  const environment = createEnvironment(scene);
  setDecorVisible(environment, layout.decor);

  const portfolioObjects = createPortfolioObjects(scene);
  setDetailVisible(portfolioObjects, !viewport.small);
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
  const avatarOrigin = { x: 0, z: 0 };

  function placeAvatar() {
    if (!avatar) return;
    avatar.object.position.x = avatarOrigin.x + layout.avatar.x;
    avatar.object.position.z = avatarOrigin.z + layout.avatar.z;
  }

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
    renderers: createSectionRenderers(portfolio),
    onClose: () => closeSection(),
  });

  function updateViewOffset() {
    const { right, bottom } = panels.getOcclusion();
    const top = bottom > 0 ? navigation.getHeaderBottom() : 0;
    const visibleHeight = (window.innerHeight - bottom - top) / window.innerHeight;
    cameraRig.setViewOffset(right / 2, (bottom - top) / 2, visibleHeight);
  }

  function openSection(section) {
    const object = objectsBySection.get(section);
    interaction.setSelected(section);
    navigation.setActive(section);
    panels.open(section);
    updateViewOffset();
    if (object) cameraRig.focus(object.userData.basePosition);
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

  const animation = createAnimationSystem({
    renderer,
    scene,
    camera,
    cameraRig,
    interaction,
    objects: portfolioObjects,
    getAvatar: () => avatar,
  });

  function handleResize() {
    viewport = getViewport();
    const nextLayout = layoutFor(viewport);

    resizeCamera(camera, viewport.width, viewport.height);
    resizeRenderer(renderer, viewport.width, viewport.height, viewport.pixelRatio);
    setShadowMapSize(lights, viewport.shadowMapSize);
    setDetailVisible(portfolioObjects, !viewport.small);

    if (nextLayout !== layout) {
      layout = nextLayout;
      setDecorVisible(environment, layout.decor);
      placeAvatar();
      cameraRig.setLayout(layout);
    } else {
      cameraRig.resize();
    }

    animation.refresh();
    requestAnimationFrame(updateViewOffset);
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  window.visualViewport?.addEventListener('resize', handleResize);

  loadAvatar(scene, { position: layout.avatar }).then((loaded) => {
    avatar = loaded;
    avatarOrigin.x = avatar.object.position.x - layout.avatar.x;
    avatarOrigin.z = avatar.object.position.z - layout.avatar.z;
    revealUi();
  }).catch(revealUi);
}
