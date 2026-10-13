// STORYBOARD de «Los dos del logo»: cada segundo entero (0–9) es un cuadro clave del concepto, quieto.
// No es el anuncio: sirve para aprobar la idea. Los personajes son las piezas del isotipo original
// (piezas.js), que solo se mueven sin deformarse; el producto se ve solo en recortes de capturas reales;
// las flechas naranjas son anotaciones del boceto y no van en el video.
import { TAU, lerp } from 'motor/nucleo/lib.js';
import { W, H, IVORY, INK, LEAF, ink } from 'motor/nucleo/marca.js';
import { B, CAPS, LOGO_IMG } from 'motor/nucleo/reloj.js';
import { rrect, text, cachedLayout } from 'motor/nucleo/dibujo.js';
import { crearCierre } from 'motor/escenas/cierre.js';
import { LOGO } from 'motor/nucleo/marca.js';
import { piezas, PIE, CAB, VENTANA, ISO } from './piezas.js';
import { ctaTexto, BEATS } from './guion.js';

export { W, H };
const NOTA = '#E4572E';                    // color de las anotaciones del boceto
const FONDO_APP = '#F7F8FC';               // el fondo de página de las capturas
const SUELO = 1225, K = 0.8;               // los pies de los personajes y su escala (≤ 1: nunca más grande que el original)
const LEADS = [170, 410, 650], AGENTE = 905;

// ---------- personajes: cuerpo + cabeza, cada uno una pieza rígida del isotipo ----------
function figura(ctx, cual, x, y, k, { rot = 0, alpha = 1, hdx = 0, hdy = 0, sombra = SUELO, sinCabeza = false } = {}) {
  const p = piezas(); if (!p) return;
  const oscura = cual === 'oscura', c = oscura ? CAB.oscura : CAB.clara;
  ctx.save(); ctx.globalAlpha = alpha;
  if (sombra !== null) { const s = 1 - Math.min(0.6, (sombra - y) / 400); ctx.fillStyle = ink(0.08 * s); ctx.beginPath(); ctx.ellipse(x, sombra + 4, 86 * k * s, 11 * k * s, 0, 0, TAU); ctx.fill(); }
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); ctx.translate(-c.x, -PIE);
  ctx.drawImage(oscura ? p.cuerpoOscuro : p.cuerpoClaro, 0, 0);
  if (!sinCabeza) ctx.drawImage(oscura ? p.cabezaOscura : p.cabezaClara, hdx, hdy);
  ctx.restore();
}
const cabezaEn = (cual, x, y, k) => { const c = CAB[cual]; return [x, y - (PIE - c.y) * k, c.r * k]; };

