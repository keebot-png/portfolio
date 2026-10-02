import * as THREE from 'three';
import { clay, mesh, box, cylinder, sphere, group } from './primitives.js';
import { DESK } from './environment.js';

// Interactive desk items, one per portfolio section:
//   projects   → the two monitors
//   experience → cork pinboard on the wall
//   skills     → wall shelf with books
//   about      → coffee mug
//   contact    → phone on the desk

const HIGHLIGHT_COLOR = new THREE.Color(0xffb067);
const CODE_COLORS = [0xc792ea, 0x7ec699, 0xf5c26b, 0x82aaff, 0xf07178];
const WALL_Z = DESK.z - DESK.depth / 2 - 0.08;

function createMonitor(width, height, lineSeed) {
  const frame = box(width, height, 0.05, clay(0x2b2e3a), [0, height / 2 + 0.2, 0]);
  const screen = box(width - 0.06, height - 0.06, 0.012, clay(0x1b1d28), [0, height / 2 + 0.2, 0.025]);

  const lines = [];
  const rows = Math.floor((height - 0.12) / 0.045);
  for (let i = 0; i < rows; i++) {
    const seed = Math.sin(lineSeed + i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);
    const indent = (i % 4) * 0.04;
    const lineWidth = 0.1 + frac * 0.28;
    const color = CODE_COLORS[Math.floor(frac * CODE_COLORS.length)];
    lines.push(
      box(lineWidth, 0.014, 0.004, clay(color, { emissive: color, emissiveIntensity: 0.35 }), [
        -width / 2 + 0.08 + indent + lineWidth / 2,
        height + 0.2 - 0.08 - i * 0.045,
        0.034,
      ])
    );
  }

  const stand = box(0.06, 0.2, 0.05, clay(0x3a3d4a), [0, 0.1, -0.02]);
  const base = box(0.34, 0.025, 0.2, clay(0x3a3d4a), [0, 0.0125, 0]);
  return group([frame, screen, ...lines, stand, base]);
}

function createMonitors() {
  const left = createMonitor(0.82, 0.5, 1);
  left.position.set(-0.45, 0, -0.1);
  left.rotation.y = 0.22;
  const right = createMonitor(0.82, 0.5, 7);
  right.position.set(0.48, 0, -0.14);
  right.rotation.y = -0.16;
  return group([left, right], [DESK.x, DESK.y + 0.04, DESK.z]);
}

function createPinboard() {
  const frame = box(1.25, 0.9, 0.05, clay(0xd9b382), [0, 0, 0]);
  const cork = box(1.15, 0.8, 0.02, clay(0xb08a62), [0, 0, 0.03]);

  const notes = [
    [-0.33, 0.2, 0xf7e07a, 0.1],
    [0.05, 0.22, 0x9cc9ec, -0.08],
    [0.35, -0.05, 0xfdfbf7, 0.06],
    [-0.15, -0.22, 0xf7e07a, -0.12],
  ].map(([x, y, color, tilt]) => {
    const note = box(0.22, 0.22, 0.008, clay(color), [x, y, 0.045], [0, 0, tilt]);
    const pin = sphere(0.016, clay(0xe05a5a), [x, y + 0.09, 0.06], 12);
    const text = [0, 1, 2].map((i) =>
      box(0.12 - i * 0.03, 0.008, 0.002, clay(0x9a8f80), [x - 0.015 + i * 0.015, y + 0.03 - i * 0.04, 0.05], [0, 0, tilt])
    );
    return group([note, pin, ...text]);
  });

  return group([frame, cork, ...notes], [DESK.x + 0.25, 1.95, WALL_Z]);
}

