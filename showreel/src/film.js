// The film. draw(ctx, t) paints frame t and depends on nothing but t.
// Thread: one accent dot — ball, tittle, grid seed, moon, liquid, playhead, period.
import { clamp, lerp, ramp, E, ease, spring, wobble, bump, TAU, noise1, hash, SHOWCASE } from './lib.js';
import { CUE, WORDS } from './cues.js';
import { shape, layout, fillGlyph, pathGlyph, XH, CAP } from './type.js';

export const W = 1920, H = 1080;
const CX = W / 2, CY = H / 2;
const PAPER = '#EEEAE2', INK = '#111111', ACC = '#FF4A1C';
const MONO = 'JB, monospace';

// ---------- measured beat grid ----------
let BT = null;
export function setBeats(b) { BT = b.beats; }
export function B(n) {
  const P = BT[1] - BT[0], last = BT.length - 1;
  if (n <= 0) return BT[0] + n * P;
  if (n >= last) return BT[last] + (n - last) * P;
  const i = Math.floor(n);
  return BT[i] + (n - i) * (BT[i + 1] - BT[i]);
}

// ---------- small drawing helpers ----------
function disc(ctx, x, y, r) { if (r <= 0) return; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function blob(ctx, x, y, r, sx, sy, rot) {
  if (r <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, sy);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore();
}
function mono(ctx, str, x, y, size, color, align = 'left', weight = 500) {
  ctx.font = `${weight} ${size}px ${MONO}`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color; ctx.fillText(str, x, y);
}
const typed = (str, t, t0, dur, tOut = Infinity, durOut = 0.15) => {
  const on = Math.floor(str.length * ramp(t, t0, t0 + dur));
  const off = Math.floor(str.length * ramp(t, tOut, tOut + durOut));
  return str.slice(off, on);
};
// decaying vertical camera kick for a list of impacts
function shake(t, hits) {
  let y = 0, x = 0;
  for (const [ti, a] of hits) {
    const d = t - ti;
    if (d < 0 || d > 0.5) continue;
    y += a * Math.exp(-d / 0.07) * Math.sin(TAU * 17 * d);
    x += a * 0.35 * Math.exp(-d / 0.07) * Math.sin(TAU * 23 * d + 1);
  }
  return [x, y];
}

// ======================================================================
// SCENE A — bounce + "motion" (beats 0–8). World space with a camera.
// ======================================================================
const FLOOR = 700;
let SA = null;
function initA() {
  if (SA) return SA;
  const base = layout('motıon', { wdth: 112, wght: 900 }, 1000);
  const S = (1640 / base.width) * 1000;
  const gi = shape('ı', 112, 900);
  const stem = ((gi.xmax - gi.xmin) / 1000) * S;
  const R = stem * 0.62;
  const rest = layout('motıon', { wdth: 112, wght: 900 }, S);
  const xi = CX - rest.width / 2 + rest.items[3].cx;
  const g = 3600; // px/s², shared by every flight so the bounces read as one physics
  SA = { S, R, xi, g, gap: 0.085 * S };
  return SA;
}

function antic(t) {
  // squash before the hop, then a springy release that overshoots into a stretch
  return t < B(CUE.hop) ? ease('inOutCubic', t, B(6.55), B(CUE.hop)) : 1 - spring(t - B(CUE.hop), 4.5, 0.42);
}
function axesA(k, t) {
  const dk = Math.abs(k - 3);
  const wght = 900 - 660 * bump(t, B(CUE.tittle) + 0.035 * dk, B(CUE.tittle) + 0.035 * dk + 0.46, 0.2);
  const ta = B(CUE.accordion) + 0.022 * k;
  const sq = t < ta ? 0 : t < ta + 0.07 ? E.outCubic((t - ta) / 0.07) : 1 - spring(t - ta - 0.07, 2.6, 0.45);
  const wdth = Math.min(126, 112 - 62 * sq + 14 * Math.max(0, antic(t)));
  return { wdth, wght };
}
function wordA(t) {
  const { S, gap } = initA();
  const L = layout('motıon', k => axesA(k, t), S);
  const left = CX - L.width / 2;
  const an = antic(t);
  const out = L.items.map((it, k) => {
    const dk = Math.abs(k - 3);
    const rk = spring(t - (B(CUE.erupt) - 0.025 + 0.03 * dk), 2.3, 0.5);
    let dy = (1 - rk) * S * 0.8;
    const tf = B(CUE.hop) + 0.04 + 0.022 * dk;
    if (t > tf) { const u = t - tf; dy += -300 * u + 0.5 * 9000 * u * u; }
    let sy = 1 - 0.2 * an;
    if (k === 3) {
      const d = t - B(CUE.tittle);
      sy *= 1 - 0.17 * Math.exp(-(((d - 0.012) / 0.03) ** 2)) + 0.05 * wobble(d - 0.04, 7, 0.1);
    }
    return { it, dy, sy };
  });
  const i3 = out[3];
  const stemTop = FLOOR + i3.dy + (i3.it.g.ymin / 1000) * S * i3.sy;
  return { L, left, out, S, tittle: { x: left + i3.it.cx, y: stemTop - gap - SA.R }, stemTop };
}

// Ball path before squash/stretch. Contact windows are centred on the beat.
function flight(t, t0, t1, x0, y0, x1, y1, h) {
  const u = (t - t0) / (t1 - t0);
  return { x: lerp(x0, x1, u), y: lerp(y0, y1, u) - h * 4 * u * (1 - u) };
}
function ballA(t) {
  const { R, xi, g } = initA();
  const ground = FLOOR - R;
  const pts = [
    [CUE.launch, xi - 1080], [CUE.bounces[0], xi - 430], [CUE.bounces[1], xi - 170],
    [CUE.bounces[2], xi - 62], [CUE.bounces[3], xi - 14], [CUE.erupt, xi],
  ];
  const c = 0.045; // contact time, s
  if (t < B(0) - c / 2) { const d = B(0) - c / 2 - t; return { x: xi - 1080 - 520 * d, y: ground - 0.5 * g * d * d, impact: null }; }
  for (let k = 0; k < pts.length - 1; k++) {
    const ta = B(pts[k][0]), tb = B(pts[k + 1][0]), T = tb - ta;
    const cc = Math.min(c, T * 0.3);
    if (t < ta + cc / 2) return { x: pts[k][1], y: ground, impact: { t: ta, c: cc, v: k === 0 ? 1900 : (g * (B(pts[k][0]) - B(pts[k - 1][0]))) / 2 } };
    if (t < tb - cc / 2 || k === pts.length - 2) {
      if (k === pts.length - 2 && t >= tb - cc / 2) break;
      const h = (g * T * T) / 8;
      return flight(t, ta + cc / 2, tb - cc / 2, pts[k][1], ground, pts[k + 1][1], ground, h);
    }
  }
  // beat 4 → 5: the rising i-stem shoves the dot up; it flies and lands as the tittle
  const w = wordA(t);
  const t4 = B(CUE.erupt), t5 = B(CUE.tittle), c5 = 0.04;
  if (t < t5 - c5 / 2) {
    const T = t5 - c5 / 2 - t4, y0 = ground, y1 = wordA(t5).tittle.y;
    const v0 = (y1 - y0 - 0.5 * g * T * T) / T, d = t - t4;
    let y = y0 + v0 * d + 0.5 * g * d * d;
    y = Math.min(y, w.stemTop - R - 2);
    return { x: lerp(xi, w.tittle.x, ramp(t, t4, t5)), y, impact: null };
  }
  const t7 = B(CUE.hop), t8 = B(CUE.grid);
  if (t < t7 + 0.02) return { x: w.tittle.x, y: w.tittle.y, impact: { t: t5, c: c5, v: 900 } };
  // beat 7 → 8: hop off the i, land on the floor centre as the word sinks
  const s = wordA(t7 + 0.02).tittle;
  if (t < t8 - 0.02) return flight(t, t7 + 0.02, t8 - 0.02, s.x, s.y, CX, ground, 300);
  return { x: CX, y: ground, impact: { t: t8, c: 0.04, v: 1600 } };
}
function ballPose(t, fn, R) {
  const p = fn(t), h = 1 / 240;
  const a = fn(t - h), b = fn(t + h);
  const vx = (b.x - a.x) / (2 * h), vy = (b.y - a.y) / (2 * h), sp = Math.hypot(vx, vy);
  let par = 1 + Math.min(0.75, sp / 3000), rot = Math.atan2(vy, vx), sx = par, sy = 1 / Math.sqrt(par);
  let y = p.y;
  if (p.impact) {
    const { t: ti, c, v } = p.impact;
    const u = clamp((t - ti + c / 2) / c);
    const amt = Math.min(0.55, v / 3600) * Math.sin(Math.PI * u);
    rot = 0; sx = 1 + amt * 1.05; sy = 1 - amt; y += R * amt;
  }
  return { x: p.x, y, sx, sy, rot, sp };
}

function sceneA(ctx, t) {
  const { R, S } = initA();
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  const raw = ballA(t);
  // camera: tight on the ball, pulls back to the composition by beat 4.4
  const e = E.inOutCubic(ramp(t, B(0), B(4.4)));
  const hgt = Math.max(0, FLOOR - R - raw.y);
  const z = lerp(2.0, 1, e);
  let fx = lerp(raw.x, CX, e), fy = lerp(FLOOR - 150 - 0.5 * hgt, CY, e);
  const p = E.inOutCubic(ramp(t, B(7.1), B(CUE.grid)));
  fx = lerp(fx, CX, p); fy = lerp(fy, FLOOR - R, p);
  const roll = lerp(-0.06, 0, e);
  const [kx, ky] = shake(t, [[B(0), 14], [B(2), 10], [B(4), 12], [B(5), 4], [B(8), 8]]);
  ctx.save();
  ctx.translate(CX + kx, CY + ky); ctx.rotate(roll); ctx.scale(z, z); ctx.translate(-fx, -fy);

  // floor: shrinks into the landing point for the hand-off to the grid
  const fs = E.inOutCubic(ramp(t, B(7.25), B(CUE.grid) - 0.03));
  const fl = lerp(-2400, CX, fs), fr = lerp(4400, CX, fs);
  ctx.fillStyle = INK;
  if (fr - fl > 0.5) ctx.fillRect(fl, FLOOR, fr - fl, 6);

  // impact rings on the floor
  const rings = [[B(0), 1, CX], [B(2), 0.8], [B(3), 0.55], [B(3.5), 0.35], [B(CUE.grid), 0.9, CX]];
  ctx.strokeStyle = INK;
  for (const [ti, a] of rings) {
    const u = (t - ti) / 0.38;
    if (u <= 0 || u >= 1) continue;
    const bx = ballA(ti).x, rx = R * (1.2 + 5.5 * a * E.outCubic(u));
    ctx.lineWidth = 5 * (1 - u) * a + 0.5;
    ctx.beginPath(); ctx.ellipse(bx, FLOOR + 3, rx, rx * 0.16, 0, 0, TAU); ctx.stroke();
  }

  // shadow
  if (t < B(CUE.erupt) || t > B(CUE.hop)) {
    const k = clamp(1 - hgt / 700);
    ctx.fillStyle = `rgba(17,17,17,${0.16 * k})`;
    ctx.beginPath(); ctx.ellipse(raw.x, FLOOR + 3, R * (0.5 + 0.7 * k), R * 0.17 * (0.5 + 0.7 * k), 0, 0, TAU); ctx.fill();
  }

  // onion skins: the animator's spacing chart, one ghost every 1/20 s on an absolute grid
  {
    const dt = 1 / 20, k0 = Math.ceil(-0.55 / dt), k1 = Math.floor(Math.min(t - 0.035, B(CUE.erupt) - 0.01) / dt);
    const n = k1 - k0 + 1;
    ctx.strokeStyle = INK;
    for (let k = k0; k <= k1; k++) {
      const tk = k * dt, q = ballA(tk);
      const born = spring(t - tk, 4, 0.5);
      const order = (k - k0) / Math.max(1, n - 1);
      const tOut = B(CUE.erupt) - 0.06 + 0.2 * order;
      const gone = E.inBack(ramp(t, tOut, tOut + 0.1));
      const r = R * lerp(0.55, 1, born) * (1 - gone);
      if (r <= 0.5) continue;
      ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, TAU); ctx.stroke();
    }
  }
  // the word, clipped to above the floor (it rises out of / sinks into it)
  if (t > B(CUE.erupt) - 0.1) {
    const w = wordA(t);
    ctx.save();
    ctx.beginPath(); ctx.rect(-3000, -3000, 9000, 3000 + FLOOR + 1); ctx.clip();
    ctx.fillStyle = INK;
    for (const o of w.out) fillGlyph(ctx, o.it, w.left, FLOOR, S, { dy: o.dy, sy: o.sy });
    ctx.restore();
    // live axis readout under the word
    const ax = axesA(3, t);
    const str = typed(`wdth ${ax.wdth.toFixed(0).padStart(3)} · wght ${ax.wght.toFixed(0)}`, t, B(4.35), 0.28, B(CUE.hop) - 0.05, 0.2);
    mono(ctx, str, w.left + 6, FLOOR + 96, 52, 'rgba(17,17,17,0.78)');
  }

  const pose = ballPose(t, ballA, R);
  ctx.fillStyle = ACC;
  blob(ctx, pose.x, pose.y, R, pose.sx, pose.sy, pose.rot);
  ctx.restore();
}

