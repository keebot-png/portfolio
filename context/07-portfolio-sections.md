# Build Step 7 — Populate Portfolio Sections

Continue from the existing application.

Use the centralized:

```text
src/data/portfolio.js
```

Do NOT duplicate portfolio data inside UI files.

## Experience

Render experience dynamically.

Each experience item should show:

* company
* position
* dates
* description
* technologies

Use a clean timeline/card layout.

## Skills

Render skills dynamically from the portfolio data.

Organize them into:

* Frontend
* Backend
* Databases
* Infrastructure

Do not use percentage ratings.

Use technology tags or simple lists.

## Projects

Render project cards dynamically.

Each project should show:

* project name
* description
* technologies
* project link
* GitHub link where available

Links should open correctly.

## About

Create a concise developer introduction.

The About section should communicate that the developer is a full-stack developer interested in building practical software, business systems, web applications, ecommerce systems and APIs.

Keep the writing concise.

## Contact

Display:

* email
* GitHub
* LinkedIn
* location

Use clickable links where appropriate.

## Important

All content must come from:

```text
src/data/portfolio.js
```

Do not hard-code portfolio information inside the rendering functions.

Create reusable rendering functions where appropriate.
