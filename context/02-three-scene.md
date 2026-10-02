# Build Step 2 — Create the Three.js Scene

Continue working on the existing vanilla JavaScript portfolio project.

Do NOT replace the project with a framework.

## Goal

Create the core Three.js environment that will eventually contain the developer avatar.

The scene should contain:

* Three.js Scene
* PerspectiveCamera
* WebGLRenderer
* Ambient/environment lighting
* Directional key light
* Subtle fill light
* Ground plane
* Basic environment

## Visual direction

Create a professional dark developer environment.

The environment should feel:

* modern
* minimal
* technical
* cinematic
* professional

Do NOT make it look like a video game.

Do NOT add excessive particles.

Do NOT add the avatar yet.

## Camera

Create a reusable camera module.

The camera should:

* use PerspectiveCamera
* have sensible FOV
* have sensible near/far clipping
* point toward the center of the scene
* resize correctly when the browser changes size

## Renderer

Create a reusable renderer module.

Configure:

* antialiasing
* alpha where appropriate
* correct pixel ratio
* responsive dimensions

Limit pixel ratio:

```js
renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);
```

## Lighting

Create a separate lighting module.

Use subtle lighting that creates depth without making the scene overly bright.

## Ground

Add a simple ground plane.

The ground should provide a visual anchor for the future avatar.

## Architecture

Do not put everything in `main.js`.

Keep:

```text
scene.js
camera.js
renderer.js
lighting.js
```

responsible for their respective systems.

## Animation loop

Create a basic animation loop using:

```js
requestAnimationFrame
```

The application should continuously render the scene.

Do not add complex animation yet.

## Result

When this step is complete, the browser should show a polished empty Three.js environment ready for the avatar.

Do not build portfolio panels, navigation, projects, skills, or experience yet.
