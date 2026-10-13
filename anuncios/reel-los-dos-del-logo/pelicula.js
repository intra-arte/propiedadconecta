// Propiedad Conecta · «Los dos del logo» · anuncio para agentes.
// draw(ctx, t) pinta el fotograma t y depende solo de t.
// Historia: tres clientes (la persona verde oscura del logo) ya están buscando. El punto verde cae sobre
// un cuerpo claro: es el agente. Elige a un cliente, abre su candado con una moneda; ese no contesta y la
// moneda vuelve. La misma moneda abre a otro, que contesta: saltan uno hacia el otro, sus brazos se juntan
// en el vértice y forman el techo; la app baja y es la ventana. Es el logo, que recién ahí aparece.
// Los personajes son las piezas del isotipo original (piezas.js): solo se desplazan, giran o cambian de
// tamaño de forma uniforme (≤ 100 %). Lo elástico va en lo que no es logo: moneda, burbujas, candados, app.
// El producto se ve solo en recortes de capturas reales (las del anuncio para agentes).
import { clamp, lerp, ramp, E, spring, wobble, TAU, hash } from 'motor/nucleo/lib.js';
import { layout, fillGlyph } from 'motor/nucleo/tipo.js';
import { W, H, CX, IVORY, INK, LEAF, ink, LOGO } from 'motor/nucleo/marca.js';
import { B, CAPS, LOGO_IMG, REV } from 'motor/nucleo/reloj.js';
import { rrect, text, cachedLayout, shake } from 'motor/nucleo/dibujo.js';
import { crearCierre } from 'motor/escenas/cierre.js';
import { dibujarRevision } from 'motor/escenas/revision.js';
import { piezas, PIE, CAB, VENTANA } from './piezas.js';
import { EV, PENDIENTE, ctaTexto, APERTURA, COMUN, BEATS, ETIQUETA } from './guion.js';

export { W, H };
const FONDO_APP = '#F7F8FC';                 // el fondo de página de las capturas

// ======================================================================
// ESCENARIO: dónde están los personajes (coordenadas del mundo; la cámara las lleva a pantalla)
// ======================================================================
const K = 0.8;                               // escala de los personajes (≤ 1: nunca más grande que el original)
const SUELO = 1225, SUELO_A = 1253, SUELO_M = 1245; // pies de los clientes · del agente (más cerca) · donde se juntan
const LX = [150, 360, 570];                  // los tres clientes
const TIPOS = ['casa', 'edificio', 'llave']; // lo que busca cada uno (pictogramas, nunca interfaz)
const AX0 = 900;                             // dónde aparece el agente
const PASOS_AGENTE = [855, 815, 780, 765];   // se acerca a saltitos mientras mira a cada cliente
const FOCO = [2, 1, 0, 1];                   // a qué cliente mira en cada salto: el último es el elegido
// dónde se forma el logo (mundo): los pies de cada persona cuando sus brazos se juntan en el vértice
const XC = 465, XD = XC - (232.5 - CAB.oscura.x) * K, XL = XD + (CAB.clara.x - CAB.oscura.x) * K;
const PRE = 100;                             // cuánto se separan antes del último salto
const ORIGEN = [XD - CAB.oscura.x * K, SUELO_M - PIE * K]; // origen del PNG del logo armado, en el mundo
// la punta del brazo de cada persona (el vértice del techo), desde sus pies, en px del logo
const MANO = { oscura: [231 - CAB.oscura.x, 114 - PIE], clara: [232 - CAB.clara.x, 114 - PIE] };

// ---------- cierre del motor: el logo toma el relevo ya entero, en el mismo lugar ----------
const CIERRE = crearCierre({
  ev: { isotipo: EV.isotipo, cta: EV.cta, nombre: EV.nombre, empujes: EV.empujes, fin: BEATS },
  escala: 0.76, yLogo: 690, anclaZoom: 940,
  cta: { texto: ctaTexto, y: 1040, w: 760, h: 132, size: 52 },
  marcarGratis: PENDIENTE.gratis === 'pendiente',
  nota: { texto: 'Para agentes e inmobiliarias', y: 1190, size: 40, ev: EV.nota },
});
const LS = 0.76, LC = LOGO.contenido;
const DESTINO = [CX - ((LC.x0 + LC.x1) / 2) * LS + CIERRE.ISO_DX, 690 - LC.y0 * LS]; // origen del PNG en el cierre (pantalla)
const RELEVO = EV.aCierre[1];                // desde aquí dibuja el cierre del motor
const empuje = t => (t < B(EV.isotipo) ? 1 : 1 + 0.02 * E.outCubic(ramp(t, B(EV.isotipo), B(BEATS)))); // el mismo del cierre

// ---------- cámara: pantalla = s · mundo + o ----------
function camara(t) {
  const s0 = 1.035 - 0.035 * E.inOutCubic(ramp(t, 0, B(8))), P = [540, 1100]; // empieza cerca y se abre
  let s = s0, o = [P[0] - s0 * P[0], P[1] - s0 * P[1]];
  const sz = 0.95 / K, oz = [540 - sz * XC, 860 - sz * (SUELO_M - (PIE - 215) * K)]; // cerca de los dos
  const uz = E.inOutCubic(ramp(t, B(EV.camara[0]), B(EV.camara[1])));
  s = lerp(s, sz, uz); o = [lerp(o[0], oz[0], uz), lerp(o[1], oz[1], uz)];
  const sc = LS / K, oc = [DESTINO[0] - sc * ORIGEN[0], DESTINO[1] - sc * ORIGEN[1]]; // el logo, en su lugar del cierre
  const uc = E.inOutCubic(ramp(t, B(EV.aCierre[0]), B(EV.aCierre[1])));
  s = lerp(s, sc, uc); o = [lerp(o[0], oc[0], uc), lerp(o[1], oc[1], uc)];
  return { s, o };
}
const aPantalla = (c, [x, y]) => [c.s * x + c.o[0], c.s * y + c.o[1]];

