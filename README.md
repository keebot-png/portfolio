# 3D Developer Portfolio

A personal portfolio you walk into: a warm 3D studio, a friendly avatar, and the work itself sitting on the desk. Built with vanilla JavaScript, HTML, CSS, Three.js (npm) and Vite. No React, Vue, TypeScript, Tailwind or GSAP.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Production build

```bash
npm run build
```

Preview the build with `npm run preview`.

## Avatar replacement

The studio ships with a built-in character (t-shirt, shorts, cap, idle breathing and an occasional wave).

To use your own model:

1. Put a GLB file at:

```text
public/models/avatar.glb
```

2. In `src/three/avatar.js`, set:

```js
export const AVATAR_URL = '/models/avatar.glb';
```

The loader looks for an animation clip whose name matches `/idle/i`. If the file is missing, fails to load, or has no idle clip, the built-in character is used instead. Optional `materialColors` in the same file can recolour named materials on a loaded model.

## Portfolio editing

All copy — name, about text, jobs, skills, projects and contact — lives in one file:

```text
src/data/portfolio.js
```

Replace the placeholder `Alex Morgan` details with your own. Section order and labels are in `src/data/sections.js`. After you change the name or title, the document title and the brand in the header update from that data.

Project `url` and `github` fields become links. Leave `url` as an empty string to hide the live-project link. Contact `email`, `github` and `linkedin` become mailto / external links.

## Architecture

```text
src/
├── main.js                 # wires the scene, UI, loader and WebGL fallback
├── data/
│   ├── portfolio.js        # all portfolio content
│   └── sections.js         # section ids and labels
├── three/
│   ├── scene.js            # scene and background
│   ├── camera.js           # camera and eased focus / reset
│   ├── renderer.js         # WebGL renderer and capability check
│   ├── lighting.js         # lights and shadow map
│   ├── environment.js      # desk, chair, rug, plants
│   ├── avatar.js           # GLB load or built-in character
│   ├── character.js        # procedural avatar
│   ├── objects.js          # interactive props (one per section)
│   ├── interaction.js      # hover, click and tap
│   ├── animation.js        # render loop
│   ├── viewport.js         # breakpoints and quality tier
│   └── primitives.js       # shared clay materials and meshes
├── ui/
│   ├── navigation.js       # header and section nav
│   ├── panels.js           # section panels / mobile sheet
│   ├── sections.js         # HTML for each section
│   ├── loader.js           # hides the HTML loading overlay
│   ├── fallback.js         # HTML portfolio if WebGL fails
│   ├── modal.js            # reusable dialog
│   └── dom.js              # small element helper
└── styles/
    └── main.css            # layout, theme and responsive chrome
```

- `public/` — static files served as-is (`models/`, `textures/`, `images/`).
- `index.html` — page shell, loading screen and noscript note.
- `src/main.js` — starts the 3D experience, or the HTML fallback if WebGL is unavailable.

The 3D layer never owns portfolio copy. The UI reads `portfolio.js`; clicking a prop or a nav item opens the same HTML panel.
