# Build Step 9 — Responsive and Mobile Experience

Continue from the existing portfolio.

## Goal

Make the website work properly on:

* desktop
* laptop
* tablet
* mobile

Do not simply shrink the desktop layout.

Create a deliberate mobile experience.

## Three.js mobile behavior

On smaller screens:

* reduce visual complexity
* reduce number of visible objects if necessary
* adjust camera distance
* reduce animation complexity
* maintain avatar visibility

## UI

Navigation should become mobile-friendly.

Use:

* touch-friendly buttons
* appropriate spacing
* readable text
* panels that fit the viewport

Do not require hover interactions on mobile.

## Touch

Support touch interaction with the portfolio objects.

A user should be able to tap a 3D object to select it.

## Resize

Ensure the renderer and camera respond correctly to:

```js
window.addEventListener('resize', ...)
```

## Performance

Do not render unnecessary objects on small screens.

The website must remain usable on mobile devices.

## Result

The mobile version should still clearly communicate:

* developer identity
* experience
* skills
* projects
* contact information

while preserving the 3D avatar concept.
