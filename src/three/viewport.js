// Describes the current screen so the 3D side can pick a layout and quality
// tier. The HTML UI uses the same `NARROW_UI_QUERY` as a CSS media query.

const COARSE_POINTER = window.matchMedia('(pointer: coarse)');
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

// Phones (any orientation), tablet portrait, and short landscape windows.
// Keep in sync with the matching `@media` block in styles/main.css.
export const NARROW_UI_QUERY = '(max-width: 900px), (max-height: 560px)';

export function getViewport() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  const coarse = COARSE_POINTER.matches;
  // Phones and small tablets: fewer pixels, smaller shadow map, simpler scene.
  const small = Math.min(width, height) < 600 || (coarse && width < 1024);

  return {
    width,
    height,
    aspect,
    coarse,
    small,
    // Portrait screens get the compact scene layout (avatar closer to the desk, decor hidden).
    compact: aspect < 1,
    pixelRatio: Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2),
    shadowMapSize: small ? 1024 : 2048,
    reducedMotion: REDUCED_MOTION.matches,
  };
}

// Camera framing and avatar placement for wide (landscape) and compact
// (portrait) screens. `minHalfWidth` is the horizontal half-extent, in world
// units at the camera target, that must stay visible in the overview.
export const SCENE_LAYOUTS = {
  wide: {
    name: 'wide',
    avatar: { x: -0.75, z: 0.15 },
    cameraTarget: [0.45, 1.05, -0.5],
    focusCenterX: 0.15,
    minHalfWidth: 2.95,
    focusPullback: 1.18,
    decor: true,
  },
  compact: {
    name: 'compact',
    avatar: { x: -0.5, z: 0.3 },
    cameraTarget: [0.65, 1.0, -0.5],
    focusCenterX: 0.65,
    minHalfWidth: 2.0,
    // The sheet leaves a short band above it; pull back further so the whole scene fits.
    focusPullback: 1.3,
    decor: false,
  },
};

export function layoutFor(viewport) {
  return viewport.compact ? SCENE_LAYOUTS.compact : SCENE_LAYOUTS.wide;
}
