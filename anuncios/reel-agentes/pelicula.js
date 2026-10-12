// Propiedad Conecta · «Paga solo por clientes interesados» · anuncio para agentes.
// draw(ctx, t) pinta el fotograma t y depende solo de t (más la variante A/B elegida al cargar).
// Hilo: las monedas se pierden en anuncios «DESTACADO»; una queda en el aire, gira, y del otro lado
// es el punto verde (un cliente que ya está buscando). El punto se vuelve la «i» de «interesados», se
// estira en el marco de las pantallas reales y aterriza en el isotipo.
// Propio de este anuncio: los anuncios y las monedas, el giro de la moneda, el titular del gancho, el
// titular con el punto en la «i» y la trayectoria del punto. Del motor: marca, punto, pantallas, cierre.
import { clamp, lerp, ramp, E, spring, wobble, bump, TAU, hash } from 'motor/nucleo/lib.js';
import { shape, layout, fillGlyph } from 'motor/nucleo/tipo.js';
import { W, H, CX, IVORY, INK, LEAF, DEEP, CARD, ink, ivo } from 'motor/nucleo/marca.js';
import { B, VAR, REV } from 'motor/nucleo/reloj.js';
import { blob, rrect, mono, cachedLayout, text, shake, arc } from 'motor/nucleo/dibujo.js';
import { R_DOT, dibujarPunto } from 'motor/escenas/punto.js';
import { crearPantallas } from 'motor/escenas/pantallas.js';
import { crearCierre } from 'motor/escenas/cierre.js';
import { dibujarRevision } from 'motor/escenas/revision.js';
import { EV, PENDIENTE, ctaTexto, APERTURA, COMUN, BEATS, ETIQUETA } from './guion.js';

export { W, H };
const IMG = ['#22503C', '#2A5A45', '#1E4434', '#30624C'], LITE = '#3F7C5D', DARK = '#132F24'; // tonos derivados de los verdes de la marca

// ======================================================================
// GANCHO (beats 0–6): tres anuncios «DESTACADO» y las monedas que se pierden en ellos
// ======================================================================
const CW = 340, CH = 436, KC = 320 / CW;              // la tarjeta del anuncio, dibujada a 320 × 410
const CARD_X = [205, 540, 875], CARD_Y = 1190;        // centros: una fila; los textos quedan dentro de la zona segura
const ANUNCIOS = [
  { head: 'SE VENDE', price: '$165.000', meta: '3 hab · 140 m²', img: 1, tone: IMG[0] },
  { head: 'SE ARRIENDA', price: '$650/mes', meta: '2 hab · 78 m²', img: 0, tone: IMG[1] },
  { head: 'SE VENDE', price: '$120.000', meta: '2 hab · 95 m²', img: 2, tone: IMG[3] },
];
const R_MONEDA = 56, Y_GOLPE = 1080, CAIDA = 0.5;     // la moneda golpea el anuncio en el beat
const MONEDA_AIRE = [540, 885];                       // dónde queda la moneda que se congela
const tGiro = () => B(EV.gira), tGiroFin = () => B(EV.gira) + 0.4;