// ======================================================================
// SCENE B — dot grid → 3D terrain → sphere → dive (beats 8–16). Screen space.
// ======================================================================
const GC = 31, GR = 17, SP = 64;
const DOTS = [];
for (let j = 0; j < GR; j++) for (let i = 0; i < GC; i++) {
  const px = (i - (GC - 1) / 2) * SP, py = (j - (GR - 1) / 2) * SP;
  DOTS.push({ i, j, px, py, d: Math.hypot(px, py), hero: i === (GC - 1) / 2 && j === (GR - 1) / 2 });
}
const FOC = 1500;
function sceneB(ctx, t) {
  const R0 = initA().R;
  const tilt = (64 * Math.PI / 180) * E.inOutCubic(ramp(t, B(CUE.tilt), B(CUE.terrain)));
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  const yaw = 0.42 * E.inOutCubic(ramp(t, B(11.6), B(14.8))) - 0.2 * E.inOutCubic(ramp(t, B(14), B(15.2)));
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const waveA = 64 * ramp(t, B(11.2), B(12.2)) * (1 - ramp(t, B(13), B(13.6)));
  const dolly = -1200 * E.inExpo(ramp(t, B(CUE.dive), B(CUE.dropout)));
  const Rs = 300, sTilt = -0.36, cs = Math.cos(sTilt), ss = Math.sin(sTilt);
  const spin = 1.2 * (t - B(CUE.sphere)) + 0.9 * E.inCubic(ramp(t, B(13.5), B(16))) * 3;
  const swirlA = 2.4 * bump(t, B(CUE.swirl), B(CUE.tilt) + 0.15, 0.45);

  const bg = t >= B(CUE.dropout) ? ACC : PAPER;
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  if (t >= B(CUE.dropout)) return;

  const list = [];
  const project = (X, Y, Z) => {
    const x2 = X * cy + Z * sy, z2 = -X * sy + Z * cy + dolly;
    if (FOC + z2 < 30) return null;
    const s = FOC / (FOC + z2);
    return { x: CX + x2 * s, y: CY + 40 * ramp(t, B(11), B(12)) * (1 - ramp(t, B(13), B(14))) + Y * s, s, z: z2 };
  };
  for (const D of DOTS) {
    if (D.hero) continue;
    // spawn: wavefront from the landing point
    const ta = B(CUE.grid) + D.d / 2600;
    const sp = spring(t - ta, 3.1, 0.42);
    if (sp <= 0.001) continue;
    // ripple shockwave
    const rp = t > B(CUE.ripple) ? Math.exp(-(((D.d - (t - B(CUE.ripple)) * 1900) / 85) ** 2)) * Math.exp(-(t - B(CUE.ripple)) / 1.1) : 0;
    // swirl
    const ang = swirlA * Math.exp(-D.d / 430);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    let px = D.px * ca - D.py * sa, py = D.px * sa + D.py * ca;
    const k = 1 + (16 * rp) / Math.max(D.d, 1);
    px *= k; py *= k;
    // plane in 3D (tilted top-away), with radial waves as height
    const hgt = waveA * Math.sin(D.d / 105 - (t - B(11)) * 8.5);
    let X = px, Y = py * ct - hgt * st, Z = -py * st - hgt * ct;
    // sphere target (lat/long), spun and tilted toward camera
    const m = E.inOutCubic(ramp(t, B(CUE.sphere) + D.d * 0.0002, B(CUE.sphere) + D.d * 0.0002 + 0.52));
    let alpha = 1, polar = 1;
    if (m > 0) {
      const lon = (D.i / GC) * TAU + spin, lat = ((D.j + 0.5) / GR - 0.5) * Math.PI * 0.94;
      const sx0 = Rs * Math.cos(lat) * Math.sin(lon), sy0 = Rs * Math.sin(lat), sz0 = -Rs * Math.cos(lat) * Math.cos(lon);
      const sY = sy0 * cs - sz0 * ss, sZ = sy0 * ss + sz0 * cs;
      X = lerp(X, sx0, m); Y = lerp(Y, sY, m); Z = lerp(Z, sZ, m);
      alpha = lerp(1, 0.16 + 0.84 * clamp(0.5 - sZ / (2 * Rs)), m);
      polar = lerp(1, 0.35 + 0.65 * Math.cos(lat), m);
    }
    const pr = project(X, Y, Z);
    if (!pr) continue;
    const r = 7.5 * sp * (1 + 1.2 * rp) * pr.s * lerp(1, 1.4, m) * polar;
    list.push({ ...pr, r, alpha, hero: false });
  }
  // the hero dot
  {
    const land = t - B(CUE.grid);
    const rH = lerp(R0, 22, E.outCubic(ramp(land, 0, 0.35)));
    const hover = 70 * ramp(t, B(11), B(12)) + waveA * Math.sin(-(t - B(11)) * 8.5);
    let X = 0, Y = -hover * st, Z = -hover * ct;
    const mo = E.inOutCubic(ramp(t, B(CUE.sphere) + 0.1, B(CUE.orbit)));
    if (mo > 0) {
      const a = (t - B(CUE.sphere)) * 3.3 - 1.2, Ro = Rs * 1.55;
      const ox = Ro * Math.cos(a), oy = -Ro * Math.sin(a) * 0.3, oz = Ro * Math.sin(a) * 0.95;
      X = lerp(X, ox, mo); Y = lerp(Y, oy, mo); Z = lerp(Z, oz, mo);
    }
    const pr = project(X, Y, Z);
    const dv = ramp(t, B(CUE.dive), B(CUE.dropout));
    if (pr && dv > 0) {
      const k = E.outCubic(dv);
      pr.x = lerp(pr.x, CX, k); pr.y = lerp(pr.y, CY, k); pr.z = -1e9;
      pr.s = Math.max(pr.s, Math.exp(4.1 * E.inQuad(dv)));
    }
    if (pr) {
      let sx = 1, sy2 = 1;
      if (land < 0.06) { const amt = 0.45 * Math.sin(Math.PI * clamp(0.5 + land / 0.04)); sx = 1 + amt; sy2 = 1 - amt; }
      list.push({ ...pr, r: rH * pr.s, alpha: 1, hero: true, sx, sy: sy2 });
    }
  }
  list.sort((a, b) => b.z - a.z);
  for (const d of list) {
    if (d.hero) { ctx.globalAlpha = 1; ctx.fillStyle = ACC; blob(ctx, d.x, d.y, d.r, d.sx, d.sy, 0); continue; }
    ctx.globalAlpha = d.alpha; ctx.fillStyle = INK; disc(ctx, d.x, d.y, d.r);
  }
  ctx.globalAlpha = 1;
  // ripple ring readout: one mono annotation, attached to the wavefront
  const lab = typed('f(x,y,t) = sin(d − ωt)', t, B(11.3), 0.3, B(12.9), 0.2);
  if (lab) mono(ctx, lab, 120, 1010, 52, 'rgba(17,17,17,0.78)');
  const lab2 = typed('n = 526 · r = 300', t, B(13.6), 0.25, B(CUE.dive), 0.15);
  if (lab2) mono(ctx, lab2, 120, 1010, 52, 'rgba(17,17,17,0.78)');
}