// ======================================================================
// MOVIMIENTO: saltos con anticipación, aterrizaje y la cabeza que llega un instante después
// ======================================================================
const hundir = (t, tl, a = 9) => (t < tl ? 0 : a * Math.sin(Math.PI * clamp((t - tl) / 0.16)) * Math.exp(-(t - tl) * 3));
const retraso = (t, tl, a = 13) => (t < tl + 0.02 ? 0 : a * Math.sin(Math.PI * clamp((t - tl - 0.02) / 0.24)) * Math.exp(-(t - tl) * 2));
const agacho = (t, t0, a = 8) => a * Math.sin(Math.PI * clamp((t - (t0 - 0.13)) / 0.15));
// recorre saltos [{ b0, b1, x, y, h }] (beats de despegue y aterrizaje) desde (x0, y0)
function trayecto(t, x0, y0, saltos) {
  let x = x0, y = y0, rot = 0, aire = false, ultimo = -Infinity, proximo = Infinity, base = y0;
  for (const s of saltos) {
    const t0 = B(s.b0), t1 = B(s.b1);
    if (t >= t1) { x = s.x; y = s.y; base = y; ultimo = t1; continue; }
    if (t > t0) {
      const u = ramp(t, t0, t1), h = s.h ?? 60;
      base = lerp(y, s.y, u);
      rot = Math.sign(s.x - x) * (s.giro ?? 0.12) * Math.sin(Math.PI * u);
      x = lerp(x, s.x, u); y = base - h * 4 * u * (1 - u); aire = true;
    } else proximo = t0;
    break;
  }
  const dy = aire ? 0 : hundir(t, ultimo) + agacho(t, proximo);
  return { x, y: y + dy, base, rot, hdy: aire ? -5 : retraso(t, ultimo), aire };
}

// ---------- los clientes ----------
const G_CAIDA = 17000;
function cliente(t, i) {
  const tl = B(EV.leads[i]);
  if (t < tl) { // cae desde arriba con gravedad
    const y = SUELO - 0.5 * G_CAIDA * (tl - t) ** 2;
    return y < -420 ? null : { x: LX[i], y, base: SUELO, rot: (i - 1) * 0.5 * (tl - t), hdy: -6, aire: true, k: K, alpha: 1 };
  }
  let saltos = [];
  if (i === 0) saltos = [
    { b0: EV.responde, b1: EV.responde + 0.5, x: LX[0], y: SUELO, h: 46, giro: 0 },     // contesta: salta de alegría
    { b0: EV.acercan[1] - 0.5, b1: EV.acercan[1], x: XD - PRE, y: SUELO_M, h: 48 },      // se acerca
    { b0: EV.salto, b1: EV.junta, x: XD, y: SUELO_M, h: 120, giro: 0.16 },              // el salto final
  ];
  const p = trayecto(t, LX[i], SUELO, saltos);
  const caida = { dy: hundir(t, tl, 11), hdy: retraso(t, tl, 15) };
  // respiración y miradas: la cabeza sigue al agente
  const resp = 2.2 * Math.sin(TAU * (t / 1.5 + i / 3));
  let alpha = 1, k = K, dyFondo = 0;
  if (i === 1 && t > B(EV.silencio)) alpha = 1 - 0.3 * ramp(t, B(EV.silencio), B(EV.silencio) + 0.3) + 0.3 * ramp(t, B(EV.vuelve[0]), B(EV.vuelve[1]));
  if (i > 0) { // se apartan: van hacia el fondo y se apagan
    const u = E.inOutCubic(ramp(t, B(EV.apartan) + 0.07 * (i - 1), B(EV.apartan) + 0.07 * (i - 1) + 0.45));
    alpha *= 1 - u; k = K * (1 - 0.18 * u); dyFondo = -46 * u;
    if (alpha <= 0.01) return null;
  }
  const agacha = i === 0 ? 10 * E.outCubic(ramp(t, B(EV.agacha), B(EV.salto))) * (t < B(EV.salto) ? 1 : 0) : 0;
  return { x: p.x, y: p.y + caida.dy + (p.aire ? 0 : resp) + dyFondo + agacha, base: p.base + dyFondo, rot: p.rot - (i === 0 ? 0.06 * agacha / 10 : 0), hdy: p.hdy + caida.hdy, aire: p.aire, k, alpha };
}

