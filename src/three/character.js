import * as THREE from 'three';
import { clay, mesh, box, cylinder, sphere, group } from './primitives.js';

// A friendly stylised man built from primitives: t-shirt, shorts, trainers,
// hair and a baseball cap. Arms are articulated at the shoulder and elbow so
// he can wave; he also breathes, sways and blinks.

const COLORS = {
  skin: 0xf2bb98,
  blush: 0xf09a86,
  hair: 0x6b4a32,
  shirt: 0xf4a259,
  shorts: 0x3b4a6b,
  shoe: 0xfbf8f3,
  sole: 0x3a3f4a,
  cap: 0x3b5ea8,
  eyeWhite: 0xffffff,
  pupil: 0x2a2420,
  mouth: 0x9b4f3f,
};

const REST_ARM_Z = 0.12;
const RAISED_ARM_Z = 2.4;
const WAVE = { raise: 0.5, hold: 2.0, lower: 0.6, firstAt: 3, minGap: 7, maxGap: 13 };

function smoothstep(t) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function createLeg(side, m) {
  const x = side * 0.11;
  return group([
    mesh(new THREE.CapsuleGeometry(0.07, 0.7, 4, 16), m.skin, [x, 0.49, 0]),
    cylinder(0.1, 0.095, 0.3, m.shorts, [x, 0.76, 0]),
    box(0.13, 0.08, 0.28, m.shoe, [x, 0.06, 0.035]),
    box(0.135, 0.025, 0.29, m.sole, [x, 0.0125, 0.035]),
  ]);
}

// `side` is +1 for the man's left arm (+x) and -1 for his right arm (-x).
function createArm(side, m) {
  const shoulder = group([
    sphere(0.08, m.shirt, [side * -0.02, 0.01, 0]),
    cylinder(0.075, 0.068, 0.16, m.shirt, [0, -0.06, 0]),
    mesh(new THREE.CapsuleGeometry(0.056, 0.2, 4, 16), m.skin, [0, -0.16, 0]),
  ], [side * 0.235, 1.44, 0]);

  const elbow = group([
    mesh(new THREE.CapsuleGeometry(0.052, 0.18, 4, 16), m.skin, [0, -0.12, 0]),
    sphere(0.06, m.skin, [0, -0.27, 0]),
  ], [0, -0.3, 0]);
  shoulder.add(elbow);

  shoulder.rotation.z = side * REST_ARM_Z;
  return { shoulder, elbow };
}

function createHead(m) {
  const R = 0.145;
  const head = new THREE.Group();
  head.position.y = 1.655;

  head.add(
    sphere(R, m.skin, [0, 0, 0], 32),
    sphere(0.03, m.skin, [R - 0.005, -0.01, 0]),
    sphere(0.03, m.skin, [-(R - 0.005), -0.01, 0]),
    sphere(0.015, m.skin, [0, -0.02, R - 0.006])
  );

  // Eyes: whites, pupils and a small catchlight.
  const eyes = [0.055, -0.055].map((x) => {
    const eye = group([
      sphere(0.03, m.eyeWhite, [0, 0, 0]),
      sphere(0.016, m.pupil, [0, 0, 0.02]),
      sphere(0.006, m.eyeWhite, [0.007, 0.009, 0.033], 8),
    ], [x, 0.005, R - 0.025]);
    return eye;
  });
  head.add(...eyes);

  // Eyebrows and blush.
  head.add(
    box(0.05, 0.012, 0.01, m.hair, [0.055, 0.058, R - 0.012], [0, 0, 0.12]),
    box(0.05, 0.012, 0.01, m.hair, [-0.055, 0.058, R - 0.012], [0, 0, -0.12])
  );
  for (const x of [0.085, -0.085]) {
    const cheek = sphere(0.024, m.blush, [x, -0.03, R - 0.045], 12);
    cheek.scale.set(1, 0.65, 0.4);
    head.add(cheek);
  }

  const mouth = mesh(new THREE.TorusGeometry(0.036, 0.008, 8, 18, Math.PI), m.mouth, [0, -0.055, R - 0.02], [0, 0, Math.PI]);
  head.add(mouth);

  // Hair: a fringe band around the whole head plus a fuller back half.
  const hairR = R + 0.006;
  const fringe = mesh(new THREE.SphereGeometry(hairR, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.36), m.hair, [0, 0.004, -0.004]);
  const back = mesh(new THREE.SphereGeometry(hairR, 28, 14, Math.PI, Math.PI, 0, Math.PI * 0.56), m.hair, [0, 0.004, -0.004]);
  head.add(fringe, back);

  // Baseball cap: dome, forward brim and a button on top.
  const dome = mesh(new THREE.SphereGeometry(R - 0.008, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), m.cap, [0, 0.085, 0]);
  const brim = cylinder(0.165, 0.165, 0.014, m.cap, [0, 0.092, 0.03], [0.1, 0, 0]);
  brim.geometry = new THREE.CylinderGeometry(0.165, 0.165, 0.014, 24, 1, false, -Math.PI / 2, Math.PI);
  const button = sphere(0.015, m.cap, [0, 0.085 + R - 0.008, 0], 10);
  head.add(dome, brim, button);

  return { head, eyes };
}

