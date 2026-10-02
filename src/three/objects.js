import * as THREE from 'three';

const ACCENT_COLOR = 0x4f8cff;
const SIZE = 0.2;

const SHAPES = {
  icosahedron: () => new THREE.IcosahedronGeometry(SIZE, 0),
  octahedron: () => new THREE.OctahedronGeometry(SIZE * 1.1, 0),
  box: () => new THREE.BoxGeometry(SIZE * 1.4, SIZE * 1.4, SIZE * 1.4),
  dodecahedron: () => new THREE.DodecahedronGeometry(SIZE, 0),
  torus: () => new THREE.TorusGeometry(SIZE * 0.8, SIZE * 0.25, 16, 48),
};

// Curved shapes need a higher angle so only their silhouette edges are drawn.
const EDGE_THRESHOLDS = { torus: 60 };

// Arranged in an arc around the avatar, which stands at the origin.
const SECTION_LAYOUT = [
  { section: 'experience', shape: 'octahedron', position: [0, 2.35, -1.6] },
  { section: 'skills', shape: 'box', position: [-1.7, 1.55, -0.6] },
  { section: 'projects', shape: 'dodecahedron', position: [1.7, 1.55, -0.6] },
  { section: 'about', shape: 'icosahedron', position: [-1.25, 0.65, 0.9] },
  { section: 'contact', shape: 'torus', position: [1.25, 0.65, 0.9] },
];

export function createInteractiveObject({
  section,
  geometry,
  position,
  color = ACCENT_COLOR,
  edgeThreshold = 15,
}) {
  const core = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0x1c212b,
      roughness: 0.35,
      metalness: 0.5,
      emissive: color,
      emissiveIntensity: 0.08,
    })
  );
  core.castShadow = true;

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, edgeThreshold),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 })
  );

  const object = new THREE.Group();
  object.name = `section-${section}`;
  object.position.copy(position);
  object.add(core, edges);
  object.userData = {
    section,
    hovered: false,
    selected: false,
    highlight: 0,
    basePosition: position.clone(),
    phase: Math.random() * Math.PI * 2,
    parts: { core, edges },
  };
  core.userData.target = object;

  return object;
}

export function createPortfolioObjects(scene, layout = SECTION_LAYOUT) {
  const objects = layout.map(({ section, shape, position }) =>
    createInteractiveObject({
      section,
      geometry: SHAPES[shape](),
      position: new THREE.Vector3(...position),
      edgeThreshold: EDGE_THRESHOLDS[shape],
    })
  );
  scene.add(...objects);
  return objects;
}

export function updatePortfolioObjects(objects, delta, elapsed) {
  for (const object of objects) {
    const data = object.userData;
    const target = data.hovered ? 1 : data.selected ? 0.6 : 0;
    data.highlight = THREE.MathUtils.damp(data.highlight, target, 8, delta);

    object.position.y = data.basePosition.y + Math.sin(elapsed * 0.8 + data.phase) * 0.04;
    object.rotation.y += delta * 0.25;
    object.scale.setScalar(1 + data.highlight * 0.12);

    data.parts.core.material.emissiveIntensity = 0.08 + data.highlight * 0.5;
    data.parts.edges.material.opacity = 0.45 + data.highlight * 0.5;
  }
}