// ---------- el agente ----------
const SALTOS_AGENTE = [
  ...PASOS_AGENTE.map((x, j) => ({ b0: EV.saltos[j] - 0.5, b1: EV.saltos[j], x, y: SUELO_A, h: 58 })),
  { b0: EV.responde + 0.25, b1: EV.responde + 0.75, x: PASOS_AGENTE[3], y: SUELO_A, h: 40, giro: 0 },
  { b0: EV.acercan[1] - 0.5, b1: EV.acercan[1], x: XL + PRE, y: SUELO_M, h: 48 },
  { b0: EV.salto, b1: EV.junta, x: XL, y: SUELO_M, h: 120, giro: 0.16 },
];
const lanzar = (t, b) => 0.1 * Math.sin(Math.PI * clamp((t - B(b - 0.5)) / (B(b) - B(b - 0.5)))) - 0.15 * Math.sin(Math.PI * clamp((t - B(b)) / 0.32)); // se echa atrás y lanza
function agente(t) {
  const tc = B(EV.cuerpo);
  if (t < tc) return null;
  const p = trayecto(t, AX0, SUELO_A, SALTOS_AGENTE);
  const kb = t < tc + 1 ? K * spring(t - tc, 2.6, 0.55) : K;               // el cuerpo brota del suelo
  const tH = B(EV.cabeza[1]);
  let rot = p.rot + lanzar(t, EV.lanza) + lanzar(t, EV.lanza2);
  if (t > tH && t < B(EV.saltos[0] - 0.5)) rot += -0.05 * E.inOutCubic(ramp(t, tH + 0.35, tH + 0.7)); // mira a los clientes
  const atrapa = hundir(t, B(EV.vuelve[1]), 7);
  const agacha = 10 * E.outCubic(ramp(t, B(EV.agacha), B(EV.salto))) * (t < B(EV.salto) ? 1 : 0);
  const resp = p.aire ? 0 : 2 * Math.sin(TAU * (t / 1.4 + 0.5));
  return { x: p.x, y: p.y + hundir(t, tH, 12) + atrapa + agacha + resp, base: p.base, rot: rot + 0.06 * agacha / 10, hdy: p.hdy + retraso(t, tH, 18), aire: p.aire, k: kb, alpha: 1 };
}
// la cabeza del agente: cae desde arriba hasta el cuerpo (el punto de todos los anuncios)
function cabezaQueCae(t) {
  const t0 = B(EV.cabeza[0]), t1 = B(EV.cabeza[1]);
  if (t < t0 || t >= t1) return null;
  const u = ramp(t, t0, t1), yC = SUELO_A - (PIE - CAB.clara.y) * K;
  return [AX0, lerp(-120, yC, u * u)];
}
const manoDe = (f, cual) => { const [mx, my] = [MANO[cual][0] * f.k, MANO[cual][1] * f.k], co = Math.cos(f.rot), si = Math.sin(f.rot); return [f.x + mx * co - my * si, f.y + mx * si + my * co]; };

// ======================================================================
// DIBUJO: piezas del logo y lo que no es logo
// ======================================================================
function sombra(ctx, f) {
  const alto = Math.max(0, f.base - f.y), s = 1 - Math.min(0.55, alto / 420);
  ctx.fillStyle = ink(0.085 * s * f.alpha); ctx.beginPath(); ctx.ellipse(f.x + 6 * f.k, f.base + 5, 88 * f.k * s, 11 * f.k * s, 0, 0, TAU); ctx.fill();
}
function cabeza(ctx, cual, x, y, k) {
  const p = piezas(); if (!p) return;
  const c = CAB[cual];
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-c.x, -c.y);
  ctx.drawImage(cual === 'oscura' ? p.cabezaOscura : p.cabezaClara, 0, 0); ctx.restore();
}
// cuerpo (pivote en los pies) + cabeza con su retraso (px de pantalla)
function figura(ctx, cual, f, { sinCabeza = false, hdx = 0 } = {}) {
  const p = piezas(); if (!p || !f) return;
  const c = CAB[cual];
  ctx.save(); ctx.globalAlpha = f.alpha;
  ctx.translate(f.x, f.y); ctx.rotate(f.rot); ctx.scale(f.k, f.k); ctx.translate(-c.x, -PIE);
  ctx.drawImage(cual === 'oscura' ? p.cuerpoOscuro : p.cuerpoClaro, 0, 0);
  if (!sinCabeza) ctx.drawImage(cual === 'oscura' ? p.cabezaOscura : p.cabezaClara, hdx / f.k, f.hdy / f.k);
  ctx.restore();
}
function icono(ctx, tipo, x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (tipo === 'casa') { ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(0, -26); ctx.lineTo(28, 0); ctx.moveTo(-20, -7); ctx.lineTo(-20, 24); ctx.lineTo(20, 24); ctx.lineTo(20, -7); ctx.stroke(); ctx.fillRect(-6, 8, 12, 16); }
  if (tipo === 'edificio') { ctx.beginPath(); rrect(ctx, -18, -28, 36, 54, 4); ctx.stroke(); for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) ctx.fillRect(-10 + c * 13, -18 + r * 13, 7, 7); }
  if (tipo === 'llave') { ctx.beginPath(); ctx.arc(-14, 0, 12, 0, TAU); ctx.moveTo(-2, 0); ctx.lineTo(28, 0); ctx.moveTo(22, 0); ctx.lineTo(22, 11); ctx.moveTo(13, 0); ctx.lineTo(13, 8); ctx.stroke(); }
  if (tipo === 'puntos' || tipo === 'callado') { // «…»: escribiendo; callado: quietos y apagados
    [-17, 0, 17].forEach((dx, j) => { const dy = tipo === 'puntos' ? -7 * Math.max(0, Math.sin(TAU * (t * 2.2 - j * 0.18))) : 0; ctx.fillStyle = ink(tipo === 'puntos' ? 0.55 : 0.2); ctx.beginPath(); ctx.arc(dx, dy, 6.5, 0, TAU); ctx.fill(); });
  }
  if (tipo === 'chat') { ctx.beginPath(); rrect(ctx, -30, -24, 40, 30, 11); ctx.stroke(); ctx.fillStyle = LEAF; ctx.beginPath(); rrect(ctx, -8, -4, 38, 30, 11); ctx.fill(); }
  ctx.restore();
}
// burbuja blanca con su punta hacia la cabeza
function burbuja(ctx, x, y, r, punta, tipo, t, { alpha = 1, s = 1, iconoAlpha = 1 } = {}) {
  if (s <= 0.01 || alpha <= 0.01) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y);
  ctx.shadowColor = 'rgba(20,42,34,0.13)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 9; ctx.fillStyle = '#FFFFFF';
  const a = Math.atan2(punta[1] - y, punta[0] - x);
  ctx.beginPath(); ctx.moveTo(x + Math.cos(a - 0.4) * r * 0.85, y + Math.sin(a - 0.4) * r * 0.85); ctx.lineTo(punta[0], punta[1]); ctx.lineTo(x + Math.cos(a + 0.4) * r * 0.85, y + Math.sin(a + 0.4) * r * 0.85); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.restore();
  if (tipo && iconoAlpha > 0) { ctx.save(); ctx.globalAlpha = alpha * iconoAlpha; icono(ctx, tipo, x, y, (r / 62) * s, t); ctx.restore(); }
}
// candado en una insignia blanca: la ranura recibe la moneda; abierto ∈ [0, 1]
function candado(ctx, x, y, s, abierto, alpha = 1) {
  if (s <= 0.01 || alpha <= 0.01) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s);
  ctx.save(); ctx.shadowColor = 'rgba(20,42,34,0.18)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(0, -4, 46, 0, TAU); ctx.fill(); ctx.restore();
  ctx.translate(0, 4); ctx.scale(0.78, 0.78);
  ctx.save(); ctx.translate(15, -16 - abierto * 16); ctx.rotate(-abierto * 0.55); ctx.translate(-15, 16);
  ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-15, -16); ctx.lineTo(-15, -28); ctx.arc(0, -28, 15, Math.PI, 0); ctx.lineTo(15, -16); ctx.stroke(); ctx.restore();
  ctx.fillStyle = abierto > 0.5 ? LEAF : INK; ctx.beginPath(); rrect(ctx, -25, -18, 50, 42, 9); ctx.fill();
  ctx.fillStyle = IVORY; ctx.beginPath(); rrect(ctx, -12, -1, 24, 6, 3); ctx.fill();
  ctx.restore();
}
function moneda(ctx, x, y, r, sx = 1, alpha = 1) {
  if (alpha <= 0.01 || r <= 0.5) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(Math.max(Math.abs(sx), 0.07), 1);
  ctx.shadowColor = 'rgba(20,42,34,0.22)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, Math.max(0, r - 2.5), 0, TAU); ctx.stroke();
  if (r > 14) { ctx.strokeStyle = ink(0.25); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r - 10, 0, TAU); ctx.stroke(); }
  if (Math.abs(sx) > 0.25) text(ctx, '$', 0, r * 0.42, r * 1.2, 800, INK, 'center');
  ctx.restore();
}
// destellos cortos alrededor de un punto (al abrir un candado, al encender la ventana)
function destello(ctx, x, y, t, t0, r0 = 50, n = 6, color = LEAF) {
  const u = ramp(t, t0, t0 + 0.3); if (u <= 0 || u >= 1) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = 6 * (1 - u); ctx.globalAlpha = 1 - u * 0.6;
  for (let j = 0; j < n; j++) { const a = (j / n) * TAU - Math.PI / 2, r1 = r0 + 30 * E.outCubic(u), r2 = r1 + 18 * (1 - u); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2); ctx.stroke(); }
  ctx.restore();
}
// anillo que se abre desde un punto
function anillo(ctx, x, y, t, t0, rMax, dur = 0.7, a0 = 0.4) {
  const u = ramp(t, t0, t0 + dur); if (u <= 0 || u >= 1) return;
  ctx.save(); ctx.strokeStyle = LEAF; ctx.globalAlpha = a0 * (1 - u); ctx.lineWidth = 12 * (1 - u) + 2;
  ctx.beginPath(); ctx.arc(x, y, rMax * E.outCubic(u), 0, TAU); ctx.stroke(); ctx.restore();
}

