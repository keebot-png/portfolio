import * as THREE from 'three';

// The character stands left of centre with the desk behind him on the right,
// so the overview looks slightly down at the middle of that arrangement.
export const CAMERA_TARGET = new THREE.Vector3(0.45, 1.05, -0.5);

const HOME_POSITION = new THREE.Vector3(0.6, 2.05, 5.1);

// Midpoint between the avatar (x ≈ -0.75) and the desk (x ≈ 1.05).
const FOCUS_CENTER_X = 0.15;

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

// Smoothly moves the camera between the overview and section focus views.
// The view offset shifts the rendered image so the scene stays centred in
// whatever part of the screen is not covered by UI.
export function createCameraRig(camera, { damping = 4 } = {}) {
  const current = {
    position: camera.position.clone(),
    target: CAMERA_TARGET.clone(),
    offset: new THREE.Vector2(),
  };
  const desired = {
    position: HOME_POSITION.clone(),
    target: CAMERA_TARGET.clone(),
    offset: new THREE.Vector2(),
  };
  const homeDirection = HOME_POSITION.clone().sub(CAMERA_TARGET);

  return {
    focus(point) {
      // Lean toward the object while keeping the whole avatar in frame.
      // With a panel open only part of the screen is free, so pull back a little
      // and tilt toward the prop while keeping the avatar and desk both in frame.
      desired.target.lerpVectors(CAMERA_TARGET, point, 0.12);
      desired.target.x = THREE.MathUtils.lerp(FOCUS_CENTER_X, point.x, 0.1);
      desired.target.y = THREE.MathUtils.lerp(CAMERA_TARGET.y, point.y, 0.25);
      desired.position.copy(homeDirection).multiplyScalar(1.18);
      desired.position.add(desired.target);
    },

    reset() {
      desired.position.copy(HOME_POSITION);
      desired.target.copy(CAMERA_TARGET);
    },

    setViewOffset(x, y) {
      desired.offset.set(x, y);
    },

    update(delta) {
      const t = 1 - Math.exp(-damping * delta);
      current.position.lerp(desired.position, t);
      current.target.lerp(desired.target, t);
      current.offset.lerp(desired.offset, t);

      camera.position.copy(current.position);
      camera.lookAt(current.target);

      if (current.offset.lengthSq() > 0.25) {
        const { innerWidth: width, innerHeight: height } = window;
        camera.setViewOffset(width, height, current.offset.x, current.offset.y, width, height);
      } else if (camera.view?.enabled) {
        camera.clearViewOffset();
      }
    },
  };
}