// ======================================================================
// SCENE C — liquid metaballs (beats 16–20), drained into the first curve.
// ======================================================================
const NB = 48, NCL = 6;
const GRAPH = { x: 300, y: 850, w: 1180, h: 560 };
const curvePt = (fn, u) => [GRAPH.x + GRAPH.w * u, GRAPH.y - GRAPH.h * fn(u)];
// u-values that split the first curve into equal arc lengths (for the liquid pour)
const ARC_U = (() => {
  const n = 2000, len = [0];
  let prev = curvePt(SHOWCASE[0].fn, 0);
  for (let i = 1; i <= n; i++) { const p = curvePt(SHOWCASE[0].fn, i / n); len.push(len[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1])); prev = p; }
  const out = [];
  for (let k = 0; k < 48; k++) { const target = (k / 47) * len[n]; let i = 0; while (i < n && len[i] < target) i++; out.push(i / n); }
  return out;
})();

function ballsC(t) {
  const out = [];
  const tear = E.outExpo(ramp(t, B(CUE.liquid) - 0.035, B(CUE.liquid) + 0.37)); // reveal opens on the downbeat
  let ringR = (330 + 70 * bump(t, B(CUE.pulse), B(CUE.pulse) + 0.5, 0.3)) * (1 - E.inBack(ramp(t, B(17.55), B(CUE.merge))));
  if (t > B(CUE.merge)) ringR = 230 * Math.abs(wobble(t - B(CUE.merge), 2.6, 0.2));
  const jelly = 0.42 * wobble(t - B(CUE.merge) - 0.03, 2.1, 0.32);
  const stretch = E.inOutCubic(ramp(t, B(18.5), B(CUE.pour))) * (1 - E.inOutCubic(ramp(t, B(19.2), B(19.6))));
  const spinL = (t - B(CUE.merge)) * 2.4;
  for (let i = 0; i < NB; i++) {
    const c = i % NCL;
    const ac = (c * TAU) / NCL + (t - B(CUE.liquid)) * 1.05;
    const mo = 18 + 18 * hash(i, 1), am = hash(i, 2) * TAU + (t - B(CUE.liquid)) * (2.2 + 2.5 * hash(i, 3));
    const jig = 1 + 0.9 * wobble(t - B(CUE.merge), 4.5, 0.2);
    let x = CX + ringR * Math.cos(ac) + mo * Math.cos(am) * jig;
    let y = CY + ringR * Math.sin(ac) + mo * Math.sin(am) * jig;
    if (stretch > 0) { // pill: spread members along a spinning axis
      const along = (((i * 7) % NB) / (NB - 1) - 0.5) * 520 * stretch, ax = Math.cos(spinL), ay = Math.sin(spinL);
      x += along * ax; y += along * ay;
    }
    // whole-blob squash & stretch after the merge (area-preserving)
    x = CX + (x - CX) * (1 + jelly); y = CY + (y - CY) / (1 + jelly);
    let r = 38 + 12 * hash(i, 4);
    r = lerp(260, r, tear); x = lerp(CX, x, tear); y = lerp(CY, y, tear);
    // pour: flow out of the blob along the first curve, centre first
    const u = ARC_U[i];
    const ts = B(CUE.pour) + 0.26 * Math.abs(i / (NB - 1) - 0.5) * 2;
    const p = E.inOutCubic(ramp(t, ts, ts + 0.2));
    if (p > 0) { const [tx, ty] = curvePt(SHOWCASE[0].fn, u); x = lerp(x, tx, p); y = lerp(y, ty, p); r = lerp(r, 15, p); }
    out.push([x, y, r]);
  }
  return out;
}
// Marching squares over f = Σ r²/d², filled as one path (no seams).
function metaballs(ctx, balls, cell = 8) {
  const nx = Math.ceil(W / cell) + 1, ny = Math.ceil(H / cell) + 1;
  const f = new Float32Array(nx * ny);
  for (const [bx, by, br] of balls) {
    const r2 = br * br;
    const reach = br * 7; // beyond this the contribution is < 0.02
    const i0 = Math.max(0, Math.floor((bx - reach) / cell)), i1 = Math.min(nx - 1, Math.ceil((bx + reach) / cell));
    const j0 = Math.max(0, Math.floor((by - reach) / cell)), j1 = Math.min(ny - 1, Math.ceil((by + reach) / cell));
    for (let j = j0; j <= j1; j++) {
      const dy = j * cell - by, dy2 = dy * dy;
      for (let i = i0; i <= i1; i++) { const dx = i * cell - bx; f[j * nx + i] += r2 / (dx * dx + dy2 + 1e-3); }
    }
  }
  ctx.beginPath();
  const lerpE = (a, b) => (1 - a) / (b - a);
  for (let j = 0; j < ny - 1; j++) {
    let runStart = -1;
    for (let i = 0; i < nx - 1; i++) {
      const a = f[j * nx + i], b = f[j * nx + i + 1], c = f[(j + 1) * nx + i + 1], d = f[(j + 1) * nx + i];
      const x = i * cell, y = j * cell;
      const code = (a >= 1 ? 8 : 0) | (b >= 1 ? 4 : 0) | (c >= 1 ? 2 : 0) | (d >= 1 ? 1 : 0);
      if (code === 15) { if (runStart < 0) runStart = x; continue; }
      if (runStart >= 0) { ctx.rect(runStart, y, x - runStart, cell); runStart = -1; }
      if (code === 0) continue;
      const T = [x + cell * lerpE(a, b), y], Rr = [x + cell, y + cell * lerpE(b, c)], Bt = [x + cell * lerpE(d, c), y + cell], L = [x, y + cell * lerpE(a, d)];
      const TL = [x, y], TR = [x + cell, y], BR = [x + cell, y + cell], BL = [x, y + cell];
      let polys;
      const center = (a + b + c + d) / 4 >= 1;
      switch (code) {
        case 1: polys = [[L, Bt, BL]]; break;
        case 2: polys = [[Bt, Rr, BR]]; break;
        case 3: polys = [[L, Rr, BR, BL]]; break;
        case 4: polys = [[T, TR, Rr]]; break;
        case 5: polys = center ? [[L, T, TR, Rr, Bt, BL]] : [[T, TR, Rr], [L, Bt, BL]]; break;
        case 6: polys = [[T, TR, BR, Bt]]; break;
        case 7: polys = [[L, T, TR, BR, BL]]; break;
        case 8: polys = [[TL, T, L]]; break;
        case 9: polys = [[TL, T, Bt, BL]]; break;
        case 10: polys = center ? [[TL, T, Rr, BR, Bt, L]] : [[TL, T, L], [Rr, BR, Bt]]; break;
        case 11: polys = [[TL, T, Rr, BR, BL]]; break;
        case 12: polys = [[TL, TR, Rr, L]]; break;
        case 13: polys = [[TL, TR, Rr, Bt, BL]]; break;
        case 14: polys = [[TL, TR, BR, Bt, L]]; break;
      }
      for (const p of polys) { ctx.moveTo(p[0][0], p[0][1]); for (let k = 1; k < p.length; k++) ctx.lineTo(p[k][0], p[k][1]); ctx.closePath(); }
    }
    if (runStart >= 0) ctx.rect(runStart, j * cell, (nx - 1) * cell - runStart, cell);
  }
  ctx.fill('nonzero');
}
function sceneC(ctx, t) {
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  if (t > B(19.4)) graphChrome(ctx, t);
  ctx.fillStyle = ACC;
  metaballs(ctx, ballsC(t));
  const lab = typed('Σ r² / d² ≥ 1', t, B(16.7), 0.25, B(CUE.pour) - 0.1, 0.15);
  if (lab) mono(ctx, lab, 120, 1010, 52, 'rgba(238,234,226,0.72)');
}

