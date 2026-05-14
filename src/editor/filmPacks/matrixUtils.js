// Color matrix utilities for film look presets
// Each helper returns a 20-length array (4x5 ColorMatrix) suitable for Fabric.js ColorMatrix filter.
// Matrix layout (row-major):
//   [ rR, rG, rB, rA, rOffset,
//     gR, gG, gB, gA, gOffset,
//     bR, bG, bB, bA, bOffset,
//     aR, aG, aB, aA, aOffset ]

export const IDENTITY_MATRIX = [
  1, 0, 0, 0, 0,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 1, 0,
];

/** Combine warm tint (boost reds, mild green, drop blue) with a global brightness offset (-1..1). */
export function warmMatrix(strength = 0.15, brightness = 0) {
  const r = 1 + strength * 0.6;
  const g = 1 + strength * 0.15;
  const b = 1 - strength * 0.4;
  return [
    r, 0, 0, 0, brightness,
    0, g, 0, 0, brightness,
    0, 0, b, 0, brightness,
    0, 0, 0, 1, 0,
  ];
}

/** Cool tint: boost blues, slight green, drop red. */
export function coolMatrix(strength = 0.15, brightness = 0) {
  const r = 1 - strength * 0.4;
  const g = 1 + strength * 0.1;
  const b = 1 + strength * 0.6;
  return [
    r, 0, 0, 0, brightness,
    0, g, 0, 0, brightness,
    0, 0, b, 0, brightness,
    0, 0, 0, 1, 0,
  ];
}

/** Magenta lift (Velvia-style) – reds + blues up, greens slightly down. */
export function magentaMatrix(strength = 0.15) {
  const r = 1 + strength * 0.5;
  const g = 1 - strength * 0.2;
  const b = 1 + strength * 0.5;
  return [
    r, 0, 0, 0, 0,
    0, g, 0, 0, 0,
    0, 0, b, 0, 0,
    0, 0, 0, 1, 0,
  ];
}

/** Green lift – greens up, blues mildly down. Provia/Astia-ish. */
export function greenMatrix(strength = 0.15) {
  return [
    1, 0, 0, 0, 0,
    0, 1 + strength * 0.4, 0, 0, 0,
    0, 0, 1 - strength * 0.15, 0, 0,
    0, 0, 0, 1, 0,
  ];
}

/** Faded film – low contrast lifted blacks, slight desaturation. */
export function fadedMatrix(lift = 0.08, desat = 0.25) {
  // mix toward luminance to desaturate, then add lift
  const k = 1 - desat;
  const lr = 0.2126 * desat;
  const lg = 0.7152 * desat;
  const lb = 0.0722 * desat;
  return [
    k + lr, lg,      lb,      0, lift,
    lr,     k + lg,  lb,      0, lift,
    lr,     lg,      k + lb,  0, lift,
    0,      0,       0,       1, 0,
  ];
}

/** Black and white via luminance with optional tint offsets (sepia/cyanotype). */
export function bwMatrix(rTint = 0, gTint = 0, bTint = 0) {
  const lr = 0.2126;
  const lg = 0.7152;
  const lb = 0.0722;
  return [
    lr, lg, lb, 0, rTint,
    lr, lg, lb, 0, gTint,
    lr, lg, lb, 0, bTint,
    0,  0,  0,  1, 0,
  ];
}

/** Cinematic teal-and-orange — push shadows cool, highlights warm via channel rebalance. */
export function tealOrangeMatrix(strength = 0.2) {
  return [
    1 + strength * 0.5, 0,                  -strength * 0.2,    0, 0,
    0,                  1 + strength * 0.1, 0,                  0, 0,
    -strength * 0.3,    0,                  1 + strength * 0.4, 0, 0,
    0,                  0,                  0,                  1, 0,
  ];
}

/** Bleach bypass — desaturate strongly while boosting contrast offset. */
export function bleachMatrix(desat = 0.55, contrast = 0.1) {
  const k = 1 - desat;
  const lr = 0.2126 * desat;
  const lg = 0.7152 * desat;
  const lb = 0.0722 * desat;
  const c = 1 + contrast;
  const off = -contrast * 0.5;
  return [
    (k + lr) * c, lg * c,       lb * c,       0, off,
    lr * c,       (k + lg) * c, lb * c,       0, off,
    lr * c,       lg * c,       (k + lb) * c, 0, off,
    0,            0,            0,            1, 0,
  ];
}