// ---------- la ciudad al fondo: contornos muy tenues, con paralaje ----------
const CIUDAD = Array.from({ length: 16 }, (_, j) => ({ x: -260 + j * 108 + hash(j, 3) * 40, w: 64 + hash(j, 5) * 50, h: 60 + hash(j, 9) * 120, casa: hash(j, 11) > 0.5 }));
function ciudad(ctx, t, c) {
  const a = 1 - ramp(t, B(EV.camara[0]), B(EV.camara[0]) + 0.6); if (a <= 0) return;
  const s = lerp(1, c.s, 0.5), o = [c.o[0] * 0.5, c.o[1] * 0.5], suelo = 1150;
  ctx.save(); ctx.translate(o[0], o[1]); ctx.scale(s, s); ctx.translate(-28 * ramp(t, 0, B(24)), 0); // deriva lenta
  ctx.strokeStyle = ink(0.06 * a); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  for (const e of CIUDAD) {
    ctx.beginPath();
    if (e.casa) { ctx.moveTo(e.x, suelo); ctx.lineTo(e.x, suelo - e.h * 0.6); ctx.lineTo(e.x + e.w / 2, suelo - e.h * 0.6 - e.w * 0.42); ctx.lineTo(e.x + e.w, suelo - e.h * 0.6); ctx.lineTo(e.x + e.w, suelo); }
    else { ctx.rect(e.x, suelo - e.h, e.w * 0.8, e.h); }
    ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(-400, suelo); ctx.lineTo(1500, suelo); ctx.stroke();
  ctx.restore();
}

// ======================================================================
// LA APP: la burbuja del elegido se abre en recortes de capturas reales (y al final es la ventana)
// ======================================================================
const BASE_APP = 875, MAXW = 900, MAXH = 400, RAD = 28;
const PASOS = [
  { b: EV.pasos[0], cap: 0, r: [160, 331, 523, 532], rotulo: COMUN[0].texto[0] },                                      // la tarjeta del marketplace
  { b: EV.pasos[1], cap: 0, r: [170, 432, 512, 532], rotulo: COMUN[0].texto[1] },                                      // su presupuesto
  { b: EV.pasos[2], cap: 1, r: [400, 715, 1041, 882], acerca: { b: EV.acerca, r: [560, 826, 880, 882] }, rotulo: COMUN[1].texto[0] }, // contacto oculto → botón
  { b: EV.pasos[3], cap: 2, r: [0, 0, 384, 276], rotulo: COMUN[1].texto[1] },                                          // el diálogo
  { b: EV.pasos[4], cap: 3, r: [400, 595, 1041, 773], rotulo: COMUN[2].texto[0] },                                     // protección del lead
  { b: EV.pasos[5], cap: 3, r: [398, 334, 684, 378], corte: true, rotulo: COMUN[3].texto[0] },                        // «Contactar por WhatsApp»
];
const escalaApp = r => Math.min(2.4, MAXW / (r[2] - r[0]), MAXH / (r[3] - r[1]));
const tamApp = r => { const s = escalaApp(r); return [(r[2] - r[0]) * s, (r[3] - r[1]) * s]; };
const llegada = (t, b) => spring(t - B(b) + 0.12, 2.7, 0.82);
const propio = (i, t) => { const p = PASOS[i]; if (!p.acerca) return p.r; const u = spring(t - B(p.acerca.b), 2.6, 0.8); return p.r.map((v, k) => lerp(v, p.acerca.r[k], u)); };
const final = i => (PASOS[i].acerca ? PASOS[i].acerca.r : PASOS[i].r);
const pasoEn = t => { let k = 0; PASOS.forEach((p, i) => { if (t >= B(p.b) - 0.12) k = i; }); return k; };
function estadoApp(t) {
  const i = pasoEn(t), p = PASOS[i];
  if (i === 0) { const r = propio(0, t); return { i, r, tam: tamApp(r), u: 1 }; }
  const u = llegada(t, p.b), prev = final(i - 1);
  if (PASOS[i - 1].cap === p.cap && !p.corte) { const d = propio(i, t), r = prev.map((v, k) => lerp(v, d[k], u)); return { i, r, tam: tamApp(r), u: 1 }; }
  const a = tamApp(prev), b = tamApp(propio(i, t));
  return { i, r: propio(i, t), prev, tam: [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], u };
}
const recorte = (ctx, i, r, cx, cy) => { const im = CAPS[PASOS[i].cap]; if (!im) return; const [w, h] = tamApp(r); ctx.drawImage(im, r[0], r[1], r[2] - r[0], r[3] - r[1], cx - w / 2, cy - h / 2, w, h); };
// la burbuja de un cliente (en pantalla): centro y radio
function burbujaDe(c, f, i, t) {
  f = f || { x: LX[i], y: SUELO, k: K };
  const [hx, hy] = aPantalla(c, [f.x, f.y - (PIE - CAB.oscura.y) * f.k]), hr = CAB.oscura.r * f.k * c.s;
  const flota = 5 * Math.sin(TAU * (0.9 * t + i * 0.3));
  return { x: hx + 26 * c.s, y: hy - hr - 96 * c.s + flota, r: 58 * c.s, punta: [hx + 6 * c.s, hy - hr - 14 * c.s] };
}
// la ventana de la casa armada, en pantalla
const ventanaEn = c => { const [x0, y0] = aPantalla(c, [ORIGEN[0] + VENTANA.x0 * K, ORIGEN[1] + VENTANA.y0 * K]), [x1, y1] = aPantalla(c, [ORIGEN[0] + VENTANA.x1 * K, ORIGEN[1] + VENTANA.y1 * K]); return [x0, y0, x1 - x0, y1 - y0]; };

function dibujarApp(ctx, t, c, fl) {
  const t0 = B(EV.burbuja), tB0 = B(EV.baja[0]), tB1 = B(EV.baja[1]);
  if (t < t0 || t > tB1 + 0.05) return;
  const e = estadoApp(t), [w, h] = e.tam;
  let x = 540 - w / 2, y = BASE_APP - h, ww = w, hh = h, rad = RAD;
  // nace de la burbuja del cliente del medio
  const um = spring(t - t0, 2.3, 0.8), b0 = burbujaDe(c, fl[1], 1, t);
  if (um < 1) { x = lerp(b0.x - b0.r, x, um); y = lerp(b0.y - b0.r, y, um); ww = lerp(2 * b0.r, ww, um); hh = lerp(2 * b0.r, hh, um); rad = lerp(b0.r, RAD, clamp(um)); }
  // mientras la cámara se acerca, se achica y sube (deja lugar a los dos); al final baja a la casa: es la ventana
  const us = E.inOutCubic(ramp(t, B(EV.camara[0]), B(EV.camara[1])));
  if (us > 0) { const k = lerp(1, 0.62, us), cx = x + ww / 2, cy = lerp(y + hh / 2, 560, us); ww *= k; hh *= k; x = cx - ww / 2; y = cy - hh / 2; rad *= k; }
  const ub = E.inOutCubic(ramp(t, tB0, tB1));
  if (ub > 0) { const [vx, vy, vw, vh] = ventanaEn(c); x = lerp(x, vx, ub); y = lerp(y, vy, ub); ww = lerp(ww, vw, ub); hh = lerp(hh, vh, ub); rad = lerp(rad, 8, ub); }
  const contenido = ramp(um, 0.5, 0.95) * (1 - ramp(ub, 0.4, 0.8)), todo = 1 - ramp(ub, 0.88, 1);
  // la punta apunta al cliente de turno: el del medio y, cuando contesta, el de la izquierda
  const uq = E.inOutCubic(ramp(t, B(EV.abre2), B(EV.abre2) + 0.4));
  const pA = burbujaDe(c, fl[1], 1, t).punta, pB = burbujaDe(c, fl[0], 0, t).punta;
  const punta = [lerp(pA[0], pB[0], uq), lerp(pA[1], pB[1], uq)];
  const puntaA = clamp(um * 1.4 - 0.2) * (1 - ramp(t, B(EV.camara[0]), B(EV.camara[0]) + 0.25));
  ctx.save(); ctx.globalAlpha = todo;
  ctx.shadowColor = 'rgba(20,42,34,0.14)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12;
  ctx.fillStyle = um < 0.6 ? '#FFFFFF' : FONDO_APP;
  if (puntaA > 0) {
    const bx = clamp(punta[0], x + 50, x + ww - 50), tip = [lerp(bx, punta[0], puntaA), lerp(y + hh - 4, punta[1], puntaA)];
    ctx.beginPath(); ctx.moveTo(bx - 28, y + hh - 4); ctx.lineTo(tip[0], tip[1]); ctx.lineTo(bx + 28, y + hh - 4); ctx.fill();
  }
  ctx.beginPath(); rrect(ctx, x, y, ww, hh, rad); ctx.fill(); ctx.restore();
  if (um < 1) { const a = 1 - ramp(um, 0, 0.35); if (a > 0) { ctx.save(); ctx.globalAlpha = a * todo; icono(ctx, TIPOS[1], x + ww / 2, y + hh / 2, b0.r / 62); ctx.restore(); } }
  if (contenido > 0) {
    ctx.save(); ctx.globalAlpha = contenido * todo; ctx.beginPath(); rrect(ctx, x, y, ww, hh, rad); ctx.clip();
    const sx = ww / w, sy = hh / h, cx = x + ww / 2, cy = y + hh / 2;
    ctx.translate(cx, cy); ctx.scale(sx, sy); ctx.translate(-cx, -cy);
    if (e.prev && e.u < 1) { const d = h * 0.5 + tamApp(e.r)[1] * 0.5 + 24; recorte(ctx, e.i - 1, e.prev, cx, cy - e.u * d); recorte(ctx, e.i, e.r, cx, cy + (1 - e.u) * d); }
    else recorte(ctx, e.i, e.r, cx, cy);
    ctx.restore();
    if (um > 0.98 && ub < 0.5) { ctx.save(); ctx.globalAlpha = contenido * todo; ctx.strokeStyle = ink(0.12); ctx.lineWidth = 2; ctx.beginPath(); rrect(ctx, x + 1, y + 1, ww - 2, hh - 2, rad); ctx.stroke(); ctx.restore(); }
  }
}
// cabecera: cada rótulo entra rodando desde abajo y sale hacia arriba
function cabecera(ctx, t) {
  const size = 96, base = 410, tx = 90;
  if (!(t > B(PASOS[0].b) - 0.15 && t < B(EV.fuera) + 0.2)) return;
  ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.0, W, size * 1.32); ctx.clip();
  PASOS.forEach((p, i) => {
    const tin = B(p.b), tout = i < PASOS.length - 1 ? B(PASOS[i + 1].b) : B(EV.fuera);
    if (t < tin - 0.12 || t > tout + 0.1) return;
    const dyIn = (1 - spring(t - tin + 0.1, 3.6, 0.66)) * size * 1.25, dyOut = -E.inCubic(ramp(t, tout - 0.12, tout)) * size * 1.25;
    text(ctx, p.rotulo, tx, base + dyIn + dyOut, size, 760, INK);
  });
  ctx.restore();
}

