import * as THREE from 'three';

export function createInteraction({ camera, domElement, objects, onSelect }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const targets = objects.map((object) => object.userData.parts.core);

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
    const [hit] = raycaster.intersectObjects(targets, false);
    return hit?.object.userData.target ?? null;
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

  function onClick(event) {
    setPointer(event);
    select(pick());
  }

  domElement.addEventListener('pointermove', onPointerMove);
  domElement.addEventListener('pointerleave', onPointerLeave);
  domElement.addEventListener('click', onClick);

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
      domElement.removeEventListener('click', onClick);
      setHovered(null);
    },
  };
}
