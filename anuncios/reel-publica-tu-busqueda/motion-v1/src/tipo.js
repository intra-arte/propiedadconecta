// Motor tipográfico: interpolación lineal de contornos horneados sobre el eje wght de Outfit.
// Adaptado del showreel (que interpolaba dos ejes) a una sola dimensión.
import G from './glifos.js';
import { clamp } from './lib.js';

export const XH = G.xHeight, CAP = G.capHeight;
const WG = G.wght;

function cell(v) {
  v = clamp(v, WG[0], WG[WG.length - 1]);
  let i = 0;
  while (i < WG.length - 2 && v > WG[i + 1]) i++;
  return [i, (v - WG[i]) / (WG[i + 1] - WG[i])];
}

// { ops, pts (em*1000, y hacia abajo), adv, xmin, xmax, ymin, ymax }
export function shape(ch, wght) {
  const g = G.glyphs[ch];
  if (!g) throw new Error('glifo no horneado: ' + ch);
  const [i, f] = cell(wght);
  const A = g.pts[i], B = g.pts[i + 1], n = A.length, pts = new Float32Array(n);
  let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
  for (let k = 0; k < n; k++) {
    const v = A[k] + (B[k] - A[k]) * f;
    pts[k] = v;
    if (k & 1) { if (v < ymin) ymin = v; if (v > ymax) ymax = v; } else { if (v < xmin) xmin = v; if (v > xmax) xmax = v; }
  }
  return { ch, ops: g.ops, pts, adv: g.adv[i] + (g.adv[i + 1] - g.adv[i]) * f, xmin, xmax, ymin, ymax };
}

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

// Compone una cadena con peso por letra: wght(i) o número. Unidades: px.
export function layout(str, wght, size, track = 0) {
  const items = [];
  let x = 0;
  [...str].forEach((ch, i) => {
    const g = shape(ch, typeof wght === 'function' ? wght(i) : wght);
    items.push({ ch, g, x, w: (g.adv / 1000) * size, cx: x + ((g.xmin + g.xmax) / 2000) * size });
    x += (g.adv / 1000) * size + track * size;
  });
  return { items, width: Math.max(0, x - track * size), size };
}

export function fillGlyph(ctx, item, ox, baseline, size, tr = {}) {
  if (item.ch === ' ') return;
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

// Ancho de una cadena a un peso dado, en px.
export const measure = (str, wght, size, track = 0) => layout(str, wght, size, track).width;
