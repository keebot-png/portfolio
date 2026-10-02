// The loader markup lives in index.html so it is visible while the JS bundle
// downloads. This module only hides it once the scene (or the fallback) is ready.

export function hideLoader() {
  const node = document.getElementById('loader');
  if (!node || node.hidden) return;

  node.setAttribute('aria-busy', 'false');
  node.setAttribute('aria-hidden', 'true');
  node.classList.add('is-done');

  const finish = () => {
    node.hidden = true;
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }

  node.addEventListener('transitionend', finish, { once: true });
  // In case the opacity transition never fires (already hidden, or no CSS).
  window.setTimeout(finish, 400);
}
