# Build Step 6 — HTML/CSS Portfolio UI

Continue from the existing Three.js portfolio.

## Goal

Add the HTML/CSS interface that displays readable portfolio information.

Three.js should NOT be used for large amounts of text.

Use normal HTML/CSS overlays.

## Navigation

Create a minimal navigation:

```text
ABOUT
EXPERIENCE
SKILLS
PROJECTS
CONTACT
```

The navigation should remain accessible while exploring the scene.

## Panels

Create reusable HTML panels for:

* About
* Experience
* Skills
* Projects
* Contact

Panels should be hidden by default.

When the user selects a 3D object, show the corresponding panel.

## Visual style

Use:

* dark backgrounds
* subtle transparency
* borders
* backdrop blur where appropriate
* clean typography
* generous spacing

Avoid:

* excessive gradients
* excessive neon
* huge typography
* excessive animations

## Architecture

Use:

```text
src/ui/navigation.js
src/ui/panels.js
src/ui/modal.js
```

Keep UI logic separate from Three.js logic.

## Navigation behavior

Clicking:

```text
EXPERIENCE
```

should:

1. Select the experience section.
2. Move/focus the Three.js camera appropriately.
3. Display the experience panel.

The same pattern should work for every section.

## Close/back

Every open section should have a clear way to return to the main view.

The avatar should remain visible whenever possible.

## Important

The HTML interface must contain actual semantic HTML.

Use:

* buttons
* headings
* lists
* links

where appropriate.

Do not make the entire interface a canvas.
