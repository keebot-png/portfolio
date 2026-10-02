import { el } from './dom.js';

export function createModal(root) {
  const title = el('h2', { id: 'modal-title', class: 'modal-title' });
  const body = el('div', { class: 'modal-body' });

  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': 'modal-title' }, [
    el('div', { class: 'modal-inner' }, [
      el('header', { class: 'modal-header' }, [
        title,
        el('button', {
          type: 'button',
          class: 'panel-close',
          'aria-label': 'Close dialog',
          onclick: () => dialog.close(),
        }, [el('span', { 'aria-hidden': 'true', text: '×' })]),
      ]),
      body,
    ]),
  ]);

  // Clicks on the backdrop land on the <dialog> element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  root.append(dialog);

  return {
    open({ title: heading, content }) {
      title.textContent = heading;
      body.replaceChildren(content);
      dialog.showModal();
    },
    close() {
      dialog.close();
    },
    get isOpen() {
      return dialog.open;
    },
  };
}
