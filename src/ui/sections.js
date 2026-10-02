import { el } from './dom.js';

function externalLink(href, text) {
  return el('a', { href, target: '_blank', rel: 'noopener noreferrer', text });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function renderAbout({ about }) {
  return el('div', { class: 'section-about' }, [
    el('p', { class: 'lead', text: about.title }),
    el('p', { text: about.description }),
  ]);
}

function renderExperience({ experience }) {
  return el('ol', { class: 'item-list' }, experience.map((job) =>
    el('li', { class: 'item' }, [
      el('h3', { class: 'item-title', text: job.role }),
      el('p', { class: 'item-meta', text: `${job.company} · ${job.period}` }),
      el('p', { text: job.description }),
    ])
  ));
}

function renderSkills({ skills }) {
  return el('div', { class: 'skill-groups' }, Object.entries(skills).map(([category, items]) =>
    el('section', { class: 'skill-group' }, [
      el('h3', { class: 'item-title', text: capitalize(category) }),
      el('ul', { class: 'inline-list' }, items.map((skill) => el('li', { text: skill }))),
    ])
  ));
}

function renderProjectDetails(project) {
  return el('div', {}, [
    el('p', { text: project.description }),
    el('ul', { class: 'inline-list' }, project.technologies.map((tech) => el('li', { text: tech }))),
    el('p', { class: 'link-row' }, [
      project.url && externalLink(project.url, 'Live project'),
      project.github && externalLink(project.github, 'Source on GitHub'),
    ]),
  ]);
}

function renderProjects({ projects }, { modal }) {
  return el('ul', { class: 'item-list' }, projects.map((project) =>
    el('li', { class: 'item' }, [
      el('h3', { class: 'item-title', text: project.name }),
      el('p', { text: project.description }),
      el('button', {
        type: 'button',
        class: 'text-button',
        onclick: () => modal.open({ title: project.name, content: renderProjectDetails(project) }),
        text: 'View details',
      }),
    ])
  ));
}

function renderContact({ contact }) {
  return el('ul', { class: 'contact-list' }, [
    contact.email && el('li', {}, [
      el('span', { class: 'item-meta', text: 'Email' }),
      el('a', { href: `mailto:${contact.email}`, text: contact.email }),
    ]),
    contact.github && el('li', {}, [
      el('span', { class: 'item-meta', text: 'GitHub' }),
      externalLink(contact.github, contact.github.replace(/^https?:\/\/(www\.)?/, '')),
    ]),
    contact.linkedin && el('li', {}, [
      el('span', { class: 'item-meta', text: 'LinkedIn' }),
      externalLink(contact.linkedin, contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')),
    ]),
    contact.location && el('li', {}, [
      el('span', { class: 'item-meta', text: 'Location' }),
      el('span', { text: contact.location }),
    ]),
  ]);
}

export function createSectionRenderers(portfolio, context) {
  return {
    about: () => renderAbout(portfolio),
    experience: () => renderExperience(portfolio),
    skills: () => renderSkills(portfolio),
    projects: () => renderProjects(portfolio, context),
    contact: () => renderContact(portfolio),
  };
}
