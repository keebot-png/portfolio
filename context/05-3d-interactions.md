# Build Step 5 — 3D Portfolio Interaction System

Continue from the existing application.

## Goal

Create interactive 3D objects around the avatar.

These objects represent:

* About
* Experience
* Skills
* Projects
* Contact

The avatar remains the central object.

## Interaction

Use Three.js Raycaster.

The user should be able to:

* hover over an object
* see it highlighted
* click the object
* trigger the corresponding portfolio section

## Hover behavior

When hovering:

* slightly increase scale
* increase visual brightness
* provide subtle feedback

When the pointer leaves:

* smoothly return to the original state

Do not make the animation excessive.

## Objects

Create reusable functions for creating interactive objects.

For example:

```js
createInteractiveObject(...)
```

Each object should have metadata identifying its section.

For example:

```js
object.userData.section = "experience";
```

## Architecture

Use:

```text
src/three/objects.js
src/three/interaction.js
```

`objects.js` should create the objects.

`interaction.js` should handle:

* raycasting
* mouse position
* hover
* click
* selection

Do not put interaction logic into `main.js`.

## Visual layout

Arrange the objects around the avatar in a balanced composition.

Example concept:

```text
              EXPERIENCE

        SKILLS       PROJECTS

                 AVATAR

              ABOUT / CONTACT
```

You do not need to use this exact layout.

Create a visually balanced arrangement.

## Important

The objects should feel like part of the portfolio environment rather than random floating cubes.

Use simple geometric forms with subtle materials and lighting.

Do not add text-heavy 3D objects.

Text will be handled later using HTML/CSS.
