import { el } from './dom.js';
import { createSectionRenderers } from './sections.js';

// Full HTML portfolio used when WebGL cannot start. Same content as the
// panels, laid out as a readable document so nothing depends on the canvas.

export function startFallback({ root, portfolio, sections }) {
  document.documentElement.classList.add('is-fallback');
  document.getElementById('app')?.setAttribute('hidden', '');

  const renderers = createSectionRenderers(portfolio);

  const main = el('main', { class: 'fallback', id: 'content' }, [
    el('p', {
      class: 'fallback-note',
      text: 'The 3D studio could not start on this device. The portfolio is below.',
    }),
    ...sections.map(({ id, label }) =>
      el('section', { id: `panel-${id}`, class: 'fallback-section' }, [
        el('h2', { class: 'fallback-title', text: label }),
        renderers[id]?.(),
      ])
    ),
  ]);

  root.append(main);
}

function scrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export function scrollToSection(id) {
  document.getElementById(`panel-${id}`)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
}
