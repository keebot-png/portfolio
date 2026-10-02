# 3D Developer Portfolio

A personal 3D developer portfolio built with vanilla JavaScript, Three.js and Vite.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production into `dist/`
- `npm run preview` — preview the production build

## Structure

- `public/` — static assets (models, textures, images) served as-is
- `src/main.js` — application entry point
- `src/three/` — Three.js scene, camera, renderer, lighting, objects, interaction and animation
- `src/ui/` — DOM-based UI (navigation, panels, modal)
- `src/data/portfolio.js` — portfolio content
- `src/styles/main.css` — global styles