function drawFacade(ctx, info, x, y, w, h) {
  ctx.fillStyle = info.tone; ctx.beginPath(); rrect(ctx, x, y, w, h, 14); ctx.fill();
  ctx.save(); ctx.beginPath(); rrect(ctx, x, y, w, h, 14); ctx.clip();
  if (info.img === 0) { // edificio
    ctx.fillStyle = LITE; ctx.fillRect(x + w * 0.22, y + h * 0.16, w * 0.56, h * 0.9);
    ctx.fillStyle = DARK;
    for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) ctx.fillRect(x + w * 0.27 + i * w * 0.125, y + h * 0.24 + j * h * 0.15, w * 0.07, h * 0.08);
  } else if (info.img === 1) { // casa
    ctx.fillStyle = LITE; ctx.fillRect(x + w * 0.24, y + h * 0.48, w * 0.52, h * 0.52);
    ctx.beginPath(); ctx.moveTo(x + w * 0.18, y + h * 0.5); ctx.lineTo(x + w * 0.5, y + h * 0.2); ctx.lineTo(x + w * 0.82, y + h * 0.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = DARK; ctx.fillRect(x + w * 0.45, y + h * 0.7, w * 0.1, h * 0.3);
    ctx.fillRect(x + w * 0.3, y + h * 0.58, w * 0.1, h * 0.1); ctx.fillRect(x + w * 0.6, y + h * 0.58, w * 0.1, h * 0.1);
  } else { // torres
    ctx.fillStyle = LITE; ctx.fillRect(x + w * 0.16, y + h * 0.3, w * 0.3, h * 0.8); ctx.fillRect(x + w * 0.52, y + h * 0.12, w * 0.3, h);
    ctx.fillStyle = DARK;
    for (let j = 0; j < 7; j++) { ctx.fillRect(x + w * 0.2, y + h * (0.36 + j * 0.09), w * 0.22, h * 0.035); ctx.fillRect(x + w * 0.56, y + h * (0.18 + j * 0.11), w * 0.22, h * 0.035); }
  }
  ctx.restore();
}
// frente del anuncio, con la etiqueta «DESTACADO»; flash: brillo del golpe de una moneda
function drawFront(ctx, info, flash) {
  ctx.fillStyle = CARD; ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.fill();
  drawFacade(ctx, info, 16, 16, CW - 32, 238);
  const L = cachedLayout('DESTACADO', 800, 22), bw = L.width + 32;
  ctx.fillStyle = IVORY; ctx.beginPath(); rrect(ctx, 30, 30, bw, 40, 20); ctx.fill();
  ctx.fillStyle = INK; for (const it of L.items) fillGlyph(ctx, it, 46, 58, 22);
  text(ctx, info.head, 22, 296, 26, 700, ivo(0.82));
  mono(ctx, info.price, 22, 340, 30, ivo(0.95), 'left', 600);
  ctx.fillStyle = ivo(0.16); ctx.beginPath(); rrect(ctx, 22, 362, 220, 12, 6); rrect(ctx, 22, 386, 160, 12, 6); ctx.fill();
  mono(ctx, info.meta, 22, 420, 20, ivo(0.55));
  if (flash > 0.01) { ctx.fillStyle = ivo(0.32 * flash); ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.fill(); }
}
function drawBusco(ctx) {
  ctx.fillStyle = IVORY; ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.fill();
  text(ctx, 'BUSCO', 28, 168, 84, 800, INK);
  ctx.fillStyle = ink(0.13); ctx.beginPath();
  rrect(ctx, 28, 270, 270, 18, 9); rrect(ctx, 28, 316, 220, 18, 9); rrect(ctx, 28, 362, 170, 18, 9); ctx.fill();
}

