// Utilidades de dibujo compartidas por todas las escenas.
import { lerp, TAU } from './lib.js';
import { layout, fillGlyph } from './tipo.js';

export const MONO = 'JB, monospace';
export function blob(ctx, x, y, r, sx = 1, sy = 1, rot = 0) {
  if (r <= 0) return;
  ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(sx, sy);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore();
}
export function rrect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
export function mono(ctx, str, x, y, size, color, align = 'left', weight = 500) {
  ctx.font = `${weight} ${size}px ${MONO}`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color; ctx.fillText(str, x, y);
}
const LAYOUTS = new Map(); // caché de composiciones de peso fijo (valores deterministas)
export function cachedLayout(str, wght, size) {
  const k = str + '|' + wght + '|' + size;
  if (!LAYOUTS.has(k)) LAYOUTS.set(k, layout(str, wght, size));
  return LAYOUTS.get(k);
}
// texto Outfit de peso fijo; devuelve el ancho
export function text(ctx, str, x, y, size, wght, color, align = 'left') {
  const L = cachedLayout(str, wght, size);
  const x0 = align === 'center' ? x - L.width / 2 : align === 'right' ? x - L.width : x;
  ctx.fillStyle = color;
  for (const it of L.items) fillGlyph(ctx, it, x0, y, size);
  return L.width;
}
// sacudida de cámara amortiguada: hits = [[segundo, amplitud px], …]
export function shake(t, hits) {
  let x = 0, y = 0;
  for (const [ti, a] of hits) {
    const d = t - ti;
    if (d < 0 || d > 0.4) continue;
    y += a * Math.exp(-d / 0.06) * Math.sin(TAU * 18 * d);
    x += a * 0.4 * Math.exp(-d / 0.06) * Math.sin(TAU * 25 * d + 1);
  }
  return [x, y];
}
// vuelo en arco entre dos puntos, con altura h sobre la recta
export const arc = (u, P, Q, h) => [lerp(P[0], Q[0], u), lerp(P[1], Q[1], u) - h * 4 * u * (1 - u)];