// ======================================================================
// SCENE D — the graph editor: four eases, one per beat (beats 20–24).
// ======================================================================
const PAPA = a => `rgba(238,234,226,${a})`;
function graphChrome(ctx, t) {
  const { x, y, w, h } = GRAPH;
  const dr = E.outCubic(ramp(t, B(19.4), B(CUE.curve) + 0.1));
  ctx.strokeStyle = PAPA(0.42); ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x + w * dr, y);
  ctx.moveTo(x, y); ctx.lineTo(x, y - (h + 70) * dr);
  ctx.stroke();
  ctx.setLineDash([8, 12]); ctx.strokeStyle = PAPA(0.26);
  ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + w * dr, y - h); ctx.stroke();
  ctx.setLineDash([]);
  const a = 0.6 * dr;
  mono(ctx, '0', x - 24, y + 14, 40, PAPA(a), 'right');
  mono(ctx, '1', x - 24, y - h + 14, 40, PAPA(a), 'right');
  mono(ctx, 't', x + w + 28, y + 14, 40, PAPA(a));
  mono(ctx, 'f(t)', x - 24, y - h - 60, 40, PAPA(a), 'right');
}
function sceneD(ctx, t) {
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  const k = clamp(Math.floor((t - B(CUE.curve) + 0.06) / (B(1) - B(0))), 0, 3);
  const tk = B(CUE.curve + k);
  const prev = SHOWCASE[Math.max(0, k - 1)].fn, cur = SHOWCASE[k].fn;
  const mixv = k === 0 ? 1 : spring(t - tk + 0.05, 3.6, 0.45);
  const fv = u => lerp(prev(u), cur(u), mixv);
  // smash zoom into the preview dot at the end of the bar
  const zm = E.inExpo(ramp(t, B(23.72), B(24)));
  const PX = 1690;
  const ride = ramp(t, tk + 0.04, tk + 0.04 + 0.8 * (B(1) - B(0)));
  const pv = fv(ride), py = GRAPH.y - GRAPH.h * pv;
  const z = lerp(1, 26, zm);
  ctx.save();
  ctx.translate(PX, py); ctx.scale(z, z); ctx.translate(-PX, -py);
  graphChrome(ctx, t);
  // curve
  const thick = lerp(25, 13, E.outCubic(ramp(t, B(CUE.curve), B(CUE.curve) + 0.3)));
  ctx.strokeStyle = ACC; ctx.lineWidth = thick; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= 200; i++) { const u = i / 200, [x, y] = curvePt(fv, u); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
  // playhead, leader, track
  const [dx, dy] = curvePt(fv, ride);
  ctx.strokeStyle = PAPA(0.22); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(dx, GRAPH.y); ctx.lineTo(dx, GRAPH.y - GRAPH.h - 70); ctx.stroke();
  ctx.setLineDash([4, 9]); ctx.strokeStyle = PAPA(0.32);
  ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(PX, py); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = PAPA(0.14);
  ctx.beginPath(); ctx.moveTo(PX, GRAPH.y + 30); ctx.lineTo(PX, GRAPH.y - GRAPH.h - 120); ctx.stroke();
  ctx.fillStyle = PAPER; disc(ctx, dx, dy, 16);
  ctx.fillStyle = ACC; disc(ctx, dx, dy, 10);
  // preview dot with velocity squash & stretch
  const h = 1 / 240;
  const vy = ((GRAPH.y - GRAPH.h * fv(ramp(t + h, tk + 0.04, tk + 0.04 + 0.8 * (B(1) - B(0))))) - (GRAPH.y - GRAPH.h * fv(ramp(t - h, tk + 0.04, tk + 0.04 + 0.8 * (B(1) - B(0)))))) / (2 * h);
  const st = 1 + Math.min(0.6, Math.abs(vy) / 4000);
  ctx.fillStyle = ACC; blob(ctx, PX, py, 50, 1 / Math.sqrt(st), st, 0);
  ctx.restore();
  // label: slot-machine roll between ease names, period = the dot
  const LS = 190, base = GRAPH.y - 50, right = GRAPH.x + GRAPH.w;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, base - LS * 0.85, W, LS * 0.85 + 30); ctx.clip();
  for (let q = Math.max(0, k - 1); q <= k; q++) {
    const tq = B(CUE.curve + q);
    let dyq;
    // lands on the beat: the old name leaves just before, the new one springs in through it
    if (q === k) dyq = (1 - spring(t - tq + 0.09, 4.2, 0.62)) * LS * 1.15;
    else dyq = -E.inCubic(ramp(t, B(CUE.curve + k) - 0.13, B(CUE.curve + k) - 0.03)) * LS * 1.15;
    drawWordDot(ctx, SHOWCASE[q].name, right, base + dyq, LS, { wdth: 100, wght: 820 }, PAPER, ACC, 'right');
  }
  ctx.restore();
  mono(ctx, `${SHOWCASE[k].label}(t)`, right, GRAPH.y + 84, 46, PAPA(0.7), 'right');
  if (zm > 0) { ctx.fillStyle = ACC; ctx.globalAlpha = ramp(zm, 0.92, 1); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
}
// word + accent period, aligned by its right edge or centred
function drawWordDot(ctx, str, x, base, size, axes, color, dotColor, align = 'center', per = {}) {
  const L = layout(str, axes, size, -0.01);
  const stemG = shape('ı', axes.wdth, axes.wght), stem = ((stemG.xmax - stemG.xmin) / 1000) * size;
  const r = stem * 0.6, gapDot = stem * 0.35;
  const total = L.width + gapDot + 2 * r;
  const left = align === 'right' ? x - total : align === 'left' ? x : x - total / 2;
  ctx.fillStyle = color;
  L.items.forEach((it, i) => fillGlyph(ctx, it, left, base, size, per.glyph ? per.glyph(i) : {}));
  ctx.fillStyle = dotColor;
  const dot = per.dot ? per.dot(left + L.width + gapDot + r, base - r, r) : { x: left + L.width + gapDot + r, y: base - r, sx: 1, sy: 1 };
  blob(ctx, dot.x, dot.y, r, dot.sx, dot.sy, 0);
  return { left, width: total, r };
}