// posición de cada moneda: cae con gravedad, golpea su anuncio en el beat, lo atraviesa y se pierde
function monedaEn(k, t) {
  const tb = B(EV.monedas[k]), j = EV.blanco[k], x = CARD_X[j] + (hash(k * 17 + 3, 9) - 0.5) * 90, y0 = -90;
  const tt = Math.min(t, B(EV.congela));
  const tau = tt - (tb - CAIDA);
  if (tau < 0) return null;
  const giro = k * 1.3 + tau * 9; // la moneda gira sobre sí misma mientras cae
  if (tau <= CAIDA) { const u = tau / CAIDA; return { x, y: y0 + (Y_GOLPE - y0) * u * u, rot: 0.25 * Math.sin(giro), sx: 0.3 + 0.7 * Math.abs(Math.cos(giro)), antes: true, j }; }
  const d = tau - CAIDA, hundida = clamp(d / 0.2);
  if (hundida >= 1) return null; // el anuncio se la tragó
  return { x, y: Y_GOLPE + 26 * E.outCubic(hundida), rot: 0, sx: 1, antes: false, j, hundida };
}
// la moneda que se congela en el aire: cae hasta MONEDA_AIRE en el beat de «congela»
function monedaAire(t) {
  const tc = B(EV.congela), tt = Math.min(t, tc), u = clamp((tt - (tc - 0.4)) / 0.4);
  if (tt < tc - 0.4) return null;
  const giro = 2 + (tt - (tc - 0.4)) * 9, deFrente = E.inOutCubic(ramp(u, 0.6, 1)); // se congela de frente: se lee el «$»
  return { x: lerp(575, MONEDA_AIRE[0], u), y: lerp(-90, MONEDA_AIRE[1], u * u), rot: 0, sx: lerp(0.3 + 0.7 * Math.abs(Math.cos(giro)), 1, deFrente) };
}
function drawMoneda(ctx, x, y, r, sx, rot, verde) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(Math.max(sx, 0.001), 1);
  if (verde) { ctx.fillStyle = LEAF; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore(); return; }
  ctx.fillStyle = IVORY; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = ink(0.22); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, r - 9, 0, TAU); ctx.stroke();
  text(ctx, '$', 0, r * 0.42, r * 1.25, 800, INK, 'center');
  ctx.restore();
}
// caída final: cada elemento cae con gravedad, en orden de distancia al punto
const caida = (t, x, y) => { const ts = B(EV.caen) + Math.hypot(x - MONEDA_AIRE[0], y - MONEDA_AIRE[1]) / 7000; const d = Math.max(0, t - ts); return { dy: 0.5 * 16000 * d * d, rot: 1.4 * d * (x < MONEDA_AIRE[0] ? -1 : 1), d }; };

function sceneGancho(ctx, t) {
  const tc = Math.min(t, B(EV.congela));
  ctx.fillStyle = DEEP; ctx.fillRect(0, 0, W, H);
  // el fondo se vuelve marfil desde el punto
  const Rw = (t - B(EV.caen)) * 5000 - 200;
  if (Rw > 0) { ctx.fillStyle = IVORY; ctx.beginPath(); ctx.arc(MONEDA_AIRE[0], MONEDA_AIRE[1], Rw, 0, TAU); ctx.fill(); }
  const push = 1 + 0.035 * E.inOutCubic(ramp(tc, 0, B(EV.congela)));
  ctx.save(); ctx.translate(CX, CARD_Y); ctx.scale(push, push); ctx.translate(-CX, -CARD_Y);
  const monedas = EV.monedas.map((_, k) => monedaEn(k, t));
  // los anuncios
  ANUNCIOS.forEach((info, j) => {
    const flash = EV.monedas.reduce((s, b, k) => (EV.blanco[k] === j && t >= B(b) ? Math.max(s, Math.exp(-(Math.min(t, B(EV.congela)) - B(b)) / 0.12)) : s), 0);
    const kick = EV.monedas.reduce((s, b, k) => (EV.blanco[k] === j ? s + 10 * bump(tc, B(b), B(b) + 0.3, 0.12) : s), 0);
    const flo = 6 * Math.sin(TAU * 0.5 * tc + j * 2.1);
    const f = caida(t, CARD_X[j], CARD_Y);
    ctx.save(); ctx.translate(CARD_X[j], CARD_Y + flo + kick + f.dy); ctx.rotate(f.rot); ctx.scale(KC, KC); ctx.translate(-CW / 2, -CH / 2);
    // B: el anuncio del medio se voltea y del otro lado dice «BUSCO»
    if (VAR === 'B' && j === 1) {
      const th = Math.PI * E.inOutCubic(ramp(t, B(EV.caeB), B(EV.caeB) + 0.3)), cos = Math.cos(th);
      ctx.translate(CW / 2, CH / 2); ctx.scale(Math.abs(cos) || 0.001, 1 + 0.07 * Math.sin(th)); ctx.translate(-CW / 2, -CH / 2);
      if (cos >= 0) drawFront(ctx, info, flash); else drawBusco(ctx);
    } else drawFront(ctx, info, flash);
    ctx.restore();
  });
  // monedas que caen hacia su anuncio y las que el anuncio se está tragando
  monedas.forEach(m => {
    if (!m) return;
    const f = caida(t, m.x, m.y);
    if (m.antes) drawMoneda(ctx, m.x, m.y + f.dy, R_MONEDA, m.sx, m.rot + f.rot, false);
    else { ctx.globalAlpha = 1 - m.hundida; drawMoneda(ctx, m.x, m.y + f.dy, R_MONEDA * (1 - 0.75 * E.inCubic(m.hundida)), 1, 0, false); ctx.globalAlpha = 1; }
  });
  ctx.restore();
  // la moneda en el aire: se congela, gira y del otro lado es el punto (después la dibuja dotMain)
  const ma = monedaAire(t);
  if (ma && t < tGiroFin()) {
    const u = clamp((t - tGiro()) / 0.4), th = Math.PI * E.inOutCubic(u), cos = Math.cos(th);
    const r = lerp(R_MONEDA, R_DOT, E.inOutCubic(u));
    const rim = 1 - ramp(t, B(EV.caen), B(EV.caen) + 0.3);
    if (cos < 0 && rim > 0) { ctx.fillStyle = ivo(rim); blob(ctx, ma.x, ma.y, r + 5, Math.abs(cos), 1, 0); }
    drawMoneda(ctx, ma.x, ma.y, r, u > 0 ? Math.abs(cos) : ma.sx, 0, cos < 0);
  }
  drawHookHeadline(ctx, t);
}