// ---------- lo que no es el logo: burbujas con pictogramas, candado, moneda (dibujos, nunca interfaz) ----------
function icono(ctx, tipo, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (tipo === 'casa') { ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(0, -26); ctx.lineTo(28, 0); ctx.moveTo(-20, -7); ctx.lineTo(-20, 24); ctx.lineTo(20, 24); ctx.lineTo(20, -7); ctx.stroke(); ctx.fillRect(-6, 8, 12, 16); }
  if (tipo === 'edificio') { ctx.beginPath(); rrect(ctx, -18, -28, 36, 54, 4); ctx.stroke(); for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) ctx.fillRect(-10 + c * 13, -18 + r * 13, 7, 7); }
  if (tipo === 'llave') { ctx.beginPath(); ctx.arc(-14, 0, 12, 0, TAU); ctx.moveTo(-2, 0); ctx.lineTo(28, 0); ctx.moveTo(22, 0); ctx.lineTo(22, 11); ctx.moveTo(13, 0); ctx.lineTo(13, 8); ctx.stroke(); }
  if (tipo === 'puntos') { ctx.fillStyle = ink(0.32); [-17, 0, 17].forEach(dx => { ctx.beginPath(); ctx.arc(dx, 0, 6.5, 0, TAU); ctx.fill(); }); }
  if (tipo === 'chat') { ctx.beginPath(); rrect(ctx, -30, -24, 40, 30, 11); ctx.stroke(); ctx.fillStyle = LEAF; ctx.beginPath(); rrect(ctx, -8, -4, 38, 30, 11); ctx.fill(); }
  ctx.restore();
}
function burbuja(ctx, x, y, r, punta, tipo, { alpha = 1, s = 1 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y);
  ctx.shadowColor = 'rgba(20,42,34,0.13)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 9; ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  const a = Math.atan2(punta[1] - y, punta[0] - x);
  ctx.beginPath(); ctx.moveTo(x + Math.cos(a - 0.38) * r * 0.86, y + Math.sin(a - 0.38) * r * 0.86); ctx.lineTo(punta[0], punta[1]); ctx.lineTo(x + Math.cos(a + 0.38) * r * 0.86, y + Math.sin(a + 0.38) * r * 0.86); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.globalAlpha = alpha; icono(ctx, tipo, x, y, (r / 62) * s); ctx.restore();
}
function candado(ctx, x, y, s, abierto = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s);
  ctx.save(); ctx.shadowColor = 'rgba(20,42,34,0.18)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(0, -4, 46, 0, TAU); ctx.fill(); ctx.restore();
  ctx.translate(0, 4); ctx.scale(0.78, 0.78);
  ctx.save(); ctx.translate(15, -16 - abierto * 16); ctx.rotate(-abierto * 0.55); ctx.translate(-15, 16);
  ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-15, -16); ctx.lineTo(-15, -28); ctx.arc(0, -28, 15, Math.PI, 0); ctx.lineTo(15, -16); ctx.stroke(); ctx.restore();
  ctx.fillStyle = INK; ctx.beginPath(); rrect(ctx, -25, -18, 50, 42, 9); ctx.fill();
  ctx.fillStyle = IVORY; ctx.beginPath(); rrect(ctx, -12, -1, 24, 6, 3); ctx.fill(); // ranura de la moneda
  ctx.restore();
}
function moneda(ctx, x, y, r, sx = 1, rot = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(Math.max(sx, 0.06), 1);
  ctx.shadowColor = 'rgba(20,42,34,0.2)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, r - 2.5, 0, TAU); ctx.stroke();
  ctx.strokeStyle = ink(0.25); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r - 11, 0, TAU); ctx.stroke();
  text(ctx, '$', 0, r * 0.42, r * 1.2, 800, INK, 'center');
  ctx.restore();
}
// estela de una moneda que viaja: copias que se apagan hacia atrás sobre la curva
function estela(ctx, P0, C, P1, u, r) {
  for (let k = 6; k >= 0; k--) {
    const v = Math.max(0, u - k * 0.05), q = bez(P0, C, P1, v);
    moneda(ctx, q[0], q[1], r, Math.abs(Math.cos(v * 9)), 0, k === 0 ? 1 : 0.1 * (1 - k / 7));
  }
}
const bez = (a, c, b, u) => [lerp(lerp(a[0], c[0], u), lerp(c[0], b[0], u), u), lerp(lerp(a[1], c[1], u), lerp(c[1], b[1], u), u)];
// anotación del boceto: curva punteada con punta de flecha
function flecha(ctx, P0, C, P1) {
  ctx.save(); ctx.strokeStyle = NOTA; ctx.fillStyle = NOTA; ctx.lineWidth = 6; ctx.setLineDash([16, 12]); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...P0); ctx.quadraticCurveTo(...C, ...P1); ctx.stroke(); ctx.setLineDash([]);
  const a = Math.atan2(P1[1] - C[1], P1[0] - C[0]);
  ctx.beginPath(); ctx.moveTo(P1[0] + Math.cos(a) * 8, P1[1] + Math.sin(a) * 8); ctx.lineTo(P1[0] - Math.cos(a - 0.5) * 30, P1[1] - Math.sin(a - 0.5) * 30); ctx.lineTo(P1[0] - Math.cos(a + 0.5) * 30, P1[1] - Math.sin(a + 0.5) * 30); ctx.fill();
  ctx.restore();
}

