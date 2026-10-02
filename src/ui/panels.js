import { el } from './dom.js';
import { NARROW_UI_QUERY } from '../three/viewport.js';

const NARROW_QUERY = window.matchMedia(NARROW_UI_QUERY);
const CLOSE_DELAY = 200;

export function createPanels({ root, sections, renderers, onClose }) {
  const container = el('div', { class: 'panels' });
  const panels = new Map();
  let active = null;
  let hideTimer = null;

  for (const { id, label } of sections) {
    const titleId = `panel-${id}-title`;
    const title = el('h2', { id: titleId, class: 'panel-title', tabindex: '-1', text: label });

    const panel = el('section', {
      id: `panel-${id}`,
      class: 'panel',
      'aria-labelledby': titleId,
      hidden: true,
    }, [
      el('header', { class: 'panel-header' }, [
        title,
        el('button', {
          type: 'button',
          class: 'panel-close',
          'aria-label': 'Close and return to overview',
          onclick: onClose,
        }, [el('span', { 'aria-hidden': 'true', text: '×' })]),
      ]),
      el('div', { class: 'panel-body' }, [renderers[id]?.()]),
      el('footer', { class: 'panel-footer' }, [
        el('button', { type: 'button', class: 'panel-back', onclick: onClose, text: '← Back to overview' }),
      ]),
    ]);

    panels.set(id, { panel, title });
    container.append(panel);
  }

  root.append(container);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !active || event.target.closest?.('dialog')) return;
    onClose();
  });

  function hide(id, immediate) {
    const entry = panels.get(id);
    if (!entry) return;
    entry.panel.classList.remove('is-open');
    if (immediate) entry.panel.hidden = true;
    else hideTimer = setTimeout(() => (entry.panel.hidden = true), CLOSE_DELAY);
  }

  return {
    open(id) {
      const entry = panels.get(id);
      if (!entry || id === active) return;
      clearTimeout(hideTimer);
      if (active) hide(active, true);

      active = id;
      container.classList.add('has-open');
      entry.panel.hidden = false;
      entry.panel.scrollTop = 0;
      requestAnimationFrame(() => entry.panel.classList.add('is-open'));
      entry.title.focus({ preventScroll: true });
    },

    // Returns true if keyboard focus was inside the panel being closed.
    close() {
      if (!active) return false;
      const hadFocus = panels.get(active).panel.contains(document.activeElement);
      hide(active, false);
      active = null;
      container.classList.remove('has-open');
      return hadFocus;
    },

    get active() {
      return active;
    },

    // Screen space covered by the open panel (plus anything below/right of it,
    // such as the mobile navigation bar), used to keep the 3D scene visible.
    getOcclusion() {
      if (!active) return { right: 0, bottom: 0 };
      const rect = panels.get(active).panel.getBoundingClientRect();
      return NARROW_QUERY.matches
        ? { right: 0, bottom: window.innerHeight - rect.top }
        : { right: window.innerWidth - rect.left, bottom: 0 };
    },
  };
}