// ---------- titular del gancho (marfil sobre el fondo oscuro) ----------
let HOOK = null;
function hookMetrics() {
  if (HOOK) return HOOK;
  const all = [...APERTURA.A[0].texto, ...APERTURA.B[0].texto];
  const widest = Math.max(...all.map(s => layout(s, 800, 1000).width / 1000));
  const size = Math.min(150, Math.floor(900 / widest));
  HOOK = { size, x: 86, base: [520, 520 + size * 1.04, 520 + size * 2.08] };
  return HOOK;
}
function drawHookHeadline(ctx, t) {
  const lines = APERTURA[VAR][0].texto;
  const when = VAR === 'A' ? [0.25, 1, 2] : [0.25, 1.5, 3];
  const { size, x, base } = hookMetrics();
  lines.forEach((str, li) => {
    const t0 = B(when[li]) - 0.08;
    if (t < t0) return;
    const L = layout(str, i => lerp(380, 800, E.outCubic(ramp(t, t0 + 0.012 * i, t0 + 0.012 * i + 0.22))), size);
    ctx.fillStyle = IVORY;
    L.items.forEach((it, i) => {
      const rise = (1 - spring(t - t0 - 0.014 * i, 3.2, 0.62)) * size * 1.15;
      const f = caida(t, x + it.cx, base[li] - size * 0.35);
      if (f.dy > H) return;
      ctx.save();
      if (f.d <= 0) { ctx.beginPath(); ctx.rect(0, base[li] - size * 1.1, W, size * 1.38); ctx.clip(); }
      ctx.translate(x + it.cx, base[li] + f.dy); ctx.rotate(f.rot * 0.6); ctx.translate(-(x + it.cx), -base[li]);
      fillGlyph(ctx, it, x, base[li], size, { dy: rise });
      ctx.restore();
    });
  });
}

