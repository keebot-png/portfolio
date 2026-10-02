import * as THREE from 'three';
import { createCharacter } from './character.js';

const DEFAULT_OPTIONS = {
  // Set to a GLB path (e.g. '/models/avatar.glb') to load a model instead of
  // the built-in character. The built-in character is also the fallback.
  url: null,
  height: 1.75,
  groundY: 0,
  // Where the avatar stands (x, z); y comes from groundY.
  position: { x: -0.75, z: 0.15 },
  idleClip: /idle/i,
  // Optional recolouring keyed by material name, e.g. { Wolf3D_Outfit_Top: { color: 0x2b313c } }.
  materialColors: {},
};

export async function loadAvatar(scene, options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  let avatar;
  if (!config.url) {
    avatar = createCharacter(config);
  } else {
    try {
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
      const gltf = await new GLTFLoader().loadAsync(config.url);
      avatar = createModelAvatar(gltf, config);
    } catch {
      avatar = createCharacter(config);
    }
  }

  avatar.object.position.x += config.position.x;
  avatar.object.position.z += config.position.z;
  scene.add(avatar.object);
  return avatar;
}

function createModelAvatar(gltf, config) {
  const model = gltf.scene;
  model.name = 'avatar';

  model.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    applyMaterialOverrides(child, config.materialColors);
  });

  fitToHeight(model, config.height, config.groundY);

  const blink = createBlink(model);
  const clips = gltf.animations;
  const idle = clips.find((clip) => config.idleClip.test(clip.name));

  // Unanimated models export in a T/A-pose; relax the arms to the sides.
  if (!idle) applyRestPose(model);

  // Without a real idle clip, fall back to procedural movement rather than
  // playing whatever clip happens to come first (which may be a walk or dance).
  if (!idle) {
    const proceduralIdle = createProceduralIdle(model);
    return {
      object: model,
      update: (delta, elapsed) => {
        proceduralIdle(delta, elapsed);
        blink(elapsed);
      },
    };
  }

  const mixer = new THREE.AnimationMixer(model);
  const actions = Object.fromEntries(
    clips.map((clip) => [clip.name, mixer.clipAction(clip)])
  );
  actions[idle.name].play();

  return {
    object: model,
    mixer,
    actions,
    update: (delta, elapsed) => {
      mixer.update(delta);
      blink(elapsed);
    },
  };
}

// Extra rotation (radians, about each bone's local Z) applied on top of the
// exported bind pose. Mixamo-style rigs mirror left/right, hence the signs.
const REST_POSE = [
  { bone: /^(mixamorig:?)?LeftArm$/, z: -1.05 },
  { bone: /^(mixamorig:?)?RightArm$/, z: 1.05 },
];

function applyRestPose(object) {
  object.traverse((child) => {
    if (!child.isBone) return;
    const pose = REST_POSE.find(({ bone }) => bone.test(child.name));
    if (pose) child.rotateZ(pose.z);
  });
}

// Periodic eye blink driven by ARKit-style morph targets, if the model has them.
function createBlink(object) {
  const targets = [];
  object.traverse((child) => {
    const dict = child.morphTargetDictionary;
    if (!dict) return;
    for (const name of ['eyeBlinkLeft', 'eyeBlinkRight', 'eyesClosed']) {
      if (name in dict) targets.push({ influences: child.morphTargetInfluences, index: dict[name] });
    }
  });
  if (targets.length === 0) return () => {};

  const PERIOD = 4.2;
  const DURATION = 0.16;
  return (elapsed) => {
    const t = elapsed % PERIOD;
    const amount = t < DURATION ? Math.sin((t / DURATION) * Math.PI) : 0;
    for (const { influences, index } of targets) influences[index] = amount;
  };
}

function applyMaterialOverrides(mesh, overrides) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const material of materials) {
    const override = overrides[material.name];
    if (!override) continue;
    material.color.set(override.color);
    material.roughness = override.roughness;
    material.metalness = override.metalness;
  }
}

function fitToHeight(object, height, groundY) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  object.scale.multiplyScalar(height / size.y);

  box.setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.x -= center.x;
  object.position.z -= center.z;
  object.position.y += groundY - box.min.y;
}

// Used when the model has no animation clips: gentle breathing and sway on
// the spine/neck bones if present, otherwise on the whole object.
function createProceduralIdle(object) {
  const bones = {};
  object.traverse((child) => {
    if (!child.isBone) return;
    if (!bones.spine && /spine1|chest|spine/i.test(child.name)) bones.spine = child;
    if (!bones.neck && /neck/i.test(child.name)) bones.neck = child;
  });

  const base = {
    spine: bones.spine?.rotation.clone(),
    neck: bones.neck?.rotation.clone(),
    scaleY: object.scale.y,
    rotationY: object.rotation.y,
  };

  return (delta, elapsed) => {
    const breath = Math.sin(elapsed * 1.6);
    const sway = Math.sin(elapsed * 0.45);

    if (bones.spine) {
      bones.spine.rotation.x = base.spine.x + breath * 0.012;
      bones.spine.rotation.z = base.spine.z + sway * 0.01;
      if (bones.neck) bones.neck.rotation.y = base.neck.y + sway * 0.04;
    } else {
      object.scale.y = base.scaleY * (1 + breath * 0.004);
      object.rotation.y = base.rotationY + sway * 0.03;
    }
  };
}