// ======================================================================
// SCENE E — four word slams, one per beat (beats 24–28).
// ======================================================================
let liquidCanvas = null;
function fitSize(str, axes, capTarget, maxW) {
  const L = layout(str, axes, 1000, -0.01);
  return Math.min(capTarget / CAP, (maxW / (L.width / 1000 + 0.28)));
}
function sceneE(ctx, t) {
  const k = clamp(Math.floor((t - B(24)) / (B(1) - B(0))), 0, 3);
  const t0 = B(CUE.slams[k]), u = t - t0;
  const word = WORDS[k];
  const base = 735;
  if (k === 0) {
    ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
    const axes = i => ({ wdth: lerp(70, 150, spring(u + 0.06 - 0.015 * i, 3.4, 0.5)), wght: 900 });
    const size = fitSize(word, { wdth: 150, wght: 900 }, 400, 1700);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, base + 1); ctx.clip();
    const L = layout(word, axes, size, -0.01);
    const stem = ((shape('ı', 150, 900).xmax - shape('ı', 150, 900).xmin) / 1000) * size, r = stem * 0.6;
    const left = CX - (L.width + stem * 0.35 + 2 * r) / 2;
    ctx.fillStyle = INK;
    L.items.forEach((it, i) => fillGlyph(ctx, it, left, base, size, { dy: (1 - spring(u + 0.07 - 0.018 * i, 4.2, 0.55)) * size * 0.8 }));
    ctx.restore();
    const dt = u - 0.12;
    const dy = dt < 0 ? -900 * (dt / 0.16) ** 2 : 0;
    const amt = dt >= 0 ? 0.5 * Math.exp(-dt / 0.05) * Math.cos(dt * 40) : 0;
    ctx.fillStyle = ACC; blob(ctx, left + L.width + stem * 0.35 + r, base - r * (1 - amt) + dy, r, 1 + amt, 1 - amt, 0);
  } else if (k === 1) {
    ctx.fillStyle = ACC; ctx.fillRect(0, 0, W, H);
    const axes = { wdth: 125, wght: 900 };
    const size = fitSize(word, axes, 520, 1200) * lerp(1.35, 1, spring(u, 2.6, 0.5));
    const L = layout(word, axes, size, -0.01);
    const stem = ((shape('ı', 125, 900).xmax - shape('ı', 125, 900).xmin) / 1000) * size, r = stem * 0.6;
    const left = CX - (L.width + stem * 0.35 + 2 * r) / 2;
    const bl = 790;
    const ang = lerp(-2.4, -0.7, E.inOutCubic(clamp(u / 0.45))), depth = 90 * spring(u, 2.4, 0.6);
    const layers = 36;
    for (let s = layers; s >= 0; s--) {
      const ox = Math.cos(ang) * depth * (s / layers), oy = Math.sin(ang) * depth * (s / layers) * -1;
      ctx.fillStyle = s === 0 ? INK : PAPER;
      ctx.beginPath();
      for (const it of L.items) pathGlyph(ctx, it.g, left + it.x + ox, bl + oy, size);
      ctx.moveTo(left + L.width + stem * 0.35 + 2 * r + ox, bl - r + oy);
      ctx.arc(left + L.width + stem * 0.35 + r + ox, bl - r + oy, r, 0, TAU);
      ctx.fill();
    }
  } else if (k === 2) {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
    const axes = { wdth: 100, wght: 900 };
    const size = fitSize(word, axes, 400, 1640);
    if (!liquidCanvas) { liquidCanvas = document.createElement('canvas'); liquidCanvas.width = W; liquidCanvas.height = 700; }
    const lc = liquidCanvas.getContext('2d');
    lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, W, 700);
    const bl = 520;
    drawWordDot(lc, word, CX, bl, size, axes, ACC, ACC, 'center', {
      glyph: i => ({ sy: 1 + 0.12 * wobble(u - 0.03 * i, 3, 0.25) }),
      dot: (x, y, r) => ({ x, y: y - 160 * Math.max(0, wobble(u - 0.1, 2.2, 0.18)), sx: 1, sy: 1 }),
    });
    const A = lerp(48, 7, E.outCubic(clamp(u / 0.3))), strip = 4;
    for (let y = 0; y < 700; y += strip) {
      const off = A * Math.sin(y / 46 + u * 16) + 0.4 * A * Math.sin(y / 17 - u * 23);
      ctx.drawImage(liquidCanvas, 0, y, W, strip, off, 735 - bl + y - 0, W, strip);
    }
  } else {
    ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
    const axes = { wdth: 112, wght: 900 };
    const size = fitSize(word, axes, 400, 1640);
    const step = Math.floor(clamp((t - B(27)) / (B(0.25) - B(0)), 0, 3.999));
    const g = t >= B(27) ? step : -1;
    const jx = g >= 0 ? [0, 46, -38, 24][g] * Math.exp(-((t - B(27 + g * 0.25)) / 0.05)) : 0;
    ctx.save(); ctx.translate(jx, 0);
    const meter = i => 1 + 0.32 * Math.abs(noise1(t * 22 + i * 3.7, 11)) * Math.exp(-u / 0.7);
    const res = drawWordDot(ctx, word, CX, base, size, axes, INK, ACC, 'center', {
      glyph: i => ({ sy: meter(i) }),
      dot: (x, y, r) => { const p = 1 + 0.25 * Math.exp(-((t - B(27 + Math.max(0, g) * 0.25)) / 0.06)) * (g >= 0 ? 1 : 0); return { x, y: base - r * p, sx: p, sy: p }; },
    });
    ctx.restore();
    // waveform under the word (the actual score's envelope is not needed: it's a drawing)
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let x = res.left; x <= res.left + res.width; x += 6) {
      const a = 34 * Math.abs(noise1(x * 0.02 + t * 9, 3)) * Math.sin(x * 0.11 + t * 40);
      x === res.left ? ctx.moveTo(x, base + 90 + a) : ctx.lineTo(x, base + 90 + a);
    }
    ctx.stroke();
    // glitch slices on the stutter
    if (g >= 1) {
      const gd = t - B(27 + g * 0.25);
      if (gd < 0.07) {
        const img = ctx.getImageData(0, 300, W, 460);
        ctx.putImageData(img, (g % 2 ? -1 : 1) * 60, 300, 0, 140 + g * 40, W, 70);
      }
    }
  }
}

