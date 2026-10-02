import * as THREE from 'three';
import { SCENE_LAYOUTS } from './viewport.js';

// The overview looks slightly down at the scene from the front-right; the
// exact target and distance depend on the active layout and screen aspect.
const HOME_DIRECTION = new THREE.Vector3(0.15, 1.0, 5.6);
const BASE_DISTANCE = HOME_DIRECTION.length();
HOME_DIRECTION.normalize();

// How far (world units) the camera drifts at the edges of the screen.
const PARALLAX = { x: 0.22, y: 0.1, lookX: 0.08, lookY: 0.04 };

// Vertical extent of the scene (floor to pinboard top, plus breathing room).
const SCENE_HEIGHT = 2.9;

export function createCamera({ fov = 40, near = 0.1, far = 100 } = {}) {
  const camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  return camera;
}

export function resizeCamera(camera, width, height) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Drives the camera: timed eased moves between views (animateCameraTo), a
// subtle mouse parallax, and a view offset that keeps the scene centred in
// whatever part of the screen the UI leaves uncovered.
export function createCameraRig(camera, { layout = SCENE_LAYOUTS.wide, duration = 1.2 } = {}) {
  const home = { position: new THREE.Vector3(), target: new THREE.Vector3() };
  const state = { position: new THREE.Vector3(), target: new THREE.Vector3() };
  // What the camera is meant to be looking at, so layout/aspect changes can re-frame it.
  const view = { mode: 'home', point: new THREE.Vector3() };
  let activeLayout = layout;

  const tween = {
    active: false,
    elapsed: 0,
    duration,
    easing: easeInOutCubic,
    from: { position: new THREE.Vector3(), target: new THREE.Vector3() },
    to: { position: new THREE.Vector3(), target: new THREE.Vector3() },
    onComplete: null,
  };

  const offset = { current: new THREE.Vector2(), desired: new THREE.Vector2() };
  const parallax = { current: new THREE.Vector2(), desired: new THREE.Vector2() };
  const lookTarget = new THREE.Vector3();
  // Fraction of the screen height not covered by UI while a section is open.
  let freeHeight = 1;

  // Pull the camera back on narrow screens so the layout's minimum width still fits.
  function computeHome() {
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const visibleHalfWidth = Math.tan(halfFov) * camera.aspect;
    const distance = Math.max(BASE_DISTANCE, activeLayout.minHalfWidth / visibleHalfWidth);
    home.target.fromArray(activeLayout.cameraTarget);
    home.position.copy(HOME_DIRECTION).multiplyScalar(distance).add(home.target);
  }

  function focusPose(point) {
    // Pull back a little and tilt toward the prop while keeping the avatar
    // and desk both in frame beside (or above) the open panel.
    const target = new THREE.Vector3().lerpVectors(home.target, point, 0.12);
    target.x = THREE.MathUtils.lerp(activeLayout.focusCenterX, point.x, 0.1);
    target.y = THREE.MathUtils.lerp(home.target.y, point.y, 0.25);

    const direction = home.position.clone().sub(home.target);
    const homeDistance = direction.length();
    // When the UI leaves only a short band free (bottom sheet), move back far
    // enough for the whole scene height to fit in that band.
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const fitDistance = SCENE_HEIGHT / freeHeight / (2 * Math.tan(halfFov));
    const distance = Math.max(homeDistance * activeLayout.focusPullback, fitDistance);

    const position = direction.setLength(distance).add(target);
    return { position, target };
  }

  function animateCameraTo({ position, target, duration: length = duration, easing = easeInOutCubic, onComplete = null }) {
    tween.from.position.copy(state.position);
    tween.from.target.copy(state.target);
    tween.to.position.copy(position);
    tween.to.target.copy(target);
    tween.elapsed = 0;
    tween.duration = Math.max(length, 0.001);
    tween.easing = easing;
    tween.onComplete = onComplete;
    tween.active = true;
  }

  function stepTween(delta) {
    if (!tween.active) return;
    tween.elapsed += delta;
    const k = tween.easing(Math.min(tween.elapsed / tween.duration, 1));
    state.position.lerpVectors(tween.from.position, tween.to.position, k);
    state.target.lerpVectors(tween.from.target, tween.to.target, k);
    if (tween.elapsed >= tween.duration) {
      tween.active = false;
      tween.onComplete?.();
    }
  }

  // Re-apply the current view after the framing changed (resize / layout switch).
  function reframe(options) {
    const pose = view.mode === 'focus' ? focusPose(view.point) : home;
    animateCameraTo({ position: pose.position, target: pose.target, ...options });
  }

  computeHome();
  state.position.copy(home.position);
  state.target.copy(home.target);
  camera.position.copy(home.position);
  camera.lookAt(home.target);

  return {
    animateCameraTo,

    focus(point, options = {}) {
      view.mode = 'focus';
      view.point.copy(point);
      const pose = focusPose(point);
      animateCameraTo({ position: pose.position, target: pose.target, ...options });
    },

    reset(options = {}) {
      view.mode = 'home';
      animateCameraTo({ position: home.position, target: home.target, ...options });
    },

    setLayout(layout) {
      if (layout === activeLayout) return;
      activeLayout = layout;
      computeHome();
      reframe({ duration: 0.8 });
    },

    // Call after the camera aspect changed; keeps the scene framed without a visible jump.
    resize() {
      computeHome();
      reframe({ duration: 0.3 });
    },

    // `visibleHeight` is the fraction (0–1] of the screen height left free by the UI.
    setViewOffset(x, y, visibleHeight = 1) {
      offset.desired.set(x, y);
      const nextFree = THREE.MathUtils.clamp(visibleHeight, 0.15, 1);
      if (nextFree === freeHeight) return;
      freeHeight = nextFree;
      // Re-aim an in-flight or settled focus move so the fit distance applies.
      if (view.mode === 'focus') {
        const pose = focusPose(view.point);
        if (tween.active) {
          tween.to.position.copy(pose.position);
          tween.to.target.copy(pose.target);
        } else {
          animateCameraTo({ position: pose.position, target: pose.target, duration: 0.3 });
        }
      }
    },

    // Normalised pointer position in [-1, 1]; (0, 0) means no parallax.
    setParallax(x, y) {
      parallax.desired.set(x, y);
    },

    get isAnimating() {
      return tween.active;
    },

    get layout() {
      return activeLayout;
    },

    update(delta) {
      stepTween(delta);

      const smoothing = 1 - Math.exp(-5 * delta);
      offset.current.lerp(offset.desired, smoothing);
      parallax.current.lerp(parallax.desired, smoothing);

      camera.position.copy(state.position);
      camera.position.x += parallax.current.x * PARALLAX.x;
      camera.position.y += parallax.current.y * PARALLAX.y;

      lookTarget.copy(state.target);
      lookTarget.x -= parallax.current.x * PARALLAX.lookX;
      lookTarget.y -= parallax.current.y * PARALLAX.lookY;
      camera.lookAt(lookTarget);

      if (offset.current.lengthSq() > 0.25) {
        const { innerWidth: width, innerHeight: height } = window;
        camera.setViewOffset(width, height, offset.current.x, offset.current.y, width, height);
      } else if (camera.view?.enabled) {
        camera.clearViewOffset();
      }
    },
  };
}
