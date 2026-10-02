# Build Step 8 — Camera and Animation System

Continue from the existing project.

## Goal

Make the portfolio feel polished and cinematic without adding an animation library.

Do NOT install GSAP.

Use:

```js
requestAnimationFrame
```

and Three.js utilities.

## Camera

Create smooth camera transitions.

When a portfolio section is selected:

* smoothly move the camera
* smoothly rotate toward the relevant area
* avoid sudden jumps

Create reusable functions such as:

```js
animateCameraTo(...)
```

## Avatar

Add subtle:

* idle movement
* breathing
* head movement
* occasional natural movement

Do not overanimate the avatar.

## Interactive objects

Add subtle:

* floating
* rotation
* hover scaling
* lighting changes

The animations should feel continuous but subtle.

## Mouse movement

Implement a small mouse-based parallax effect.

The camera or scene should react slightly to mouse movement.

The effect should be subtle.

Do not make the camera move aggressively.

## Animation architecture

Keep animation logic in:

```text
src/three/animation.js
```

Do not put all animation logic inside `main.js`.

## Important

The website should feel alive when the user does nothing.

But the animation should never distract from the portfolio content.
