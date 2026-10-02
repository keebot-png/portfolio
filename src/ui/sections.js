import { el } from './dom.js';

// Shared building blocks

function externalLink(href, text, className) {
  return el('a', { href, class: className, target: '_blank', rel: 'noopener noreferrer', text });
}

function stripProtocol(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function renderTags(items, label) {
  if (!items?.length) return null;
  return el('ul', { class: 'tag-list', 'aria-label': label }, items.map((item) => el('li', { class: 'tag', text: item })));
}

function renderLinks(links) {
  const nodes = links.filter(({ href }) => href).map(({ href, text }) => externalLink(href, text, 'link-arrow'));
  return nodes.length ? el('p', { class: 'link-row' }, nodes) : null;
}

// Sections

function renderAbout({ about }) {
  return el('div', { class: 'section-about' }, [
    el('p', { class: 'lead', text: about.title }),
    el('p', { text: about.description }),
    renderTags(about.focus, 'Areas of focus'),
  ]);
}

function renderExperience({ experience }) {
  return el('ol', { class: 'timeline' }, experience.map((job) =>
    el('li', { class: 'timeline-item' }, [
      el('p', { class: 'timeline-period', text: job.period }),
      el('h3', { class: 'item-title', text: job.role }),
      el('p', { class: 'item-meta', text: job.company }),
      el('p', { class: 'item-text', text: job.description }),
      renderTags(job.technologies, `Technologies used at ${job.company}`),
    ])
  ));
}

function renderSkills({ skills }) {
  return el('div', { class: 'skill-groups' }, Object.entries(skills).map(([category, items]) =>
    el('section', { class: 'skill-group' }, [
      el('h3', { class: 'item-title', text: capitalize(category) }),
      renderTags(items, `${capitalize(category)} skills`),
    ])
  ));
}

function renderProjects({ projects }) {
  return el('ul', { class: 'card-list' }, projects.map((project) =>
    el('li', { class: 'card' }, [
      el('h3', { class: 'item-title', text: project.name }),
      el('p', { class: 'item-text', text: project.description }),
      renderTags(project.technologies, `Technologies used in ${project.name}`),
      renderLinks([
        { href: project.url, text: 'Live project' },
        { href: project.github, text: 'GitHub' },
      ]),
    ])
  ));
}

function renderContact({ contact }) {
  const rows = [
    { label: 'Email', value: contact.email, href: contact.email && `mailto:${contact.email}` },
    { label: 'GitHub', value: contact.github && stripProtocol(contact.github), href: contact.github },
    { label: 'LinkedIn', value: contact.linkedin && stripProtocol(contact.linkedin), href: contact.linkedin },
    { label: 'Location', value: contact.location },
  ].filter(({ value }) => value);

  return el('dl', { class: 'contact-list' }, rows.map(({ label, value, href }) =>
    el('div', { class: 'contact-row' }, [
      el('dt', { class: 'item-meta', text: label }),
      el('dd', {}, [
        href
          ? href.startsWith('mailto:')
            ? el('a', { href, text: value })
            : externalLink(href, value)
          : el('span', { text: value }),
      ]),
    ])
  ));
}

export function createSectionRenderers(portfolio) {
  return {
    about: () => renderAbout(portfolio),
    experience: () => renderExperience(portfolio),
    skills: () => renderSkills(portfolio),
    projects: () => renderProjects(portfolio),
    contact: () => renderContact(portfolio),
  };
}
