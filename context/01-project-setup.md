# Build Step 1 — Project Setup

Create the initial project for a personal 3D developer portfolio.

## Technology

Use:

* Vanilla JavaScript
* HTML5
* CSS3
* Three.js
* Vite
* npm

Do NOT use:

* React
* Next.js
* Vue
* Angular
* Svelte
* TypeScript
* Tailwind
* Bootstrap
* GSAP
* React Three Fiber

## Three.js requirement

Three.js must be installed through npm.

Run:

```bash
npm install three
```

Do NOT use a CDN.

Use ES modules:

```js
import * as THREE from 'three';
```

## Project structure

Create:

```text
portfolio/
├── public/
│   ├── models/
│   ├── textures/
│   └── images/
│
├── src/
│   ├── main.js
│   │
│   ├── data/
│   │   └── portfolio.js
│   │
│   ├── three/
│   │   ├── scene.js
│   │   ├── camera.js
│   │   ├── renderer.js
│   │   ├── lighting.js
│   │   ├── avatar.js
│   │   ├── objects.js
│   │   ├── interaction.js
│   │   └── animation.js
│   │
│   ├── ui/
│   │   ├── navigation.js
│   │   ├── panels.js
│   │   └── modal.js
│   │
│   └── styles/
│       └── main.css
│
├── index.html
├── package.json
└── README.md
```

## Requirements

Create a minimal working Vite application.

The application must:

* start with `npm run dev`
* have a working `index.html`
* load `src/main.js`
* successfully import Three.js
* render a basic Three.js canvas
* have no console errors

Do not build the portfolio yet.

This step is ONLY responsible for establishing the project foundation.

At the end, explain:

1. What files were created.
2. What each file is responsible for.
3. How to run the project.
4. How Three.js is installed and imported.
