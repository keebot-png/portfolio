// Single source of truth for all portfolio content.
// Everything below is placeholder content: replace it with your own details.

export const portfolio = {
  about: {
    name: 'Alex Morgan',
    title: 'Full-Stack Software Developer',
    description:
      'I am a full-stack developer who enjoys building practical software: ' +
      'business systems, web applications, ecommerce platforms and the APIs ' +
      'that connect them. I like turning messy requirements into clean, ' +
      'maintainable systems that are fast, accessible and easy to use.',
    // Short list of the kinds of work you focus on, shown as tags.
    focus: ['Web applications', 'Business systems', 'Ecommerce', 'APIs & integrations'],
  },

  experience: [
    {
      company: 'Brightline Software',
      role: 'Software Developer',
      period: '2023 — Present',
      description:
        'Develop and maintain a customer-facing booking platform used by ' +
        'over 40,000 monthly users. Led the migration of legacy jQuery pages ' +
        'to modular JavaScript, reducing page load times by around 35%.',
      technologies: ['JavaScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    },
    {
      company: 'Northwind Digital',
      role: 'Junior Web Developer',
      period: '2021 — 2023',
      description:
        'Built responsive marketing sites and internal dashboards for agency ' +
        'clients. Introduced automated testing and CI pipelines to the team.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'GitHub Actions'],
    },
    {
      company: 'Freelance',
      role: 'Web Developer',
      period: '2019 — 2021',
      description:
        'Designed and developed websites and small web apps for local ' +
        'businesses, from first brief through to deployment and support.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
    },
  ],

  skills: {
    frontend: ['HTML5', 'CSS3', 'JavaScript (ES2023)', 'Three.js', 'Vite', 'Accessibility (WCAG)'],
    backend: ['Node.js', 'Express', 'REST APIs', 'Python', 'Authentication & OAuth'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    infrastructure: ['Docker', 'AWS (EC2, S3, Lambda)', 'Linux', 'Nginx', 'GitHub Actions', 'CI/CD'],
  },

  projects: [
    {
      name: '3D Developer Portfolio',
      description:
        'An interactive portfolio built with vanilla JavaScript and Three.js, ' +
        'featuring a 3D avatar and a data-driven content system.',
      technologies: ['JavaScript', 'Three.js', 'Vite'],
      url: 'https://example.com',
      github: 'https://github.com/your-username/portfolio',
    },
    {
      name: 'TaskFlow',
      description:
        'A collaborative task board with real-time updates, drag-and-drop ' +
        'ordering and role-based access for small teams.',
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'WebSockets'],
      url: 'https://example.com/taskflow',
      github: 'https://github.com/your-username/taskflow',
    },
    {
      name: 'Weather Insights API',
      description:
        'A REST API that aggregates forecasts from multiple providers, with ' +
        'caching, rate limiting and OpenAPI documentation.',
      technologies: ['Python', 'FastAPI', 'Redis', 'Docker'],
      url: '',
      github: 'https://github.com/your-username/weather-insights-api',
    },
    {
      name: 'Budget Tracker',
      description:
        'An offline-first progressive web app for tracking personal spending, ' +
        'with charts and CSV export.',
      technologies: ['JavaScript', 'IndexedDB', 'Service Workers', 'Chart.js'],
      url: 'https://example.com/budget',
      github: 'https://github.com/your-username/budget-tracker',
    },
  ],

  contact: {
    email: 'hello@example.com',
    github: 'https://github.com/your-username',
    linkedin: 'https://www.linkedin.com/in/your-username',
    location: 'Cape Town, South Africa',
  },
};
