// Variable-font engine: bilinear interpolation of baked outlines over (wdth, wght).
import G from './glyphs.js';
import { clamp } from './lib.js';

export const XH = G.xHeight, CAP = G.capHeight;
const WD = G.wdth, WG = G.wght, NG = WG.length;

function cell(axis, v) {
  v = clamp(v, axis[0], axis[axis.length - 1]);
  let i = 0;
  while (i < axis.length - 2 && v > axis[i + 1]) i++;
  return [i, (v - axis[i]) / (axis[i + 1] - axis[i])];
}

// Returns { ops, pts (em*1000, y down), adv, xmin, xmax, ymin } for one glyph instance.
export function shape(ch, wdth, wght) {
  const g = G.glyphs[ch];
  if (!g) throw new Error('glyph not baked: ' + ch);
  const [i, fi] = cell(WD, wdth), [j, fj] = cell(WG, wght);
  const A = g.pts[i * NG + j], Bq = g.pts[i * NG + j + 1], C = g.pts[(i + 1) * NG + j], D = g.pts[(i + 1) * NG + j + 1];
  const wa = (1 - fi) * (1 - fj), wb = (1 - fi) * fj, wc = fi * (1 - fj), wd = fi * fj;
  const n = A.length, pts = new Float32Array(n);
  let xmin = Infinity, xmax = -Infinity, ymin = Infinity;
  for (let k = 0; k < n; k++) {
    const v = A[k] * wa + Bq[k] * wb + C[k] * wc + D[k] * wd;
    pts[k] = v;
    if (k & 1) { if (v < ymin) ymin = v; } else { if (v < xmin) xmin = v; if (v > xmax) xmax = v; }
  }
  const adv = g.adv[i * NG + j] * wa + g.adv[i * NG + j + 1] * wb + g.adv[(i + 1) * NG + j] * wc + g.adv[(i + 1) * NG + j + 1] * wd;
  return { ch, ops: g.ops, pts, adv, xmin, xmax, ymin };
}

// Appends a glyph outline to the current path; origin = glyph origin on the baseline.
export function pathGlyph(ctx, g, x, y, size) {
  const s = size / 1000, p = g.pts, ops = g.ops;
  let k = 0;
  for (let o = 0; o < ops.length; o++) {
    switch (ops[o]) {
      case 'M': ctx.moveTo(x + p[k] * s, y + p[k + 1] * s); k += 2; break;
      case 'L': ctx.lineTo(x + p[k] * s, y + p[k + 1] * s); k += 2; break;
      case 'Q': ctx.quadraticCurveTo(x + p[k] * s, y + p[k + 1] * s, x + p[k + 2] * s, y + p[k + 3] * s); k += 4; break;
      case 'C': ctx.bezierCurveTo(x + p[k] * s, y + p[k + 1] * s, x + p[k + 2] * s, y + p[k + 3] * s, x + p[k + 4] * s, y + p[k + 5] * s); k += 6; break;
      case 'Z': ctx.closePath(); break;
    }
  }
}

// Lays out a string with per-letter axes: axes(i) -> {wdth, wght}. Units: px.
export function layout(str, axes, size, track = 0) {
  const items = [];
  let x = 0;
  const chars = [...str];
  chars.forEach((ch, i) => {
    const a = typeof axes === 'function' ? axes(i) : axes;
    const g = shape(ch, a.wdth, a.wght);
    items.push({ ch, g, x, w: (g.adv / 1000) * size, cx: x + ((g.xmin + g.xmax) / 2000) * size });
    x += (g.adv / 1000) * size + track * size;
  });
  return { items, width: x - track * size, size };
}

// Fills one laid-out glyph with an optional per-glyph transform around its baseline centre.
export function fillGlyph(ctx, item, ox, baseline, size, tr = {}) {
  const { dx = 0, dy = 0, sx = 1, sy = 1, rot = 0 } = tr;
  ctx.save();
  ctx.translate(ox + item.cx + dx, baseline + dy);
  if (rot) ctx.rotate(rot);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.beginPath();
  pathGlyph(ctx, item.g, item.x - item.cx, 0, size);
  ctx.fill();
  ctx.restore();
}
