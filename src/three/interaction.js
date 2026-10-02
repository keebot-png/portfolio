import * as THREE from 'three';

const TAP_SLOP = 12; // px
const TAP_TIME = 600; // ms

export function createInteraction({ camera, domElement, objects, onSelect }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  // Walk up from the hit mesh to the interactive group that owns it.
  function ownerOf(mesh) {
    let node = mesh;
    while (node && !node.userData.section) node = node.parent;
    return node ?? null;
  }

  let pointerActive = false;
  let hovered = null;
  let selected = null;

  function setPointer(event) {
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    const [hit] = raycaster.intersectObjects(objects, true);
    return hit ? ownerOf(hit.object) : null;
  }

  function setHovered(object) {
    if (object === hovered) return;
    if (hovered) hovered.userData.hovered = false;
    hovered = object;
    if (hovered) hovered.userData.hovered = true;
    domElement.style.cursor = hovered ? 'pointer' : '';
  }

  function select(object) {
    if (!object) return;
    if (selected) selected.userData.selected = false;
    selected = object;
    selected.userData.selected = true;
    onSelect?.(selected.userData.section, selected);
  }

  function clearSelection() {
    if (selected) selected.userData.selected = false;
    selected = null;
  }

  // Touch has no hover state, so only mouse/pen pointers drive highlighting.
  function onPointerMove(event) {
    pointerActive = event.pointerType !== 'touch';
    setPointer(event);
  }

  function onPointerLeave() {
    pointerActive = false;
    setHovered(null);
  }

  // Select on tap/click, but not when the pointer dragged (e.g. a touch that
  // was really a swipe) or was held for a long time.
  const press = { x: 0, y: 0, time: 0, id: null };

  function onPointerDown(event) {
    if (!event.isPrimary) return;
    press.id = event.pointerId;
    press.x = event.clientX;
    press.y = event.clientY;
    press.time = performance.now();
  }

  function onPointerUp(event) {
    if (event.pointerId !== press.id) return;
    press.id = null;
    const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
    const held = performance.now() - press.time;
    if (moved > TAP_SLOP || held > TAP_TIME) return;
    setPointer(event);
    select(pick());
  }

  function onPointerCancel() {
    press.id = null;
  }

  domElement.addEventListener('pointermove', onPointerMove);
  domElement.addEventListener('pointerleave', onPointerLeave);
  domElement.addEventListener('pointerdown', onPointerDown);
  domElement.addEventListener('pointerup', onPointerUp);
  domElement.addEventListener('pointercancel', onPointerCancel);

  return {
    // Raycast every frame so hover stays correct while objects move.
    update() {
      if (pointerActive) setHovered(pick());
    },
    // Marks a section as selected without calling onSelect (for UI-driven selection).
    setSelected(section) {
      if (selected) selected.userData.selected = false;
      selected = objects.find((object) => object.userData.section === section) ?? null;
      if (selected) selected.userData.selected = true;
    },
    clearSelection,
    get selected() {
      return selected?.userData.section ?? null;
    },
    dispose() {
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerleave', onPointerLeave);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('pointercancel', onPointerCancel);
      setHovered(null);
    },
  };
}
