# Build Step 3 — Add the Developer Avatar

Continue from the existing project.

Do not restructure the application unnecessarily.

## Goal

Add the central 3D developer avatar.

The avatar is the primary visual element of the portfolio.

## Avatar

Use a humanoid GLB/GLTF model.

Place the model at:

```text
/public/models/avatar.glb
```

Use Three.js `GLTFLoader`.

Import it from the installed Three.js package:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
```

Do NOT use a CDN.

## Avatar characteristics

The avatar should represent:

* a young professional software developer
* approachable
* modern
* professional

Avoid:

* superhero appearance
* fantasy character
* soldier
* gamer aesthetic
* exaggerated animations

## Loading

Create a dedicated:

```text
src/three/avatar.js
```

module.

The module should be responsible for:

* loading the model
* positioning it
* scaling it
* adding it to the scene
* accessing animations
* updating avatar animations

## Animation

If the GLB contains animations, support them.

At minimum, support:

* idle
* subtle breathing
* subtle natural movement

If the model contains no animations, create a subtle procedural idle movement.

The movement should be extremely subtle.

Do not make the character dance or perform exaggerated movements.

## Error handling

If the model fails to load:

* do not crash the application
* log the error
* provide a simple fallback representation
* keep the rest of the portfolio functional

## Scene composition

Place the avatar in the center of the environment.

The avatar should immediately become the visual focal point.

Do not add portfolio content yet.

At the end of this step the result should be:

```text
        3D ENVIRONMENT

             AVATAR

        standing centrally
```

Do not implement navigation or portfolio panels yet.
