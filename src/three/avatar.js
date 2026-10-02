import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const DEFAULT_OPTIONS = {
  url: '/models/avatar.glb',
  height: 1.75,
  groundY: 0.08,
  idleClip: /idle/i,
  // Keyed by material name; only matching materials are recoloured.
  materialColors: {
    'asdf1:Beta_HighLimbsGeoSG2': { color: 0x9aa3b2, roughness: 0.55, metalness: 0.05 },
    Beta_Joints_MAT: { color: 0x3d5a8c, roughness: 0.4, metalness: 0.3 },
  },
};

export async function loadAvatar(scene, options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  let avatar;
  try {
    const gltf = await new GLTFLoader().loadAsync(config.url);
    avatar = createModelAvatar(gltf, config);
  } catch (error) {
    console.error(`Avatar: failed to load "${config.url}", using fallback.`, error);
    avatar = createFallbackAvatar(config);
  }

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

  const clips = gltf.animations;
  if (clips.length === 0) {
    return { object: model, update: createProceduralIdle(model) };
  }

  const mixer = new THREE.AnimationMixer(model);
  const actions = Object.fromEntries(
    clips.map((clip) => [clip.name, mixer.clipAction(clip)])
  );
  const idle = clips.find((clip) => config.idleClip.test(clip.name)) ?? clips[0];
  actions[idle.name].play();

  return {
    object: model,
    mixer,
    actions,
    update: (delta) => mixer.update(delta),
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

function createFallbackAvatar(config) {
  const material = new THREE.MeshStandardMaterial({
    color: 0x9aa3b2,
    roughness: 0.55,
    metalness: 0.05,
  });

  const headRadius = config.height * 0.075;
  const bodyRadius = config.height * 0.14;
  const bodyLength = config.height * 0.85 - headRadius * 2 - bodyRadius * 2;

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(bodyRadius, bodyLength, 8, 24),
    material
  );
  body.position.y = bodyRadius + bodyLength / 2;

  const head = new THREE.Mesh(new THREE.SphereGeometry(headRadius, 32, 16), material);
  head.position.y = config.height - headRadius;

  const figure = new THREE.Group();
  figure.name = 'avatar-fallback';
  figure.add(body, head);
  figure.position.y = config.groundY;
  figure.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });

  return { object: figure, update: createProceduralIdle(figure) };
}