// ======================================================================
// TITULAR «Paga solo por clientes interesados.» — sube, recibe el punto en la «i» y viaja a la cabecera
// ======================================================================
const WORDS = ['Paga', 'solo', 'por', 'clientes', 'ınteresados.'];
const LINEA = [0, 0, 1, 1, 2];               // en qué línea va cada palabra en grande
const T_W = 4, T_I = 0;                       // la «i» que recibe el punto: palabra 4, letra 0
const OFS = WORDS.map((w, i) => WORDS.slice(0, i).reduce((s, x) => s + x.length + 1, 0)); // índice global de cada palabra
let TIT = null;
function titMetrics() {
  if (TIT) return TIT;
  const filas = [0, 1, 2].map(l => WORDS.filter((_, w) => LINEA[w] === l).join(' ').replace('ı', 'i'));
  const big = Math.min(176, Math.floor(900 / Math.max(...filas.map(s => layout(s, 800, 1000).width / 1000))));
  const head = Math.min(92, Math.floor(900 / (layout(WORDS.join(' ').replace('ı', 'i'), 760, 1000).width / 1000)));
  const b0 = 790, lh = big * 1.04, space = layout(' ', 800, big).width;
  const bigPose = [], cur = [86, 86, 86];
  WORDS.forEach((w, i) => { const l = LINEA[i]; bigPose.push([cur[l], b0 + l * lh]); cur[l] += layout(w, 800, big).width + space; });
  const headPose = []; let hx = 90;
  for (const w of WORDS) { headPose.push([hx, 410]); hx += layout(w, 760, head).width + layout(' ', 760, head).width; }
  // la tilde real de Outfit (para que el punto ocupe exactamente su lugar)
  const gi = shape('i', 800), gd = shape('ı', 800);
  const pts = gi.pts; let sx = 0, sy = 0, n = 0, ymin = 0;
  for (let k = 0; k < pts.length; k += 2) if (pts[k + 1] < gd.ymin - 30) { sx += pts[k]; sy += pts[k + 1]; n++; ymin = Math.min(ymin, pts[k + 1]); }
  const tilde = { cx: sx / n, cy: sy / n, r: sy / n - ymin };
  TIT = { big, head, bigPose, headPose, tilde };
  return TIT;
}
function titPose(t, w) {
  const m = titMetrics();
  const s = spring(t - (B(7.45) + 0.03 * w), 3.0, 0.72);
  const [bx, by] = m.bigPose[w], [hx, hy] = m.headPose[w];
  return { x: lerp(bx, hx, s), y: lerp(by, hy, s), size: lerp(m.big, m.head, s), wght: lerp(800, 760, s) };
}
// peso por letra: onda que sale de la «i» cuando llega el punto y se apaga con la distancia
const wordWeight = (t, w, base) => i => {
  const d = Math.abs(OFS[w] + i - (OFS[T_W] + T_I));
  return base - 380 * Math.exp(-d / 9) * bump(t, B(EV.tilde) + 0.015 * d, B(EV.tilde) + 0.015 * d + 0.4, 0.22);
};
function tildeAt(t) {
  const m = titMetrics(), p = titPose(t, T_W);
  const L = layout(WORDS[T_W].slice(0, T_I + 1), wordWeight(t, T_W, p.wght), p.size);
  const it = L.items[T_I], k = p.size / 1000;
  return { x: p.x + it.x + m.tilde.cx * k, y: p.y + m.tilde.cy * k * istemSquash(t), r: m.tilde.r * k };
}
function istemSquash(t) {
  const land = t - B(EV.tilde);
  let s = 1 - 0.16 * Math.exp(-(((land - 0.015) / 0.035) ** 2)) + 0.05 * wobble(land - 0.05, 7, 0.1);
  const pre = B(EV.salto) - t; // anticipación antes del salto
  if (pre > 0 && pre < 0.18) s *= 1 - 0.12 * Math.sin((Math.PI * (0.18 - pre)) / 0.18);
  return s;
}
function drawTitular(ctx, t) {
  const m = titMetrics();
  const t0 = B(EV.titular) - 0.06;
  if (t < t0) return;
  const rollOut = ramp(t, B(EV.pasos[0]) - 0.12, B(EV.pasos[0]));
  if (rollOut >= 1) return;
  ctx.save();
  if (rollOut > 0 || t > B(8)) { ctx.beginPath(); ctx.rect(0, 410 - m.head * 1.05, W, m.head * 1.4); if (t < B(9)) ctx.rect(0, 0, W, H); ctx.clip(); }
  WORDS.forEach((word, w) => {
    const p = titPose(t, w);
    const L = layout(word, wordWeight(t, w, p.wght), p.size);
    ctx.fillStyle = INK;
    L.items.forEach((it, i) => {
      const rise = (1 - spring(t - t0 - 0.05 * LINEA[w] - 0.012 * i, 3.0, 0.6)) * p.size * 1.12;
      const sy = w === T_W && i === T_I ? istemSquash(t) : 1;
      ctx.save();
      if (t < B(7)) { ctx.beginPath(); ctx.rect(0, p.y - p.size * 1.1, W, p.size * 1.36); ctx.clip(); }
      fillGlyph(ctx, it, p.x, p.y - rollOut * m.head * 1.3, p.size, { dy: rise, sy });
      ctx.restore();
    });
    // la «i» recupera su tilde de tinta cuando el punto se va
    if (w === T_W && t > B(EV.salto)) {
      const td = tildeAt(t), k = spring(t - B(EV.salto) - 0.05, 3, 0.5);
      ctx.fillStyle = INK; blob(ctx, td.x, td.y - rollOut * m.head * 1.3, td.r * k);
    }
  });
  ctx.restore();
}

