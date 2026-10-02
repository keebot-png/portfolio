import { defineConfig } from 'vite';

// GitHub Pages serves this repo at /portfolio/. Local dev and preview stay at /.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/portfolio/' : '/',
});
