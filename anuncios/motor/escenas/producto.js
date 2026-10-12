// El producto real: el punto se estira en un marco verde que se abre sobre una «página» hecha con
// capturas reales apiladas. Una cabecera nombra cada tarjeta mientras la cámara la encuadra y el resto
// se atenúa; cada tarjeta puede pasar de vacía a llena (barrido entre dos capturas reales); al final la
// ventana se estrecha sobre un botón y el marco se recoge en el punto.
// Nunca se dibuja interfaz: solo recortes, cámara, foco y barridos entre capturas reales.
import { lerp, ramp, E, spring } from '../nucleo/lib.js';
import { rrect, text } from '../nucleo/dibujo.js';
import { W, INK, LEAF, ink } from '../nucleo/marca.js';
import { B, CAPS } from '../nucleo/reloj.js';
import { R_DOT } from './punto.js';

// cfg (todos los tiempos en beats; coordenadas de página en px de una captura de `unidad` de ancho):
//   marco: { x, y, w, h }                     rectángulo final del marco en pantalla
//   ev: { marco, abre, rotulos[], rellena[], boton, rotulosFuera, recoge }
//   pagina: { x0, x1, cx, h, bg, unidad }      columna útil de las capturas y color de fondo
//   desplazamientos: [px por captura]          dónde empieza cada captura en la página
//   lleno: [[captura, desde, hasta], …]        la página llena, con costuras en filas idénticas
//   tarjetas: [[desde, hasta], …]              la tarjeta que nombra cada rótulo
//   vacio: [[captura, desde, hasta], …]        la misma tarjeta, vacía (opcional, una por rótulo)
//   camara: { inicio, claves[], cerca, boton }  centro vertical al abrir, en cada rótulo y en el botón; zoom cercano
//   boton: { alto, zoom }                      la ventana se estrecha a `alto` y se acerca a `zoom`
//   barrido: [x0, x1], foco: [x0, x1]          recorrido del barrido y ancho del foco, en px de página
//   rotulos: [texto, …], cabecera: { size, base, x, peso }
export function crearProducto(cfg) {
  const FR = cfg.marco, FC = [FR.x + FR.w / 2, FR.y + FR.h / 2];
  const { ev, pagina: PAGE, desplazamientos: OFF, lleno: LLENO, tarjetas: TARJETAS, vacio: VACIO = [] } = cfg;
  const BOTON_Y = cfg.camara.boton, BOTON_H = cfg.boton.alto;
  const bgRGB = [1, 3, 5].map(i => parseInt(PAGE.bg.slice(i, i + 2), 16)).join(',');

  function frameState(t) {
    // abre: el punto se estira (ancho antes que alto) y luego el verde se abre
    const r = R_DOT;
    let w = lerp(2 * r, FR.w, spring(t - B(ev.marco) - 0.05, 1.9, 0.64));
    let h = lerp(2 * r, FR.h, spring(t - B(ev.marco) - 0.13, 1.9, 0.62));
    let open = E.outCubic(ramp(t, B(ev.abre), B(ev.abre) + 0.5));
    // se estrecha sobre el botón
    h = lerp(h, BOTON_H, E.inOutCubic(ramp(t, B(ev.boton) - 0.3, B(ev.boton) + 0.02)));
    // recoge: el contenido se cierra, el marco se encoge con anticipación y vuelve a ser el punto
    const tc = B(ev.recoge);
    if (t > tc - 0.25) {
      open *= 1 - E.inCubic(ramp(t, tc - 0.25, tc));
      const k = E.inBack(ramp(t, tc, tc + 0.28));
      w = lerp(w, 2 * r, k); h = lerp(h, 2 * r, k);
    }
    return { w, h, rad: Math.min(Math.min(w, h) / 2, lerp(r, 40, ramp(Math.min(w, h), 2 * r, 300))), open };
  }
  function camForm(t) {
    // la cámara se adelanta un poco al beat para que el encuadre llegue con la cabecera
    let cy = cfg.camara.inicio;
    const keys = ev.rotulos.map((b, i) => [B(b), cfg.camara.claves[i]]);
    keys.push([B(ev.boton) + 0.15, BOTON_Y]); // primero se estrecha la ventana, después baja
    for (const [tb, y] of keys) cy = lerp(cy, y, spring(t - tb + 0.12, 2.7, 0.82));
    return cy;
  }
  // acercamiento: la página completa al abrir, las tarjetas un poco más cerca, el botón mucho más cerca
  function kForm(t) {
    let k = FR.w / (PAGE.x1 - PAGE.x0);
    k = lerp(k, cfg.camara.cerca, spring(t - B(ev.rotulos[1]) + 0.12, 2.7, 0.82)); // cuando el título ya salió de cuadro
    k = lerp(k, cfg.boton.zoom, spring(t - B(ev.boton) - 0.03, 2.7, 0.82));
    return k;
  }
  function drawCap(ctx, i, y0, y1, map) {
    const im = CAPS[i]; if (!im) return;
    const sf = im.naturalWidth / PAGE.unidad; // cada captura se escala según su propio ancho
    const [X0, Y0] = map(PAGE.x0, y0), [X1, Y1] = map(PAGE.x1, y1);
    ctx.drawImage(im, PAGE.x0 * sf, (y0 - OFF[i]) * sf, (PAGE.x1 - PAGE.x0) * sf, (y1 - y0) * sf, X0, Y0, X1 - X0, Y1 - Y0);
  }
  function drawForm(ctx, t, x, y, w, h) {
    const cy = camForm(t), k = kForm(t);
    const map = (px, py) => [x + w / 2 + (px - PAGE.cx) * k, y + h / 2 + (py - cy) * k];
    ctx.fillStyle = PAGE.bg; ctx.fillRect(x, y, w, h);
    const vy0 = cy - h / 2 / k - 2, vy1 = cy + h / 2 / k + 2;
    for (const [i, a, b] of LLENO) { const y0 = Math.max(a, vy0), y1 = Math.min(b, vy1); if (y1 > y0) drawCap(ctx, i, y0, y1, map); }
    // cada tarjeta pasa de vacía a llena: barrido de izquierda a derecha entre las dos capturas reales
    VACIO.forEach(([i, a, b], n) => {
      const u = E.inOutCubic(ramp(t, B(ev.rellena[n]), B(ev.rellena[n]) + 0.32));
      if (u >= 1 || b < vy0 || a > vy1) return;
      const [rx] = map(lerp(cfg.barrido[0], cfg.barrido[1], u), 0);
      ctx.save(); ctx.beginPath(); ctx.rect(rx, y, x + w - rx, h); ctx.clip();
      drawCap(ctx, i, Math.max(a, vy0), Math.min(b, vy1), map);
      ctx.restore();
    });
    // foco: la tarjeta que nombra la cabecera queda iluminada; el resto se atenúa
    const idx = rotuloIndex(t);
    const dim = 0.6 * ramp(t, B(ev.rotulos[0]) - 0.1, B(ev.rotulos[0]) + 0.15) * (1 - ramp(t, B(ev.boton) - 0.1, B(ev.boton) + 0.1));
    if (dim > 0.01 && idx >= 0) {
      let [a, b] = TARJETAS[idx];
      if (idx > 0) { const [pa, pb] = TARJETAS[idx - 1], s2 = spring(t - B(ev.rotulos[idx]) + 0.12, 2.7, 0.82); a = lerp(pa, a, s2); b = lerp(pb, b, s2); }
      const [fx0, fy0] = map(cfg.foco[0], a - 3), [fx1, fy1] = map(cfg.foco[1], b + 3);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); rrect(ctx, fx0, fy0, fx1 - fx0, fy1 - fy0, 10 * k); ctx.clip('evenodd');
      ctx.fillStyle = `rgba(${bgRGB},${dim})`; ctx.fillRect(x, y, w, h); ctx.restore();
    }
  }
  const rotuloIndex = t => { let k = -1; ev.rotulos.forEach((b, i) => { if (t >= B(b) - 0.06) k = i; }); return t >= B(ev.rotulosFuera) ? -1 : k; };
  function dibujarMarco(ctx, t) {
    if (t < B(ev.marco) || t > B(ev.recoge) + 0.3) return null;
    const f = frameState(t);
    const x = FC[0] - f.w / 2, y = FC[1] - f.h / 2;
    ctx.fillStyle = LEAF; ctx.beginPath(); rrect(ctx, x, y, f.w, f.h, f.rad); ctx.fill();
    if (f.open > 0) {
      const iw = f.w * f.open, ih = f.h * f.open;
      ctx.save(); ctx.beginPath(); rrect(ctx, FC[0] - iw / 2, FC[1] - ih / 2, iw, ih, f.rad * f.open + 2); ctx.clip();
      drawForm(ctx, t, x, y, f.w, f.h);
      ctx.restore();
      if (f.open > 0.98) { ctx.strokeStyle = ink(0.12); ctx.lineWidth = 2; ctx.beginPath(); rrect(ctx, x + 1, y + 1, f.w - 2, f.h - 2, f.rad); ctx.stroke(); }
    }
    return f;
  }
  // cabecera: cada rótulo entra rodando desde abajo y sale hacia arriba
  function dibujarRotulos(ctx, t) {
    const { size, base, x: tx, peso } = cfg.cabecera;
    if (!(t > B(ev.rotulos[0]) - 0.15 && t < B(ev.rotulosFuera) + 0.2)) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.0, W, size * 1.32); ctx.clip();
    ev.rotulos.forEach((b, i) => {
      const tin = B(b), tout = i < ev.rotulos.length - 1 ? B(ev.rotulos[i + 1]) : B(ev.rotulosFuera);
      if (t < tin - 0.12 || t > tout + 0.1) return;
      const dyIn = (1 - spring(t - tin + 0.1, 3.6, 0.66)) * size * 1.25;
      const dyOut = -E.inCubic(ramp(t, tout - 0.12, tout)) * size * 1.25;
      text(ctx, cfg.rotulos[i], tx, base + dyIn + dyOut, size, peso, INK);
    });
    ctx.restore();
  }
  return { FC, frameState, dibujarMarco, dibujarRotulos, rotuloIndex };
}