// ======================================================================
// PANTALLAS REALES (beats 8–24) — escena del motor con los recortes de este anuncio
// ======================================================================
// Recortes en px de las capturas de 1440 × 900. Ninguno muestra datos de prueba ni indicadores de desarrollo.
const PANTALLAS = crearPantallas({
  centro: [540, 855], max: [900, 770], escalaMax: 2.4,
  ev: { marco: EV.marco, abre: EV.abre, recoge: EV.recoge, fuera: EV.fuera },
  fondo: '#F7F8FC',
  pasos: [
    { b: EV.pasos[0], captura: 0, recorte: [160, 331, 523, 611], rotulo: COMUN[2].texto[0] },              // tarjeta del marketplace
    { b: EV.pasos[1], captura: 0, recorte: [170, 432, 512, 532], rotulo: COMUN[2].texto[1] },              // su presupuesto y señales
    { b: EV.pasos[2], captura: 1, recorte: [400, 715, 1041, 882], acerca: { b: EV.acerca, recorte: [560, 826, 880, 882] }, rotulo: COMUN[2].texto[2] }, // contacto oculto → botón
    { b: EV.pasos[3], captura: 2, recorte: [0, 0, 384, 276], rotulo: COMUN[2].texto[3] },                  // el diálogo, recortado solo
    { b: EV.pasos[4], captura: 3, recorte: [398, 334, 684, 378], rotulo: COMUN[2].texto[4] },              // «Contactar por WhatsApp»
    { b: EV.pasos[5], captura: 3, corte: true, recorte: [400, 595, 1041, 773], rotulo: COMUN[2].texto[5] }, // protección del lead
  ],
  cabecera: { size: 96, base: 410, x: 90, peso: 760 },
});
const FC = PANTALLAS.FC;

// ======================================================================
// CIERRE: logo original + CTA + a quién le habla — escena del motor
// ======================================================================
const CIERRE = crearCierre({
  ev: { isotipo: EV.isotipo, cta: EV.cta, nombre: EV.nombre, empujes: EV.empujes, fin: BEATS },
  escala: 0.76, yLogo: 690, anclaZoom: 940,
  cta: { texto: ctaTexto, y: 1040, w: 760, h: 132, size: 52 },
  marcarGratis: PENDIENTE.gratis === 'pendiente',
  nota: { texto: 'Para agentes e inmobiliarias', y: 1190, size: 40, ev: EV.nota },
});
const HEAD_SCREEN = CIERRE.HEAD_SCREEN;