// ---------- la app: recortes de capturas reales en la burbuja grande (el marco de los otros anuncios) ----------
function ventanaApp(ctx, cap, r, cx, cy, maxW, maxH, punta, rad = 28) {
  const im = CAPS[cap]; if (!im) return null;
  const s = Math.min(2.4, maxW / (r[2] - r[0]), maxH / (r[3] - r[1])), w = (r[2] - r[0]) * s, h = (r[3] - r[1]) * s, x = cx - w / 2, y = cy - h / 2;
  ctx.save(); ctx.shadowColor = 'rgba(20,42,34,0.14)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12; ctx.fillStyle = FONDO_APP;
  ctx.beginPath(); rrect(ctx, x, y, w, h, rad); ctx.fill();
  if (punta) { const bx = Math.min(x + w - 50, Math.max(x + 50, punta[0])); ctx.beginPath(); ctx.moveTo(bx - 28, y + h - 2); ctx.lineTo(punta[0], punta[1]); ctx.lineTo(bx + 28, y + h - 2); ctx.fill(); }
  ctx.restore();
  ctx.save(); ctx.beginPath(); rrect(ctx, x, y, w, h, rad); ctx.clip(); ctx.drawImage(im, r[0], r[1], r[2] - r[0], r[3] - r[1], x, y, w, h); ctx.restore();
  ctx.strokeStyle = ink(0.12); ctx.lineWidth = 2; ctx.beginPath(); rrect(ctx, x + 1, y + 1, w - 2, h - 2, rad); ctx.stroke();
  return { x, y, w, h };
}
const cabecera = (ctx, s) => text(ctx, s, 90, 410, 96, 760, INK);
function titular(ctx, lineas) {
  const ancho = Math.max(...lineas.map(s => cachedLayout(s, 800, 1000).width / 1000)), size = Math.min(140, Math.floor(900 / ancho));
  lineas.forEach((s, i) => text(ctx, s, 86, 500 + i * size * 1.04, size, 800, INK));
}
// la fila de clientes con sus burbujas; resalta = índice del elegido (los demás quedan atrás)
function fila(ctx, { tipos = ['casa', 'edificio', 'llave'], burbujas = true, atenuar = -1, candados = null, tenue = 0.35 } = {}) {
  LEADS.forEach((x, i) => {
    const a = atenuar >= 0 && i !== atenuar ? tenue : 1;
    figura(ctx, 'oscura', x, SUELO, K, { alpha: a });
    const [hx, hy, hr] = cabezaEn('oscura', x, SUELO, K);
    if (burbujas && tipos[i]) burbuja(ctx, x + 24, hy - hr - 92, 58, [x + 6, hy - hr - 12], tipos[i], { alpha: a });
    if (candados && candados[i] !== undefined) candado(ctx, x + 2, SUELO - 92, 0.8, candados[i], a);
  });
}

// ---------- los cuadros ----------
const CIERRE = crearCierre({
  ev: { isotipo: 26, cta: 26.5, nombre: 29.25, empujes: [32, 34], fin: BEATS },
  escala: 0.76, yLogo: 690, anclaZoom: 940,
  cta: { texto: ctaTexto, y: 1040, w: 760, h: 132, size: 52 },
  marcarGratis: false,
  nota: { texto: 'Para agentes e inmobiliarias', y: 1190, size: 40, ev: 27.5 },
});
// el isotipo armado en (X, Y) con escala k: cada pieza en su lugar = el logo original
function isotipoArmado(ctx, X, Y, k, { ventanas = [1, 1, 1, 1] } = {}) {
  const p = piezas(); if (!p) return;
  ctx.save(); ctx.translate(X, Y); ctx.scale(k, k);
  ['cuerpoOscuro', 'cuerpoClaro', 'cabezaOscura', 'cabezaClara'].forEach(n => ctx.drawImage(p[n], 0, 0));
  ventanas.forEach((s, i) => {
    if (!s) return;
    const cx = i % 2 ? 251 : 211, cy = i < 2 ? 247 : 284;
    ctx.save(); ctx.globalAlpha = Math.min(1, s); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); ctx.drawImage(p['v' + i], 0, 0); ctx.restore();
  });
  ctx.restore();
}
const KL = 0.95, XL = 540 - ISO.cx * KL, YL = 860 - ISO.cy * KL; // dónde se forma el logo
const pieLogo = cual => [XL + CAB[cual].x * KL, YL + PIE * KL];

