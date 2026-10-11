// Shared by the film (browser) and the score (node). Pure functions only.

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, u) => a + (b - a) * u;
export const ramp = (t, a, b) => clamp((t - a) / (b - a));
export const mix2 = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
export const TAU = Math.PI * 2;

// ---- easing ----
export const E = {
  linear: u => u,
  inQuad: u => u * u,
  inCubic: u => u * u * u,
  outCubic: u => 1 - (1 - u) ** 3,
  inOutCubic: u => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2),
  outQuint: u => 1 - (1 - u) ** 5,
  inQuint: u => u ** 5,
  inExpo: u => (u <= 0 ? 0 : 2 ** (10 * u - 10)),
  outExpo: u => (u >= 1 ? 1 : 1 - 2 ** (-10 * u)),
  inOutExpo: u => (u <= 0 ? 0 : u >= 1 ? 1 : u < 0.5 ? 2 ** (20 * u - 10) / 2 : (2 - 2 ** (-20 * u + 10)) / 2),
  inOutQuint: u => (u < 0.5 ? 16 * u ** 5 : 1 - (-2 * u + 2) ** 5 / 2),
  outBack: u => { const c1 = 1.70158 * 1.4, c3 = c1 + 1; return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2; },
  inBack: u => { const c1 = 1.70158, c3 = c1 + 1; return c3 * u * u * u - c1 * u * u; },
  outElastic: u => (u <= 0 ? 0 : u >= 1 ? 1 : 2 ** (-9 * u) * Math.sin((u * 10 - 0.75) * (TAU / 3)) + 1),
  outBounce: u => {
    const n1 = 7.5625, d1 = 2.75;
    if (u < 1 / d1) return n1 * u * u;
    if (u < 2 / d1) return n1 * (u -= 1.5 / d1) * u + 0.75;
    if (u < 2.5 / d1) return n1 * (u -= 2.25 / d1) * u + 0.9375;
    return n1 * (u -= 2.625 / d1) * u + 0.984375;
  },
};
// clamped helpers: e('outExpo', t, a, b)
export const ease = (name, t, a, b) => E[name](ramp(t, a, b));

// Damped spring step response 0 -> 1 (analytic, so it is a pure function of t).
export function spring(t, freq = 2.2, damp = 0.42) {
  if (t <= 0) return 0;
  const w = TAU * freq, z = damp, wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
}
// Decaying oscillation kicked at t=0 (0 before), peak ~1.
export function wobble(t, freq = 3, decay = 0.25) {
  if (t <= 0) return 0;
  return Math.sin(TAU * freq * t) * Math.exp(-t / decay);
}
// Smooth bump 0 -> 1 -> 0 over [a, b] with fast attack.
export function bump(t, a, b, attack = 0.25) {
  if (t <= a || t >= b) return 0;
  const u = (t - a) / (b - a);
  return u < attack ? E.outCubic(u / attack) : 1 - E.inOutCubic((u - attack) / (1 - attack));
}

// ---- seeded randomness (never Math.random) ----
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Stateless hash -> [0,1)
export function hash(n, seed = 1) {
  return mulberry32((Math.imul(n | 0, 2654435761) ^ Math.imul(seed, 1597334677)) >>> 0)();
}
// 1D value noise, smooth, deterministic.
export function noise1(x, seed = 7) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hash(i, seed), hash(i + 1, seed), u) * 2 - 1;
}

// The four eases shown in the curve scene (also drive the pitch glides in the score).
export const SHOWCASE = [
  { name: 'expo', fn: E.inOutExpo, label: 'easeInOutExpo' },
  { name: 'back', fn: E.outBack, label: 'easeOutBack' },
  { name: 'elastic', fn: E.outElastic, label: 'easeOutElastic' },
  { name: 'bounce', fn: E.outBounce, label: 'easeOutBounce' },
];