// ---------- el punto ----------
function dotMain(t) {
  if (t < tGiroFin()) return null; // hasta aquí es la moneda (sceneGancho)
  const tT = B(EV.tilde), p0 = MONEDA_AIRE;
  const td = tildeAt(Math.max(t, tT));
  if (t < tT) {
    const u = (t - tGiroFin()) / (tT - tGiroFin()), r = lerp(R_DOT, td.r, E.inCubic(u));
    const h = Math.max(150, (p0[1] - td.y) / 4 + 220); // salto balístico: llega a la «i» bajando
    const [x, y] = arc(u, p0, [td.x, td.y], h);
    return { x, y, r, stretch: true };
  }
  const tS = B(EV.salto), tM = B(EV.marco);
  if (t < tS) { const imp = t - tT, a = imp < 0.07 ? 0.45 * Math.sin((Math.PI * imp) / 0.07) : 0; return { x: td.x, y: td.y + td.r * a, r: td.r, sx: 1 + a, sy: 1 - a }; }
  if (t < tM) {
    const u = (t - tS) / (tM - tS), src = tildeAt(tS);
    const p = arc(E.inOutCubic(u) * 0.3 + u * 0.7, [src.x, src.y], FC, 160);
    return { x: p[0], y: p[1], r: lerp(td.r, R_DOT, E.outCubic(u)), stretch: true };
  }
  const tR = B(EV.recoge) + 0.28, tV = B(EV.vuelo[0]), tI = B(EV.isotipo);
  if (t < tR) return null; // es el marco
  if (t < tI) {
    const u = clamp((t - Math.max(tR, tV)) / (tI - Math.max(tR, tV)));
    const p = arc(E.inOutCubic(u), FC, [HEAD_SCREEN[0], HEAD_SCREEN[1]], 260);
    return { x: p[0], y: p[1], r: lerp(R_DOT, HEAD_SCREEN[2], E.inOutCubic(u)), stretch: true };
  }
  const imp = t - tI, a = imp < 0.07 ? 0.4 * Math.sin((Math.PI * imp) / 0.07) : 0;
  return { x: HEAD_SCREEN[0], y: HEAD_SCREEN[1] + HEAD_SCREEN[2] * a, r: HEAD_SCREEN[2], sx: 1 + a, sy: 1 - a, fade: 1 - ramp(t, tI + 0.12, tI + 0.2) };
}
const punto = (ctx, t) => dibujarPunto(ctx, t, dotMain, { aro: [B(EV.caen), 0.3] });

// ======================================================================
export function draw(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  if (t < B(5.6)) sceneGancho(ctx, t);
  else { ctx.fillStyle = IVORY; ctx.fillRect(0, 0, W, H); }
  const golpes = EV.monedas.map(b => [B(b), b === 0 ? 12 : 4]);
  const [kx, ky] = shake(t, [...golpes, [B(EV.tilde), 5], [B(EV.marco), 6], [B(EV.isotipo), 6]]);
  ctx.save(); ctx.translate(kx, ky);
  // el punto pasa por detrás de las letras en el salto a la «i» y mientras las palabras suben a la cabecera
  const dotUnder = (t > tGiroFin() && t < B(EV.tilde)) || (t > B(EV.salto) && t < B(EV.marco));
  if (dotUnder) punto(ctx, t);
  drawTitular(ctx, t);
  PANTALLAS.dibujarMarco(ctx, t);
  PANTALLAS.dibujarRotulos(ctx, t);
  CIERRE.dibujarCierre(ctx, t);
  if (!dotUnder) punto(ctx, t);
  ctx.restore();
  if (REV) dibujarRevision(ctx, t, [...APERTURA[VAR], ...COMUN], ETIQUETA);
}
