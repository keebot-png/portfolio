import * as THREE from 'three';
import { clay, mesh, box, cylinder, sphere, group } from './primitives.js';

// Non-interactive room decor: floor shadows, rug, desk, chair, plant.
// Interactive desk items live in objects.js.

export const DESK = { x: 1.05, y: 0.74, z: -1.3, width: 2.3, depth: 0.9 };

const PALETTE = {
  wood: 0xc99a66,
  white: 0xfbf8f3,
  rugOuter: 0xf0a04b,
  rugMid: 0xf6c26b,
  rugInner: 0xfadc93,
  pot: 0xd08a5e,
  potRim: 0xbf7a4f,
  leaf: 0x6db37a,
  leafDark: 0x4f9a5f,
  chair: 0xfbf8f3,
  chairMetal: 0xb9b2aa,
  soil: 0x5b4536,
};

function createFloor() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.ShadowMaterial({ opacity: 0.16, color: 0x5a3f2a })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  return floor;
}

function createRug() {
  const layers = [
    [4.6, 3.4, PALETTE.rugOuter],
    [3.6, 2.5, PALETTE.rugMid],
    [2.5, 1.6, PALETTE.rugInner],
  ];
  return group(
    layers.map(([w, d, color], i) => box(w, 0.03, d, clay(color), [0, 0.015 + i * 0.012, 0])),
    [0.5, 0, -0.55]
  );
}

function createDesk() {
  const top = box(DESK.width, 0.08, DESK.depth, clay(PALETTE.white), [0, DESK.y, 0]);
  const legMaterial = clay(PALETTE.wood);
  const lx = DESK.width / 2 - 0.12;
  const lz = DESK.depth / 2 - 0.1;
  const legs = [
    [-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz],
  ].map(([x, z]) => cylinder(0.04, 0.035, DESK.y - 0.04, legMaterial, [x, (DESK.y - 0.04) / 2, z]));

  const keyboard = box(0.56, 0.03, 0.18, clay(0xe6e1da), [0.05, DESK.y + 0.055, 0.22], [0, 0.03, 0]);
  const keys = box(0.5, 0.012, 0.12, clay(0xd2ccc4), [0.05, DESK.y + 0.076, 0.22], [0, 0.03, 0]);
  const mouse = mesh(new THREE.CapsuleGeometry(0.035, 0.05, 4, 12), clay(0xe6e1da), [0.5, DESK.y + 0.07, 0.24], [Math.PI / 2, 0, 0.1]);

  const cupMaterial = clay(0xf4f0ea);
  const cup = cylinder(0.05, 0.045, 0.12, cupMaterial, [-0.95, DESK.y + 0.1, -0.2]);
  const pencils = [0xf0a04b, 0x6c9bd2, 0xe06b6b].map((color, i) =>
    cylinder(0.008, 0.008, 0.2, clay(color), [-0.95 + (i - 1) * 0.02, DESK.y + 0.2, -0.2 + (i % 2) * 0.02], [0.1 * (i - 1), 0, 0.12 * (i - 1)])
  );

  return group([top, ...legs, keyboard, keys, mouse, cup, ...pencils], [DESK.x, 0, DESK.z]);
}

function createChair() {
  const seat = box(0.5, 0.07, 0.48, clay(PALETTE.chair), [0, 0.5, 0]);
  const back = box(0.48, 0.52, 0.06, clay(PALETTE.chair), [0, 0.86, 0.24], [0.08, 0, 0]);
  const column = cylinder(0.03, 0.03, 0.4, clay(PALETTE.chairMetal), [0, 0.27, 0]);
  const base = group(
    [0, 1, 2, 3, 4].map((i) =>
      box(0.5, 0.03, 0.05, clay(PALETTE.chairMetal), [0, 0.035, 0], [0, (i / 5) * Math.PI * 2, 0])
    )
  );
  // Rotated so the backrest faces the camera and the seat faces the desk.
  return group([seat, back, column, base], [DESK.x - 0.1, 0, DESK.z + 0.75], [0, Math.PI, 0]);
}

function createPlant(position, scale = 1) {
  const pot = cylinder(0.2, 0.16, 0.42, clay(PALETTE.pot), [0, 0.21, 0]);
  const rim = cylinder(0.215, 0.215, 0.06, clay(PALETTE.potRim), [0, 0.42, 0]);
  const soil = cylinder(0.19, 0.19, 0.02, clay(PALETTE.soil), [0, 0.45, 0]);

  const leaves = [];
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const leaf = sphere(0.16, clay(i % 2 ? PALETTE.leaf : PALETTE.leafDark), [
      Math.cos(angle) * 0.14,
      0.6 + (i % 3) * 0.09,
      Math.sin(angle) * 0.14,
    ]);
    leaf.scale.set(0.55, 1.1, 0.3);
    leaf.rotation.set(0.35 * Math.sin(angle), -angle, 0.35 * Math.cos(angle));
    leaves.push(leaf);
  }

  const plant = group([pot, rim, soil, ...leaves], position);
  plant.scale.setScalar(scale);
  return plant;
}

// Decor that can be dropped on small screens: it sits outside the compact
// framing anyway and skipping it saves draw calls and shadow work.
function decor(object) {
  object.userData.decor = true;
  return object;
}

export function createEnvironment(scene) {
  const environment = new THREE.Group();
  environment.name = 'environment';
  environment.add(
    createFloor(),
    createRug(),
    createDesk(),
    createChair(),
    decor(createPlant([2.75, 0, -0.5], 1.15)),
    decor(createPlant([-1.9, 0, -1.6], 0.75))
  );
  scene.add(environment);
  return environment;
}

export function setDecorVisible(environment, visible) {
  for (const child of environment.children) {
    if (child.userData.decor) child.visible = visible;
  }
}