function createShelf() {
  const plank = box(0.9, 0.05, 0.24, clay(0xc99a66), [0, 0, 0]);
  const bracketMaterial = clay(0xb58a5c);
  const brackets = [-0.3, 0.3].map((x) => box(0.04, 0.12, 0.2, bracketMaterial, [x, -0.085, -0.01]));

  const books = [
    [0xf0a04b, 0.34, 0.07],
    [0x6c9bd2, 0.3, 0.06],
    [0x7bbf9e, 0.36, 0.08],
    [0xe06b6b, 0.28, 0.05],
  ];
  let x = -0.38;
  const bookMeshes = books.map(([color, h, w]) => {
    const book = box(w, h, 0.2, clay(color), [x + w / 2, h / 2 + 0.025, 0]);
    x += w + 0.01;
    return book;
  });

  const pot = cylinder(0.07, 0.055, 0.12, clay(0xfbf8f3), [0.3, 0.085, 0]);
  const leaves = [0, 1, 2].map((i) => {
    const leaf = sphere(0.055, clay(i % 2 ? 0x6db37a : 0x4f9a5f), [0.3 + (i - 1) * 0.04, 0.18 + (i % 2) * 0.03, (i - 1) * 0.02], 12);
    leaf.scale.set(1, 1.3, 0.8);
    return leaf;
  });

  return group([plank, ...brackets, ...bookMeshes, pot, ...leaves], [DESK.x - 1.05, 1.9, WALL_Z]);
}

function createMug() {
  const material = clay(0xf28c28);
  const body = cylinder(0.065, 0.058, 0.13, material, [0, 0.065, 0]);
  const coffee = cylinder(0.055, 0.055, 0.01, clay(0x4a3326), [0, 0.128, 0]);
  const handle = mesh(new THREE.TorusGeometry(0.04, 0.012, 10, 20, Math.PI), material, [0.065, 0.065, 0], [0, 0, -Math.PI / 2]);
  return group([body, coffee, handle], [DESK.x + 0.95, DESK.y + 0.04, DESK.z + 0.25], [0, -0.4, 0]);
}

function createPhone() {
  const body = box(0.12, 0.24, 0.016, clay(0x2b2e3a), [0, 0.12, 0]);
  const screen = box(0.105, 0.22, 0.004, clay(0x9cc9ec, { emissive: 0x9cc9ec, emissiveIntensity: 0.25 }), [0, 0.12, 0.009]);
  const icons = [0xf28c28, 0x7bbf9e, 0xe06b6b, 0xf7e07a].map((color, i) =>
    box(0.028, 0.028, 0.003, clay(color), [-0.03 + (i % 2) * 0.06, 0.19 - Math.floor(i / 2) * 0.05, 0.012])
  );
  const stand = box(0.08, 0.1, 0.02, clay(0x3a3d4a), [0, 0.05, -0.03], [-0.5, 0, 0]);
  const phone = group([body, screen, ...icons, stand]);
  phone.rotation.x = -0.25;
  return group([phone], [DESK.x - 0.78, DESK.y + 0.04, DESK.z + 0.22], [0, 0.35, 0]);
}

const PROPS = {
  projects: createMonitors,
  experience: createPinboard,
  skills: createShelf,
  about: createMug,
  contact: createPhone,
};

// Reusable: turns any group into a section-aware interactive object.
export function createInteractiveObject(section, object) {
  object.name = `section-${section}`;

  const materials = [];
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.userData.target = object;
    const list = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of list) {
      materials.push({ material, baseEmissive: material.emissive.clone(), baseIntensity: material.emissiveIntensity });
    }
  });

  object.userData = {
    section,
    hovered: false,
    selected: false,
    highlight: 0,
    basePosition: object.position.clone(),
    baseScale: object.scale.x,
    materials,
  };
  return object;
}

export function createPortfolioObjects(scene, props = PROPS) {
  const objects = Object.entries(props).map(([section, create]) =>
    createInteractiveObject(section, create())
  );
  scene.add(...objects);
  return objects;
}

export function updatePortfolioObjects(objects, delta) {
  for (const object of objects) {
    const data = object.userData;
    const target = data.hovered ? 1 : data.selected ? 0.55 : 0;
    data.highlight = THREE.MathUtils.damp(data.highlight, target, 10, delta);

    object.scale.setScalar(data.baseScale * (1 + data.highlight * 0.06));
    object.position.y = data.basePosition.y + data.highlight * 0.025;

    // A gentle warm glow; subtle enough that dark screens stay dark.
    for (const { material, baseEmissive, baseIntensity } of data.materials) {
      material.emissive.copy(baseEmissive).lerp(HIGHLIGHT_COLOR, data.highlight * 0.2);
      material.emissiveIntensity = THREE.MathUtils.lerp(baseIntensity, Math.max(baseIntensity, 0.18), data.highlight);
    }
  }
}
