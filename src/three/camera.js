import * as THREE from 'three';

// The character stands left of centre with the desk behind him on the right,
// so the overview looks slightly down at the middle of that arrangement.
export const CAMERA_TARGET = new THREE.Vector3(0.45, 1.05, -0.5);

const HOME_POSITION = new THREE.Vector3(0.6, 2.05, 5.1);

// Midpoint between the avatar (x ≈ -0.75) and the desk (x ≈ 1.05).
const FOCUS_CENTER_X = 0.15;

// How far (world units) the camera drifts at the edges of the screen.
const PARALLAX = { x: 0.22, y: 0.1, lookX: 0.08, lookY: 0.04 };

export function createCamera({ fov = 40, near = 0.1, far = 100 } = {}) {
  const camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  camera.position.copy(HOME_POSITION);
  camera.lookAt(CAMERA_TARGET);
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
export function createCameraRig(camera, { duration = 1.2 } = {}) {
  const state = { position: camera.position.clone(), target: CAMERA_TARGET.clone() };

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
  const homeDirection = HOME_POSITION.clone().sub(CAMERA_TARGET);
  const lookTarget = new THREE.Vector3();

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

  return {
    animateCameraTo,

    // Section view: pull back a little and tilt toward the prop while keeping
    // the avatar and desk both in frame beside the open panel.
    focus(point, options = {}) {
      const target = new THREE.Vector3().lerpVectors(CAMERA_TARGET, point, 0.12);
      target.x = THREE.MathUtils.lerp(FOCUS_CENTER_X, point.x, 0.1);
      target.y = THREE.MathUtils.lerp(CAMERA_TARGET.y, point.y, 0.25);
      const position = homeDirection.clone().multiplyScalar(1.18).add(target);
      animateCameraTo({ position, target, ...options });
    },

    reset(options = {}) {
      animateCameraTo({ position: HOME_POSITION, target: CAMERA_TARGET, ...options });
    },

    setViewOffset(x, y) {
      offset.desired.set(x, y);
    },

    // Normalised pointer position in [-1, 1]; (0, 0) means no parallax.
    setParallax(x, y) {
      parallax.desired.set(x, y);
    },

    get isAnimating() {
      return tween.active;
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
