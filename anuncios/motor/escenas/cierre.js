// Cierre de marca: el punto aterriza en la cabeza clara del isotipo original, el isotipo se revela desde
// ahí, sube el botón con el CTA y después el nombre. Logo siempre con escala uniforme ≤ 100 % y sobre marfil.
import { lerp, ramp, E, spring, bump, TAU } from '../nucleo/lib.js';
import { rrect, mono, cachedLayout, text } from '../nucleo/dibujo.js';
import { fillGlyph } from '../nucleo/tipo.js';
import { CX, H, IVORY, INK, LEAF, ink, LOGO } from '../nucleo/marca.js';
import { B, LOGO_IMG } from '../nucleo/reloj.js';

// cfg (tiempos en beats):
//   ev: { isotipo, cta, nombre, empujes[], fin }
//   escala: escala del logo (≤ 1) · yLogo: dónde queda el borde superior del contenido del logo
//   cta: { texto(), y, w, h, size } · anclaZoom: y del acercamiento lento final
//   marcarGratis: true mientras «gratis» no esté confirmado (lo marca como pendiente en pantalla)
//   nota (opcional): { texto, y, size, ev } una línea bajo el botón que sube desde su línea base en el beat ev
export function crearCierre(cfg) {
  const { ev } = cfg, LOGO_S = cfg.escala, C = LOGO.contenido, HEAD_L = LOGO.cabeza;
  const LOGO_X = CX - ((C.x0 + C.x1) / 2) * LOGO_S, LOGO_Y = cfg.yLogo - C.y0 * LOGO_S;
  const ISO_DX = CX - (LOGO_X + ((C.x0 + LOGO.isotipoX1) / 2) * LOGO_S); // isotipo centrado mientras no está el nombre
  // dónde aterriza el punto: [x, y, radio] de la cabeza clara en pantalla
  const HEAD_SCREEN = [LOGO_X + HEAD_L.x * LOGO_S + ISO_DX, LOGO_Y + HEAD_L.y * LOGO_S, HEAD_L.r * LOGO_S];
  const isoShift = t => ISO_DX * (1 - spring(t - B(ev.nombre) + 0.05, 2.4, 0.78));

  function dibujarCierre(ctx, t) {
    const tI = B(ev.isotipo);
    if (t < tI || !LOGO_IMG) return;
    const push = 1 + 0.02 * E.outCubic(ramp(t, tI, B(ev.fin)));
    ctx.save();
    ctx.translate(CX, cfg.anclaZoom); ctx.scale(push, push); ctx.translate(-CX, -cfg.anclaZoom);
    const w = LOGO.w * LOGO_S, h = LOGO.h * LOGO_S;
    // el logo se mueve como una sola pieza: centrado (solo isotipo) → a su lugar cuando sube el nombre
    const off = t < B(ev.nombre) - 0.05 ? ISO_DX : isoShift(t);
    const R = lerp(HEAD_SCREEN[2], 380, E.outCubic(ramp(t, tI + 0.02, tI + 0.6)));
    ctx.save(); ctx.translate(off, 0);
    ctx.beginPath(); ctx.arc(HEAD_SCREEN[0] - ISO_DX, HEAD_SCREEN[1], R, 0, TAU); ctx.clip(); // se revela desde la cabeza clara
    ctx.beginPath(); ctx.rect(0, 0, LOGO_X + LOGO.corte * LOGO_S, H); ctx.clip();
    ctx.drawImage(LOGO_IMG, LOGO_X, LOGO_Y, w, h); ctx.restore();
    // nombre: sube desde su propia línea base mientras el logo se acomoda
    const tN = B(ev.nombre);
    if (t > tN) {
      const dy = (1 - spring(t - tN - 0.06, 2.6, 0.72)) * 80;
      ctx.save(); ctx.translate(off, 0); ctx.beginPath();
      ctx.rect(LOGO_X + LOGO.corte * LOGO_S, LOGO_Y + (C.y0 - 6) * LOGO_S, w, (C.y1 - C.y0 + 12) * LOGO_S); ctx.clip();
      ctx.drawImage(LOGO_IMG, LOGO_X, LOGO_Y + dy, w, h); ctx.restore();
    }
    // botón CTA
    const tc = B(ev.cta);
    if (t > tc) {
      const bw = cfg.cta.w * spring(t - tc, 2.3, 0.72), bh = cfg.cta.h * Math.min(1, spring(t - tc, 3.2, 0.8)), by = cfg.cta.y;
      ctx.fillStyle = INK; ctx.beginPath(); rrect(ctx, CX - bw / 2, by - bh / 2, bw, bh, bh / 2); ctx.fill();
      const label = cfg.cta.texto(), size = cfg.cta.size;
      const L = cachedLayout(label, 600, size), arrowW = 56, total = L.width + 26 + arrowW;
      const x0 = CX - total / 2, base = by + size * 0.36;
      const tu = spring(t - tc - 0.22, 3, 0.7);
      ctx.save(); ctx.beginPath(); rrect(ctx, CX - bw / 2, by - bh / 2, bw, bh, bh / 2); ctx.clip();
      ctx.fillStyle = IVORY;
      for (const it of L.items) fillGlyph(ctx, it, x0, base + (1 - tu) * 90, size);
      // flecha: empuja hacia la derecha en los beats del final
      const nudge = ev.empujes.reduce((s, b) => s + 14 * bump(t, B(b), B(b) + 0.36, 0.3), 0);
      text(ctx, '→', x0 + L.width + 26 + nudge, base + (1 - tu) * 90, size, 600, LEAF);
      // «gratis»: marcado como pendiente mientras no se confirme
      if (cfg.marcarGratis) {
        const gi = label.indexOf('gratis');
        const a = L.items[gi], b = L.items[gi + 5];
        ctx.setLineDash([8, 7]); ctx.strokeStyle = LEAF; ctx.lineWidth = 3;
        ctx.beginPath(); rrect(ctx, x0 + a.x - 8, base - size * 0.82 + (1 - tu) * 90, b.x + b.w - a.x + 16, size * 1.08, 10); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.restore();
      if (cfg.marcarGratis && t > tc + 0.3) mono(ctx, '«gratis» · pendiente de confirmar', CX, by + bh / 2 + 54, 26, ink(0.62), 'center', 600);
    }
    if (cfg.nota && t > B(cfg.nota.ev)) {
      const { texto, y, size } = cfg.nota, u = spring(t - B(cfg.nota.ev), 2.8, 0.72);
      ctx.save(); ctx.beginPath(); ctx.rect(0, y - size * 1.1, CX * 2, size * 1.45); ctx.clip();
      text(ctx, texto, CX, y + (1 - u) * size * 1.2, size, 500, ink(0.72), 'center');
      ctx.restore();
    }
    ctx.restore();
  }
  return { HEAD_SCREEN, ISO_DX, dibujarCierre };
}
