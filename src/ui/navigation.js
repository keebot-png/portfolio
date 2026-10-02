import { el } from './dom.js';

export function createNavigation({ root, about, sections, onSelect, onHome }) {
  const buttons = new Map();

  const list = el(
    'ul',
    { class: 'nav-list' },
    sections.map(({ id, label }) => {
      const button = el('button', {
        type: 'button',
        class: 'nav-link',
        'aria-controls': `panel-${id}`,
        'aria-expanded': 'false',
        onclick: () => onSelect(id),
        text: label,
      });
      buttons.set(id, button);
      return el('li', {}, [button]);
    })
  );

  const header = el('header', { class: 'site-header' }, [
    el('button', {
      type: 'button',
      class: 'brand',
      'aria-label': `${about.name}, back to overview`,
      onclick: onHome,
    }, [
      el('span', { class: 'brand-name', text: about.name }),
      el('span', { class: 'brand-title', text: about.title }),
    ]),
    el('nav', { class: 'site-nav', 'aria-label': 'Portfolio sections' }, [list]),
  ]);

  root.append(header);

  return {
    setActive(activeId) {
      for (const [id, button] of buttons) {
        button.setAttribute('aria-expanded', String(id === activeId));
      }
      // On phones the list scrolls horizontally; keep the active item in view.
      buttons.get(activeId)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    },
    focus(id) {
      buttons.get(id)?.focus();
    },
    // Height of the header band at the top of the screen (brand on phones,
    // brand + nav on larger screens), used to keep the 3D scene clear of it.
    getHeaderBottom() {
      return header.getBoundingClientRect().bottom;
    },
  };
}
