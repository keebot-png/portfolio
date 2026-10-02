# Build Step 10 — Performance and Accessibility

Continue from the existing project.

## Performance

Review the entire Three.js application.

Optimize:

* geometry
* textures
* lighting
* animations
* render loop
* object count
* model loading

Avoid unnecessary calculations every frame.

Limit pixel ratio:

```js
Math.min(window.devicePixelRatio, 2)
```

## Animation

Only animate objects that actually need animation.

Avoid creating unnecessary allocations inside the animation loop.

## Assets

Keep 3D models and textures reasonably sized.

Do not use unnecessarily large textures.

## Loading

Make sure the loading screen appears while the avatar is loading.

Do not freeze the page while assets load.

## Accessibility

Important portfolio information must exist as normal HTML.

Provide:

* keyboard-accessible navigation
* visible focus states
* readable contrast
* semantic buttons
* semantic headings
* accessible links

The portfolio should still communicate its basic information even if WebGL fails.

## WebGL fallback

If Three.js/WebGL cannot initialize:

* display a normal HTML portfolio
* keep navigation functional
* show the developer information
* do not leave the user with a blank screen

## Console

Remove:

* unnecessary console logs
* warnings caused by the application
* errors

The final application should have a clean browser console.
