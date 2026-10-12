// El producto con pantallas reales sueltas: el punto se estira en un marco verde que muestra, un paso
// por vez, recortes de capturas reales en el orden real del flujo. El marco toma el tamaño de cada
// recorte. Si dos pasos seguidos salen de la misma captura, la cámara se mueve dentro de ella; si no,
// la pantalla nueva entra desde abajo y la anterior sale por arriba. Una cabecera nombra cada paso.
// Nunca se dibuja interfaz: solo recortes, cámara y transiciones entre capturas reales.
import { lerp, ramp, E, spring } from '../nucleo/lib.js';
import { rrect, text } from '../nucleo/dibujo.js';
import { W, INK, LEAF, ink } from '../nucleo/marca.js';
import { B, CAPS } from '../nucleo/reloj.js';
import { R_DOT } from './punto.js';

// cfg (tiempos en beats; recortes en px de la captura, [x0, y0, x1, y1]):
//   centro: [x, y] del marco en pantalla · max: [w, h] tamaño máximo · escalaMax: px de pantalla por px de captura
//   ev: { marco, abre, recoge, fuera }   el punto se vuelve marco · se abre · se recoge · sale la cabecera
//   pasos: [{ b, captura, recorte, acerca?: { b, recorte }, corte?, rotulo }]   acerca: la cámara se acerca dentro
//          del paso · corte: entra como pantalla nueva aunque sea de la misma captura (no recorre lo que hay entre medio)
//   fondo: color detrás de las capturas · cabecera: { size, base, x, peso }
export function crearPantallas(cfg) {
  const FC = cfg.centro, P = cfg.pasos, ev = cfg.ev;
  const escala = r => Math.min(cfg.escalaMax, cfg.max[0] / (r[2] - r[0]), cfg.max[1] / (r[3] - r[1]));
  const tam = r => { const s = escala(r); return [(r[2] - r[0]) * s, (r[3] - r[1]) * s]; };
  const llegada = (t, b) => spring(t - B(b) + 0.12, 2.7, 0.82); // la cámara se adelanta un poco al beat
  // recorte del paso i en el instante t, con su acercamiento
  const propio = (i, t) => { const p = P[i]; if (!p.acerca) return p.recorte; const u = spring(t - B(p.acerca.b), 2.6, 0.8); return p.recorte.map((v, k) => lerp(v, p.acerca.recorte[k], u)); };
  const final = i => (P[i].acerca ? P[i].acerca.recorte : P[i].recorte);
  const pasoEn = t => { let k = 0; P.forEach((p, i) => { if (t >= B(p.b) - 0.12) k = i; }); return k; };

  // qué se ve en t: el paso actual y, durante la transición, el anterior
  function estado(t) {
    const i = pasoEn(t), p = P[i];
    if (i === 0) { const r = propio(0, t); return { i, r, tam: tam(r), u: 1 }; }
    const u = llegada(t, p.b), prev = final(i - 1);
    if (P[i - 1].captura === p.captura && !p.corte) { // misma captura: la cámara viaja de un recorte al otro
      const dest = propio(i, t), r = prev.map((v, k) => lerp(v, dest[k], u));
      return { i, r, tam: tam(r), u: 1 };
    }
    const a = tam(prev), b = tam(propio(i, t));
    return { i, r: propio(i, t), prev, tam: [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], u };
  }

  function frameState(t) {
    const r = R_DOT, e = estado(t);
    let w = lerp(2 * r, e.tam[0], spring(t - B(ev.marco) - 0.05, 1.9, 0.64));
    let h = lerp(2 * r, e.tam[1], spring(t - B(ev.marco) - 0.13, 1.9, 0.62));
    let open = E.outCubic(ramp(t, B(ev.abre), B(ev.abre) + 0.5));
    const tc = B(ev.recoge);
    if (t > tc - 0.25) {
      open *= 1 - E.inCubic(ramp(t, tc - 0.25, tc));
      const k = E.inBack(ramp(t, tc, tc + 0.28));
      w = lerp(w, 2 * r, k); h = lerp(h, 2 * r, k);
    }
    return { w, h, rad: Math.min(Math.min(w, h) / 2, lerp(r, 28, ramp(Math.min(w, h), 2 * r, 300))), open, e };
  }
  const dibujarRecorte = (ctx, i, r, cx, cy) => {
    const im = CAPS[P[i].captura]; if (!im) return;
    const [w, h] = tam(r);
    ctx.drawImage(im, r[0], r[1], r[2] - r[0], r[3] - r[1], cx - w / 2, cy - h / 2, w, h);
  };
  function dibujarMarco(ctx, t) {
    if (t < B(ev.marco) || t > B(ev.recoge) + 0.3) return null;
    const f = frameState(t), x = FC[0] - f.w / 2, y = FC[1] - f.h / 2;
    ctx.fillStyle = LEAF; ctx.beginPath(); rrect(ctx, x, y, f.w, f.h, f.rad); ctx.fill();
    if (f.open > 0) {
      const iw = f.w * f.open, ih = f.h * f.open, e = f.e;
      ctx.save(); ctx.beginPath(); rrect(ctx, FC[0] - iw / 2, FC[1] - ih / 2, iw, ih, f.rad * f.open + 2); ctx.clip();
      ctx.fillStyle = cfg.fondo; ctx.fillRect(x, y, f.w, f.h);
      if (e.prev && e.u < 1) { // la pantalla anterior sale por arriba y la nueva entra desde abajo
        const d = f.h * 0.5 + tam(e.r)[1] * 0.5 + 24;
        dibujarRecorte(ctx, e.i - 1, e.prev, FC[0], FC[1] - e.u * d);
        dibujarRecorte(ctx, e.i, e.r, FC[0], FC[1] + (1 - e.u) * d);
      } else dibujarRecorte(ctx, e.i, e.r, FC[0], FC[1]);
      ctx.restore();
      if (f.open > 0.98) { ctx.strokeStyle = ink(0.12); ctx.lineWidth = 2; ctx.beginPath(); rrect(ctx, x + 1, y + 1, f.w - 2, f.h - 2, f.rad); ctx.stroke(); }
    }
    return f;
  }
  // cabecera: cada rótulo entra rodando desde abajo y sale hacia arriba
  function dibujarRotulos(ctx, t) {
    const { size, base, x: tx, peso } = cfg.cabecera;
    if (!(t > B(P[0].b) - 0.15 && t < B(ev.fuera) + 0.2)) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.0, W, size * 1.32); ctx.clip();
    P.forEach((p, i) => {
      const tin = B(p.b), tout = i < P.length - 1 ? B(P[i + 1].b) : B(ev.fuera);
      if (t < tin - 0.12 || t > tout + 0.1) return;
      const dyIn = (1 - spring(t - tin + 0.1, 3.6, 0.66)) * size * 1.25;
      const dyOut = -E.inCubic(ramp(t, tout - 0.12, tout)) * size * 1.25;
      text(ctx, p.rotulo, tx, base + dyIn + dyOut, size, peso, INK);
    });
    ctx.restore();
  }
  return { FC, frameState, dibujarMarco, dibujarRotulos, tam };
}