// ======================================================================
// GANCHO: «Tus próximos clientes ya están buscando.» (entra con el peso de la letra y se va hacia arriba)
// ======================================================================
let HOOK = null;
function hookMetrics() {
  if (HOOK) return HOOK;
  const lines = APERTURA.A[0].texto, widest = Math.max(...lines.map(s => cachedLayout(s, 800, 1000).width / 1000));
  const size = Math.min(150, Math.floor(900 / widest));
  HOOK = { lines, size, x: 86, base: [500, 500 + size * 1.04, 500 + size * 2.08] };
  return HOOK;
}
function titular(ctx, t) {
  const { lines, size, x, base } = hookMetrics();
  lines.forEach((str, li) => {
    const t0 = B(EV.titular[li]) - 0.08, tOut = B(EV.saleTitular) + 0.05 * li;
    if (t < t0 || t > tOut + 0.45) return;
    const L = layout(str, i => lerp(380, 800, E.outCubic(ramp(t, t0 + 0.012 * i, t0 + 0.012 * i + 0.22))), size);
    const fuera = E.inCubic(ramp(t, tOut, tOut + 0.4));
    ctx.save(); ctx.globalAlpha = 1 - ramp(t, tOut + 0.12, tOut + 0.4); ctx.fillStyle = INK;
    if (fuera <= 0) { ctx.beginPath(); ctx.rect(0, base[li] - size * 1.1, W, size * 1.38); ctx.clip(); }
    L.items.forEach((it, i) => {
      const rise = (1 - spring(t - t0 - 0.014 * i, 3.2, 0.62)) * size * 1.15 - fuera * (220 + 4 * i);
      fillGlyph(ctx, it, x, base[li], size, { dy: rise });
    });
    ctx.restore();
  });
}

