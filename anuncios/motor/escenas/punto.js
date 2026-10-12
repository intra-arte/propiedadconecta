// El punto verde, protagonista de todos los anuncios de la marca: es la cabeza clara del isotipo.
// Cada anuncio define su trayectoria; esta escena lo dibuja con estiramiento por velocidad,
// aplastamiento en los impactos y, si se pide, un aro marfil que lo separa de fondos oscuros.
import { clamp, ramp } from '../nucleo/lib.js';
import { blob } from '../nucleo/dibujo.js';
import { LEAF, ivo } from '../nucleo/marca.js';

export const R_DOT = 44; // radio del punto en pantalla

// trayectoria(t) → null (no se ve) o { x, y, r, sx?, sy?, stretch?, impact?, fade? }
//   stretch: se estira según su velocidad · impact: segundo del impacto (se aplasta) · fade: opacidad
// estirarHasta: antes de ese segundo se estira siempre que no esté en un impacto
// aro: [desde, duración] en segundos: el aro marfil se apaga en ese tramo
export function dibujarPunto(ctx, t, trayectoria, { estirarHasta = -Infinity, aro = null } = {}) {
  const p = trayectoria(t);
  if (!p) return;
  let { x, y, r, sx = 1, sy = 1 } = p, rot = 0;
  if (p.stretch || (t < estirarHasta && !p.impact)) { // estiramiento según la velocidad
    const h = 1 / 240, a = trayectoria(t - h), b = trayectoria(t + h);
    if (a && b) {
      const vx = (b.x - a.x) / (2 * h), vy = (b.y - a.y) / (2 * h), sp = Math.hypot(vx, vy);
      const par = 1 + Math.min(0.6, sp / 3200); sx = par; sy = 1 / Math.sqrt(par); rot = Math.atan2(vy, vx);
    }
  }
  if (p.impact) { const u = clamp((t - p.impact + 0.035) / 0.07); const a = 0.45 * Math.sin(Math.PI * u); sx = 1 + a; sy = 1 - a; rot = 0; y += r * a; }
  ctx.globalAlpha = p.fade ?? 1;
  if (aro) {
    const rim = 1 - ramp(t, aro[0], aro[0] + aro[1]);
    if (rim > 0 && t > 0) { ctx.fillStyle = ivo(rim); blob(ctx, x, y, r + 5, sx, sy, rot); }
  }
  ctx.fillStyle = LEAF; blob(ctx, x, y, r, sx, sy, rot);
  ctx.globalAlpha = 1;
}