// ======================================================================
// SCENE F — end card: the dot falls into the period of the name (beats 28–32).
// ======================================================================
function sceneF(ctx, t) {
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  const push = 1 + 0.03 * E.outCubic(ramp(t, B(CUE.end), B(32)));
  const [kx, ky] = shake(t, [[B(28), 10], [B(29), 6]]);
  ctx.save();
  ctx.translate(CX + kx, CY + ky); ctx.scale(push, push); ctx.translate(-CX, -CY);
  const axes = { wdth: 100, wght: 900 };
  const size = 400, base = 600;
  const L = layout('claude', axes, size, -0.012);
  const stemG = shape('ı', 100, 900), stem = ((stemG.xmax - stemG.xmin) / 1000) * size, r = stem * 0.62;
  const total = L.width + stem * 0.35 + 2 * r, left = CX - total / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, base + 1); ctx.clip();
  ctx.fillStyle = PAPER;
  const u = t - B(CUE.end);
  L.items.forEach((it, i) => fillGlyph(ctx, it, left, base, size, { dy: (1 - spring(u + 0.04 - 0.028 * i, 2.6, 0.55)) * size * 0.85 }));
  ctx.restore();
  // the dot: halving bounce rhythm, mirrored from the opening
  const px = left + L.width + stem * 0.35 + r, ground = base - r;
  const hits = [CUE.end + 0.0, ...CUE.endBounces].map(B);
  let y, impact = null;
  const c = 0.04;
  if (t < hits[1] - c / 2) { const d = hits[1] - c / 2 - t, g = 3600; y = ground - 0.5 * g * d * d - 0; }
  else {
    y = ground;
    for (let i = 1; i < hits.length; i++) {
      const ta = hits[i], tb = hits[i + 1] ?? ta + 0.06, cc = Math.min(c, (tb - ta) * 0.3);
      if (t < ta + cc / 2) { impact = { t: ta, c: cc, v: 1500 / i }; break; }
      if (i === hits.length - 1) break;
      if (t < tb - cc / 2) { const T = tb - ta; y = flight(t, ta + cc / 2, tb - cc / 2, px, ground, px, ground, (3600 * T * T) / 8).y; break; }
    }
  }
  let sx = 1, sy = 1;
  if (impact) { const a = Math.min(0.5, impact.v / 3600) * Math.sin(Math.PI * clamp((t - impact.t + impact.c / 2) / impact.c)); sx = 1 + a; sy = 1 - a; y += r * a; }
  else if (t < hits[1]) { const v = 3600 * Math.max(0, hits[1] - c / 2 - t); const s = 1 + Math.min(0.6, v / 3000); sx = 1 / Math.sqrt(s); sy = s; }
  ctx.fillStyle = ACC; blob(ctx, px, y, r, sx, sy, 0);
  // signature line
  const line = typed('motion designer · every frame is f(t)', t, B(29.2), 0.5);
  mono(ctx, line, CX, base + 130, 58, PAPA(0.78), 'center');
  ctx.restore();
}

// ======================================================================
export function draw(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  if (t < B(CUE.grid)) sceneA(ctx, t);
  else if (t < B(CUE.liquid)) sceneB(ctx, t);
  else if (t < B(CUE.curve)) sceneC(ctx, t);
  else if (t < B(24)) sceneD(ctx, t);
  else if (t < B(CUE.end)) sceneE(ctx, t);
  else sceneF(ctx, t);
}