// ======================================================================
// EL LOGO ARMADO: desde que los brazos se juntan se dibuja el archivo original (sin costura), con las
// cabezas aterrizando un instante después y la ventana encendiéndose cuadro a cuadro.
// ======================================================================
function logoArmado(ctx, t) {
  const p = piezas(); if (!p || !LOGO_IMG) return;
  const tj = B(EV.junta), dy = hundir(t, tj, 9);
  const [ox, oy] = [ORIGEN[0], ORIGEN[1] + dy], k = K;
  const vent = EV.ventanas.map(b => clamp(spring(t - B(b), 3.2, 0.85), 0, 1.04));
  const lag = retraso(t, tj, 16);
  const quieto = t > tj + 0.75 && t > B(EV.ventanas[3]) + 0.4;
  ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, LOGO.corte * k, LOGO.h * k);
  if (!quieto) {
    for (const c of [CAB.oscura, CAB.clara]) { ctx.moveTo(ox + (c.x + c.r + 3) * k, oy + c.y * k); ctx.arc(ox + c.x * k, oy + c.y * k, (c.r + 3) * k, 0, TAU); }
    ctx.rect(ox + VENTANA.x0 * k, oy + VENTANA.y0 * k, (VENTANA.x1 - VENTANA.x0) * k, (VENTANA.y1 - VENTANA.y0) * k);
    ctx.clip('evenodd');
  } else ctx.clip();
  ctx.drawImage(LOGO_IMG, ox, oy, LOGO.w * k, LOGO.h * k);
  ctx.restore();
  if (quieto) return;
  for (const n of ['cabezaOscura', 'cabezaClara']) { ctx.save(); ctx.translate(ox, oy + lag); ctx.scale(k, k); ctx.drawImage(p[n], 0, 0); ctx.restore(); }
  vent.forEach((s, j) => {
    if (s <= 0.001) return;
    const cx = j % 2 ? 251 : 211, cy = j < 2 ? 247 : 284;
    const gx = ox + cx * k, gy = oy + cy * k, glow = 1 - ramp(t, B(EV.ventanas[j]), B(EV.ventanas[j]) + 0.45);
    if (glow > 0) { const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 60 * k); g.addColorStop(0, `rgba(76,159,45,${0.4 * glow})`); g.addColorStop(1, 'rgba(76,159,45,0)'); ctx.fillStyle = g; ctx.fillRect(gx - 60 * k, gy - 60 * k, 120 * k, 120 * k); }
    ctx.save(); ctx.translate(gx, gy); ctx.scale(s, s); ctx.translate(-gx, -gy); ctx.translate(ox, oy); ctx.scale(k, k); ctx.drawImage(p['v' + j], 0, 0); ctx.restore();
  });
}