const CUADROS = [
  // 0 · Gancho A: los clientes ya están buscando; el punto verde cae y es la cabeza del agente
  ctx => {
    titular(ctx, ['Tus próximos', 'clientes ya', 'están buscando.']);
    fila(ctx);
    figura(ctx, 'clara', AGENTE, SUELO, K, { sinCabeza: true });
    const [hx, hy, hr] = cabezaEn('clara', AGENTE, SUELO, K);
    ctx.fillStyle = LEAF; ctx.beginPath(); ctx.ellipse(hx, hy - 150, hr * 0.86, hr * 1.25, 0, 0, TAU); ctx.fill(); // el punto, estirado por la caída
    flecha(ctx, [hx + 64, hy - 230], [hx + 74, hy - 130], [hx + 50, hy - 36]);
  },
  // 1 · Gancho B: el logo original, quieto
  ctx => {
    titular(ctx, ['Mira bien', 'el logo.']);
    const k = 0.76, C = LOGO.contenido;
    if (LOGO_IMG) ctx.drawImage(LOGO_IMG, 540 - ((C.x0 + C.x1) / 2) * k, 900 - ((C.y0 + C.y1) / 2) * k, LOGO.w * k, LOGO.h * k);
  },
  // 2 · Gancho B: el techo se abre en el vértice y salen dos personas; la ventana cae
  ctx => {
    titular(ctx, ['Son dos', 'personas.']);
    const k = 0.9, X = 540 - ISO.cx * k, Y = 900 - ISO.cy * k, p = piezas();
    figura(ctx, 'oscura', X + CAB.oscura.x * k - 150, Y + PIE * k, k, { rot: -0.1, sombra: Y + PIE * k });
    figura(ctx, 'clara', X + CAB.clara.x * k + 150, Y + PIE * k, k, { rot: 0.1, sombra: Y + PIE * k });
    if (p) { const wx = X + VENTANA.mx * k, wy = Y + VENTANA.my * k + 170; ctx.save(); ctx.translate(wx, wy); ctx.rotate(0.22); ctx.scale(k, k); ctx.translate(-VENTANA.mx, -VENTANA.my); for (let i = 0; i < 4; i++) ctx.drawImage(p['v' + i], 0, 0); ctx.restore(); flecha(ctx, [600, Y + VENTANA.my * k - 10], [640, wy - 60], [wx + 70, wy + 10]); }
    flecha(ctx, [470, 760], [400, 700], [300, 760]); flecha(ctx, [610, 760], [680, 700], [780, 760]);
  },
  // 3 · Ves qué buscan: la burbuja del elegido se abre en la app real
  ctx => {
    cabecera(ctx, 'Qué busca');
    fila(ctx, { tipos: ['casa', null, 'llave'], atenuar: 1 });
    figura(ctx, 'clara', AGENTE - 60, SUELO, K, { rot: -0.06 });
    const [hx, hy, hr] = cabezaEn('oscura', LEADS[1], SUELO, K);
    ventanaApp(ctx, 0, [160, 331, 523, 532], 540, 640, 900, 330, [hx + 8, hy - hr - 14]);
  },
  // 4 · Una moneda: abre el candado del elegido (no se le paga al cliente: se desbloquea su contacto)
  ctx => {
    cabecera(ctx, 'Desbloqueas');
    fila(ctx, { burbujas: false, atenuar: 1, candados: [0, 0, 0] });
    figura(ctx, 'clara', AGENTE - 60, SUELO, K, { rot: -0.12 });
    ventanaApp(ctx, 1, [560, 826, 880, 882], 540, 600, 900, 330, null);
    const P0 = [AGENTE - 120, SUELO - 190], C = [640, 760], P1 = [LEADS[1] + 2, SUELO - 96];
    estela(ctx, P0, C, P1, 0.62, 40);
    flecha(ctx, [AGENTE - 150, SUELO - 260], [660, 700], [LEADS[1] + 70, SUELO - 170]);
  },
  // 5 · Si no responde: la moneda vuelve al agente
  ctx => {
    cabecera(ctx, 'Protección');
    fila(ctx, { tipos: ['casa', 'puntos', 'llave'], atenuar: 1, candados: [undefined, 1, undefined] });
    figura(ctx, 'clara', AGENTE - 60, SUELO, K, { rot: 0.04 });
    ventanaApp(ctx, 3, [400, 595, 1041, 773], 540, 620, 900, 330, null);
    const P0 = [LEADS[1] + 2, SUELO - 96], C = [660, 820], P1 = [AGENTE - 120, SUELO - 190];
    estela(ctx, P0, C, P1, 0.55, 40);
    flecha(ctx, [LEADS[1] + 80, SUELO - 200], [680, 760], [AGENTE - 150, SUELO - 270]);
  },
  // 6 · Responde: la misma moneda abre a otro cliente; contestan y el agente va hacia él
  ctx => {
    cabecera(ctx, 'Contactas');
    fila(ctx, { tipos: ['chat', null, null], atenuar: 0, candados: [1, undefined, undefined], tenue: 0 });
    figura(ctx, 'clara', 470, SUELO - 80, K, { rot: -0.16, hdy: 10 });
    ventanaApp(ctx, 3, [398, 334, 684, 378], 540, 600, 900, 330, null);
    flecha(ctx, [760, SUELO - 120], [700, SUELO - 330], [530, SUELO - 300]);
  },
  // 7 · Se juntan: saltan uno hacia el otro; la app baja y será la ventana de la casa
  ctx => {
    const [dx, dy] = pieLogo('oscura'), [cx, cy] = pieLogo('clara');
    figura(ctx, 'oscura', dx - 80, dy - 90, KL, { rot: 0.16, hdy: 8, sombra: dy });
    figura(ctx, 'clara', cx + 80, cy - 90, KL, { rot: -0.16, hdy: 8, sombra: cy });
    ventanaApp(ctx, 3, [398, 334, 684, 378], 540, 560, 230, 60, null, 14);
    flecha(ctx, [540, 620], [560, 700], [540, YL + VENTANA.my * KL - 20]);
    flecha(ctx, [dx - 170, dy - 190], [dx - 120, dy - 260], [dx - 40, dy - 230]);
    flecha(ctx, [cx + 170, cy - 190], [cx + 120, cy - 260], [cx + 40, cy - 230]);
  },
  // 8 · Se forma el logo: los techos encajan, la ventana se enciende cuadro a cuadro
  ctx => {
    const ax = XL + ISO.cx * KL, ay = YL + 114 * KL;
    ctx.save(); ctx.strokeStyle = LEAF; ctx.globalAlpha = 0.28; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(ax, ay + 110, 330, 0, TAU); ctx.stroke(); ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.arc(ax, ay + 110, 400, 0, TAU); ctx.stroke(); ctx.restore();
    isotipoArmado(ctx, XL, YL, KL, { ventanas: [1, 1, 1, 1.22] });
  },
  // 9 · Cierre: el logo completo con el nombre, el CTA y a quién le habla
  ctx => CIERRE.dibujarCierre(ctx, B(33)),
];

export function draw(ctx, t) {
  ctx.fillStyle = IVORY; ctx.fillRect(0, 0, W, H);
  CUADROS[Math.min(CUADROS.length - 1, Math.max(0, Math.floor(t)))](ctx);
}