export function createCharacter({ groundY = 0 } = {}) {
  const m = Object.fromEntries(Object.entries(COLORS).map(([name, color]) => [name, clay(color)]));

  const man = new THREE.Group();
  man.name = 'avatar';
  man.position.y = groundY;

  man.add(createLeg(1, m), createLeg(-1, m));
  man.add(cylinder(0.215, 0.205, 0.16, m.shorts, [0, 0.89, 0], [0, 0, 0], 28));

  // Everything above the hips moves together when he breathes.
  const torso = cylinder(0.21, 0.19, 0.54, m.shirt, [0, 1.23, 0], [0, 0, 0], 28);
  const neck = cylinder(0.055, 0.06, 0.1, m.skin, [0, 1.52, 0]);
  const { head, eyes } = createHead(m);
  const left = createArm(1, m);
  const right = createArm(-1, m);
  const chest = group([torso, neck, head, left.shoulder, right.shoulder]);
  man.add(chest);

  let waveStartedAt = null;
  let nextWaveAt = WAVE.firstAt;

  function waveAmount(elapsed) {
    if (waveStartedAt === null) {
      if (elapsed < nextWaveAt) return 0;
      waveStartedAt = elapsed;
    }
    const t = elapsed - waveStartedAt;
    const { raise, hold, lower } = WAVE;
    if (t < raise) return smoothstep(t / raise);
    if (t < raise + hold) return 1;
    if (t < raise + hold + lower) return smoothstep(1 - (t - raise - hold) / lower);

    waveStartedAt = null;
    nextWaveAt = elapsed + THREE.MathUtils.randFloat(WAVE.minGap, WAVE.maxGap);
    return 0;
  }

  function update(delta, elapsed) {
    const breath = Math.sin(elapsed * 1.4);
    const sway = Math.sin(elapsed * 0.4);

    torso.scale.set(1 + breath * 0.02, 1 + breath * 0.006, 1 + breath * 0.02);
    chest.position.y = breath * 0.006;
    man.rotation.y = sway * 0.03;
    man.rotation.z = Math.sin(elapsed * 0.3) * 0.008;

    // Wave with the right arm; the left arm just drifts a little.
    const wave = waveAmount(elapsed);
    const waveTime = waveStartedAt === null ? 0 : elapsed - waveStartedAt;
    right.shoulder.rotation.z = -THREE.MathUtils.lerp(REST_ARM_Z, RAISED_ARM_Z, wave);
    right.shoulder.rotation.x = -0.25 * wave;
    right.elbow.rotation.z = -wave * (0.9 + Math.sin(waveTime * 13) * 0.5);
    head.rotation.z = -0.08 * wave;
    left.shoulder.rotation.x = Math.sin(elapsed * 0.9) * 0.03;

    // Blink.
    const blinkT = elapsed % 4.1;
    const blink = blinkT < 0.15 ? Math.sin((blinkT / 0.15) * Math.PI) : 0;
    for (const eye of eyes) eye.scale.y = 1 - blink * 0.85;
  }

  return { object: man, update };
}
