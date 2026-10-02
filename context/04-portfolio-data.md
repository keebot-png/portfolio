# Build Step 4 — Create the Portfolio Data System

Continue from the existing project.

Do not add complex UI yet.

## Goal

Create one centralized data source containing all portfolio information.

Create:

```text
src/data/portfolio.js
```

Use a structure similar to:

```js
export const portfolio = {
    about: {
        name: "...",
        title: "...",
        description: "..."
    },

    experience: [],

    skills: {
        frontend: [],
        backend: [],
        databases: [],
        infrastructure: []
    },

    projects: [],

    contact: {
        email: "",
        github: "",
        linkedin: "",
        location: ""
    }
};
```

## Important requirement

Portfolio information must NOT be hard-coded throughout the Three.js code.

The developer should be able to change:

* name
* title
* description
* experience
* skills
* projects
* contact information

from this single file.

## Experience

Each experience item should support:

```js
{
    company: "",
    role: "",
    period: "",
    description: "",
    technologies: []
}
```

## Projects

Each project should support:

```js
{
    name: "",
    description: "",
    technologies: [],
    url: "",
    github: ""
}
```

## Skills

Organize skills into categories.

Do not use arbitrary skill percentages.

Do not create fake proficiency scores.

## Requirement

Create realistic placeholder portfolio content so the application can be tested.

Make the content easy to replace.

Do not build the visual UI yet.

The only goal of this step is creating the portfolio data layer.