// ======================================================================
// LA MONEDA: de la mano al candado del elegido, de vuelta, y al otro cliente
// ======================================================================
const SLOT = (f, i) => [f.x + 2 * f.k / K, f.y - 92 * f.k / K];
function curva(P0, P1, u, alto) { const c = [(P0[0] + P1[0]) / 2, Math.min(P0[1], P1[1]) - alto]; return [lerp(lerp(P0[0], c[0], u), lerp(c[0], P1[0], u), u), lerp(lerp(P0[1], c[1], u), lerp(c[1], P1[1], u), u)]; }
function dibujarMoneda(ctx, t, fl, a) {
  if (!a) return;
  const R = 40, mano = manoDe(a, 'clara'), enMano = [mano[0] - 6, mano[1] - 34];
  const vuelo = (tA, tB, P0, P1, alto, giros) => { const u = ramp(t, tA, tB), q = curva(P0, P1, E.inOutCubic(u) * 0.15 + u * 0.85, alto); return { q, sx: Math.cos(u * TAU * giros) }; };
  const t1 = B(EV.lanza), t2 = B(EV.entra), t3 = B(EV.vuelve[0]), t4 = B(EV.vuelve[1]), t5 = B(EV.lanza2), t6 = B(EV.entra2);
  const aparece = B(EV.lanza - 0.5);
  if (t < aparece) return;
  if (t < t1) { const s = spring(t - aparece, 3, 0.55); moneda(ctx, enMano[0], enMano[1] - 10 * s, R * s, 1); return; }
  if (t < t2) { const v = vuelo(t1, t2, enMano, SLOT(fl[1]), 560, 2.5); const fin = ramp(t, t2 - 0.06, t2); moneda(ctx, v.q[0], v.q[1] + 10 * fin, R * (1 - 0.5 * fin), v.sx * (1 - fin) + fin * 0.1, 1 - fin); return; }
  if (t < t3) return;                                                     // dentro del candado
  if (t < t4) { const v = vuelo(t3, t4, SLOT(fl[1]), enMano, 480, -2); const s = Math.min(1, (t - t3) / 0.08); moneda(ctx, v.q[0], v.q[1], R * (0.5 + 0.5 * s), v.sx); return; }
  if (t < t5) { moneda(ctx, enMano[0], enMano[1], R, Math.cos((t - t4) * 2)); return; }
  if (t < t6 && fl[0]) { const v = vuelo(t5, t6, enMano, SLOT(fl[0]), 620, 3); const fin = ramp(t, t6 - 0.06, t6); moneda(ctx, v.q[0], v.q[1] + 10 * fin, R * (1 - 0.5 * fin), v.sx * (1 - fin) + fin * 0.1, 1 - fin); }
}
// candados e insignias de los clientes
function dibujarCandados(ctx, t, fl) {
  fl.forEach((f, i) => {
    if (!f) return;
    const tA = B(EV.candados[i]); if (t < tA) return;
    let s = spring(t - tA, 3.2, 0.5), abierto = 0, alpha = f.alpha;
    if (i === 1) { abierto = spring(t - B(EV.abre), 4, 0.5) * (1 - spring(t - B(EV.vuelve[0]), 4, 0.6)); s *= 1 + 0.16 * wobble(t - B(EV.entra), 4, 0.15) + 0.1 * wobble(t - B(EV.vuelve[0]), 4, 0.12); }
    if (i === 0) { abierto = spring(t - B(EV.abre2), 4, 0.5); s *= 1 + 0.16 * wobble(t - B(EV.entra2), 4, 0.15); s *= 1 - E.inBack(ramp(t, B(EV.responde) + 0.1, B(EV.responde) + 0.4)); }
    if (i === 2) s *= 1 - E.inBack(ramp(t, B(EV.apartan), B(EV.apartan) + 0.3));
    if (i === 1) s *= 1 - E.inBack(ramp(t, B(EV.apartan), B(EV.apartan) + 0.3));
    const [x, y] = SLOT(f, i);
    candado(ctx, x, y, 0.8 * (f.k / K) * Math.max(0, s), clamp(abierto), alpha);
    if (i === 1) destello(ctx, x, y - 4, t, B(EV.abre), 46);
    if (i === 0) destello(ctx, x, y - 4, t, B(EV.abre2), 46);
  });
}
// las burbujas chicas de los clientes (lo que buscan · «…» · globo de chat)
function dibujarBurbujas(ctx, t, c, fl) {
  fl.forEach((f, i) => {
    if (!f) return;
    const tl = B(EV.leads[i]), b = burbujaDe(c, f, i, t);
    let s = spring(t - tl - 0.12, 3, 0.5), alpha = f.alpha;
    s *= 1 + 0.2 * foco(t, i);                                        // crece la del cliente que el agente mira
    if (i === 1) { if (t >= B(EV.burbuja)) s = 0; }                     // se vuelve la app
    else s *= 1 - E.inBack(ramp(t, B(EV.candados[0]) - 0.25, B(EV.candados[0])));
    burbuja(ctx, b.x, b.y, b.r, b.punta, TIPOS[i], t, { alpha, s });
  });
  // el del medio escribe «…» y se queda callado
  const f1 = fl[1];
  if (f1) {
    const tE = B(EV.espera), tS = B(EV.silencio), b = burbujaDe(c, f1, 1, t);
    const s = spring(t - tE, 3, 0.55) * (1 - E.inBack(ramp(t, tS + 0.55, tS + 0.85)));
    if (t > tE && s > 0.01) burbuja(ctx, b.x + 30 * c.s, b.y + 26 * c.s, 46 * c.s, b.punta, t < tS ? 'puntos' : 'callado', t, { s });
  }
  // el de la izquierda contesta
  const f0 = fl[0];
  if (f0) {
    const tR = B(EV.responde), b = burbujaDe(c, f0, 0, t);
    const s = spring(t - tR, 3, 0.5) * (1 - E.inBack(ramp(t, B(EV.acercan[1]) - 0.6, B(EV.acercan[1]) - 0.3)));
    if (t > tR && s > 0.01) burbuja(ctx, b.x, b.y, b.r, b.punta, 'chat', t, { s });
  }
}
const mirada = t => -5 * E.inOutCubic(ramp(t, B(EV.cabeza[1]) + 0.35, B(EV.cabeza[1]) + 0.7)) * (1 - ramp(t, B(EV.junta) - 0.3, B(EV.junta)));
// cuánto mira el agente a cada cliente (0–1): uno por salto, y el elegido hasta que su burbuja se abre
function foco(t, i) {
  let v = 0;
  EV.saltos.forEach((b, j) => { if (FOCO[j] !== i) return; const fin = j < EV.saltos.length - 1 ? B(EV.saltos[j + 1]) : B(EV.burbuja); v = Math.max(v, spring(t - B(b) + 0.05, 3, 0.6) * (1 - E.inCubic(ramp(t, fin - 0.05, fin + 0.1)))); });
  return v;
}

