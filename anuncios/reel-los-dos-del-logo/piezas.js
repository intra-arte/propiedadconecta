// Las piezas del isotipo, cortadas en el navegador del archivo original del logo (LOGO_IMG): no hay copias
// ni nada redibujado. Cada píxel del isotipo va a una sola pieza, así que las piezas en su lugar dan el
// logo idéntico. Medidas en px del PNG original (1208 × 431), tomadas con el análisis de CONCEPTO.md.
import { LOGO } from 'motor/nucleo/marca.js';
import { LOGO_IMG } from 'motor/nucleo/reloj.js';

export const PIE = 357;                       // línea de los pies (borde inferior del isotipo)
export const COSTURA = 232;                   // los dos cuerpos se unen en el vértice del techo: x < 232 es el oscuro
export const CAB = {                          // las cabezas: círculos de radio 36
  oscura: { x: 147.5, y: 108.5, r: 36 },      // el que busca casa
  clara: { x: 319.5, y: 108.5, r: 36 },       // el agente (y el punto verde de todos los anuncios)
};
export const VENTANA = { x0: 190, y0: 228, x1: 270, y1: 304, mx: 231, my: 265 }; // cuatro cuadros; mx/my los separan
export const ISO = { x0: 72, y0: 73, x1: 392, y1: 357, cx: 232, cy: 215 };

const NOMBRES = ['cabezaOscura', 'cabezaClara', 'cuerpoOscuro', 'cuerpoClaro', 'v0', 'v1', 'v2', 'v3'];
let P = null;
export function piezas() {
  if (P || !LOGO_IMG) return P;
  const w = LOGO.corte, h = LOGO.h; // a la izquierda del corte está solo el isotipo
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(LOGO_IMG, 0, 0);
  const src = g.getImageData(0, 0, w, h).data;
  const out = NOMBRES.map(() => new ImageData(w, h));
  const dentro = (x, y, k) => Math.hypot(x - k.x, y - k.y) < k.r + 3;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    if (!src[i + 3]) continue;
    let k;
    if (dentro(x, y, CAB.oscura)) k = 0;
    else if (dentro(x, y, CAB.clara)) k = 1;
    else if (x >= VENTANA.x0 && x < VENTANA.x1 && y >= VENTANA.y0 && y < VENTANA.y1) k = 4 + (x >= VENTANA.mx ? 1 : 0) + (y >= VENTANA.my ? 2 : 0);
    else k = x < COSTURA ? 2 : 3;
    out[k].data.set(src.subarray(i, i + 4), i);
  }
  P = {};
  NOMBRES.forEach((n, k) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').putImageData(out[k], 0, 0); P[n] = cv; });
  return P;
}