// ======================================================================
// ARMADO
// ======================================================================
export function draw(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  ctx.fillStyle = IVORY; ctx.fillRect(0, 0, W, H);
  const c = camara(t), push = empuje(t);
  const [kx, ky] = shake(t, [[B(EV.cabeza[1]), 5], [B(EV.entra), 2], [B(EV.junta), 7]]);
  ctx.save(); ctx.translate(kx, ky);
  ctx.translate(CX, 940); ctx.scale(push, push); ctx.translate(-CX, -940);
  ciudad(ctx, t, c);
  const fl = [0, 1, 2].map(i => cliente(t, i)), a = agente(t);
  const juntos = t >= B(EV.junta);
  if (t < B(RELEVO)) {
    // mundo (clientes, agente, moneda) bajo la cámara
    ctx.save(); ctx.translate(c.o[0], c.o[1]); ctx.scale(c.s, c.s);
    fl.forEach(f => f && sombra(ctx, f));
    if (a && !juntos) sombra(ctx, a);
    if (!juntos) {
      [2, 1, 0].forEach(i => figura(ctx, 'oscura', fl[i]));
      dibujarCandados(ctx, t, fl);
    }
    if (a && !juntos) figura(ctx, 'clara', a, { sinCabeza: t < B(EV.cabeza[1]), hdx: mirada(t) });
    const cae = cabezaQueCae(t);
    if (cae) cabeza(ctx, 'clara', cae[0], cae[1], K);
    if (juntos) {
      const apex = [ORIGEN[0] + 232 * K, ORIGEN[1] + 114 * K], centro = [ORIGEN[0] + 232 * K, ORIGEN[1] + 215 * K];
      anillo(ctx, apex[0], apex[1], t, B(EV.junta), 300, 0.7, 0.45);
      anillo(ctx, centro[0], centro[1], t, B(EV.junta) + 0.12, 420, 0.9, 0.22);
      logoArmado(ctx, t);
      EV.ventanas.forEach((b, j) => destello(ctx, ORIGEN[0] + (j % 2 ? 251 : 211) * K, ORIGEN[1] + (j < 2 ? 247 : 284) * K, t, B(b), 26, 4));
    }
    dibujarMoneda(ctx, t, fl, a);
    ctx.restore();
    // pantalla: burbujas (siguen a sus cabezas), la app y la cabecera
    if (!juntos) dibujarBurbujas(ctx, t, c, fl);
    dibujarApp(ctx, t, c, fl);
    cabecera(ctx, t);
  }
  ctx.restore();
  titular(ctx, t);
  if (t >= B(RELEVO)) CIERRE.dibujarCierre(ctx, t);
  if (REV) dibujarRevision(ctx, t, [...APERTURA.A, ...COMUN], ETIQUETA);
}
