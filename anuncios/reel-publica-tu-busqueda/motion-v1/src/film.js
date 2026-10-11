// Propiedad Conecta · «Publica lo que buscas» · v1 de motion.
// draw(ctx, t) pinta el fotograma t y depende solo de t (más la variante A/B elegida al cargar).
// Hilo: el punto verde (la persona que busca) atraviesa el muro de anuncios, da vuelta el muro,
// se vuelve el punto de la «i», se estira en el marco del formulario y aterriza en el isotipo.
import { clamp, lerp, ramp, E, ease, spring, wobble, bump, TAU, hash } from './lib.js';
import { EV, PENDIENTE, ctaTexto, SEGURA, APERTURA, COMUN } from './linea-de-tiempo.js';
import { shape, layout, fillGlyph, pathGlyph, CAP, XH } from './tipo.js';

export const W = 1080, H = 1920;
const CX = 540;
// Marca: marfil y verdes muestreados del logo original (cabeza clara #4C9F2D, nombre #142A22).
const IVORY = '#F9FAF5', INK = '#142A22', LEAF = '#4C9F2D', DEEP = '#0E2219', CARD = '#183A2C';
const IMG = ['#22503C', '#2A5A45', '#1E4434', '#30624C'], LITE = '#3F7C5D', DARK = '#132F24';
const MONO = 'JB, monospace';
const ink = a => `rgba(20,42,34,${a})`, ivo = a => `rgba(249,250,245,${a})`;

// ---------- configuración y cuadrícula medida ----------
let BT = null, VAR = 'A', REV = false, LOGO = null, CAPS = [];
export function configure({ beats, variant = 'A', revision = false, logo, capturas = [] }) { BT = beats.beats; VAR = variant; REV = revision; LOGO = logo; CAPS = capturas; }
export function B(n) {
  const P = BT[1] - BT[0], last = BT.length - 1;
  if (n <= 0) return BT[0] + n * P;
  if (n >= last) return BT[last] + (n - last) * P;
  const i = Math.floor(n);
  return BT[i] + (n - i) * (BT[i + 1] - BT[i]);
}

// ---------- utilidades de dibujo ----------
function blob(ctx, x, y, r, sx = 1, sy = 1, rot = 0) {
  if (r <= 0) return;
  ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(sx, sy);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore();
}
function rrect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function mono(ctx, str, x, y, size, color, align = 'left', weight = 500) {
  ctx.font = `${weight} ${size}px ${MONO}`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color; ctx.fillText(str, x, y);
}
const LAYOUTS = new Map(); // caché de composiciones de peso fijo (valores deterministas)
function cachedLayout(str, wght, size) {
  const k = str + '|' + wght + '|' + size;
  if (!LAYOUTS.has(k)) LAYOUTS.set(k, layout(str, wght, size));
  return LAYOUTS.get(k);
}
function text(ctx, str, x, y, size, wght, color, align = 'left') {
  const L = cachedLayout(str, wght, size);
  const x0 = align === 'center' ? x - L.width / 2 : align === 'right' ? x - L.width : x;
  ctx.fillStyle = color;
  for (const it of L.items) fillGlyph(ctx, it, x0, y, size);
  return L.width;
}
function shake(t, hits) {
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
const arc = (u, P, Q, h) => [lerp(P[0], Q[0], u), lerp(P[1], Q[1], u) - h * 4 * u * (1 - u)];

// ======================================================================
// EL MURO (beats 0–6): tarjetas de anuncios genéricos en un plano 3D que se desplaza
// ======================================================================
const CW = 340, CH = 436, PX = 372, PY = 468, FOC = 1800;
const COL_OFF = { '-3': 140, '-2': 300, '-1': 90, '0': 0, '1': 230, '2': 60, '3': 330 };
const HEADS = ['SE ARRIENDA', 'SE VENDE'];
const PRICE_R = ['$420', '$550', '$650', '$780', '$900', '$1.100'], PRICE_V = ['$78.000', '$95.000', '$120.000', '$165.000'];
const META = ['2 hab · 78 m²', '3 hab · 110 m²', '1 hab · 52 m²', '3 hab · 140 m²', '2 hab · 95 m²'];

function cardInfo(c, r) {
  const h = hash(c * 131 + r * 977, 3);
  const venta = h > 0.62;
  const k = Math.floor(hash(c * 71 + r * 13, 5) * 1000);
  if (c === 0 && r === 0) return { head: HEADS[0], price: '$650/mes', meta: '2 hab · 78 m²', img: 1, tone: IMG[1], stampText: 'YA SE ARRENDÓ' };
  return {
    head: venta ? HEADS[1] : HEADS[0],
    price: venta ? PRICE_V[k % PRICE_V.length] : PRICE_R[k % PRICE_R.length] + '/mes',
    meta: META[k % META.length], img: k % 3, tone: IMG[(k >> 2) % IMG.length],
    stampText: venta ? (k % 2 ? 'VENDIDO' : 'NO DISPONIBLE') : (k % 3 ? 'YA SE ARRENDÓ' : 'NO DISPONIBLE'),
  };
}

const vel = t => 950 * E.inOutCubic(ramp(t, 0.25, 1.1)) + 450 * ramp(t, 1.1, 2.0);
let scrollMemo = [NaN, 0];
function scrollAt(t) {
  const tt = Math.min(t, B(EV.congela));
  if (tt === scrollMemo[0]) return scrollMemo[1];
  let s = 0;
  const dt = 1 / 600;
  for (let x = 0.25; x < tt; x += dt) s += vel(Math.min(x + dt / 2, tt)) * Math.min(dt, tt - x);
  scrollMemo = [tt, s];
  return s;
}
// Cámara del muro; se congela en el beat de «congela».
function wallCam(t) {
  const tc = Math.min(t, B(EV.congela));
  const e = E.outExpo(ramp(tc, 0.06, 1.2));
  const Z = lerp(3.3, 1, e) * (1 - 0.06 * ramp(tc, 1.2, B(EV.congela)));
  const a = (24 * Math.PI) / 180 * E.inOutCubic(ramp(tc, 0.1, 1.35));
  const g = (-8 * Math.PI) / 180 * E.inOutCubic(ramp(tc, 0.1, 1.35));
  const sc = scrollAt(tc);
  const follow = 1 - E.inOutCubic(ramp(tc, 0.3, 1.35));
  return { Z, ca: Math.cos(a), sa: Math.sin(a), cg: Math.cos(g), sg: Math.sin(g), sc, fv: -sc * follow, C: [540, 930] };
}
function projRaw(u, v, cam) {
  const x1 = u * cam.cg - v * cam.sg, y1 = u * cam.sg + v * cam.cg;
  const y = y1 * cam.ca, z = -y1 * cam.sa, s = FOC / (FOC + z);
  return [x1 * s, y * s, z];
}
function project(u, v, cam) {
  const p = projRaw(u, v, cam), f = cam.f || (cam.f = projRaw(0, cam.fv, cam));
  return [cam.C[0] + (p[0] - f[0]) * cam.Z, cam.C[1] + (p[1] - f[1]) * cam.Z, p[2]];
}
const cardUV = (c, r, cam) => [c * PX, r * PY + COL_OFF[c] - cam.sc];

// la tarjeta más cercana a un punto de pantalla en un instante dado (determinista, memorizada)
const NEAR = new Map();
function cardNear(px, py, t) {
  const key = px + ',' + py + ',' + t.toFixed(5);
  if (NEAR.has(key)) return NEAR.get(key);
  const cam = wallCam(t);
  let best = null, bd = Infinity;
  for (let c = -3; c <= 3; c++) for (let r = -8; r <= 14; r++) {
    const [u, v] = cardUV(c, r, cam), p = project(u, v, cam), d = Math.hypot(p[0] - px, p[1] - py);
    if (d < bd) { bd = d; best = { c, r }; }
  }
  NEAR.set(key, best);
  return best;
}
const cardScreen = (card, t) => { const cam = wallCam(t), [u, v] = cardUV(card.c, card.r, cam); return project(u, v, cam); };

// sellos: el primero en el fotograma 0, la cascada y los que deja el punto (A)
const CASCADE_PTS = [[860, 1420], [230, 1560], [900, 360], [160, 300], [640, 1700], [980, 1080], [110, 1180]];
const HOP_PTS = [[800, 1230], [560, 1470], [270, 1290]];
let STAMPS = null;
function stamps() {
  if (STAMPS) return STAMPS;
  STAMPS = new Map();
  const add = (card, b, hero = false) => { const k = card.c + ',' + card.r; if (!STAMPS.has(k)) STAMPS.set(k, { t: B(b), hero }); };
  add({ c: 0, r: 0 }, EV.sello0, true);
  EV.cascada.forEach((b, i) => add(cardNear(CASCADE_PTS[i][0], CASCADE_PTS[i][1], B(b)), b));
  if (VAR === 'A') EV.saltosA.forEach((b, i) => add(cardNear(HOP_PTS[i][0], HOP_PTS[i][1], B(b)), b));
  return STAMPS;
}
let BUSCO = null; // B: la tarjeta que se voltea a «BUSCO»
const buscoCard = () => BUSCO || (BUSCO = cardNear(540, 470, B(EV.caeB)));
const BUSCO_POSE = { cx: 540, cy: 405, k: 1.25 };
// afín (a,b,c,d,e,f) de la tarjeta «BUSCO»: de su lugar en el muro a una pose fija delante del muro
function buscoAffine(t) {
  const card = buscoCard(), cam = wallCam(t), [u, v] = cardUV(card.c, card.r, cam);
  const p00 = project(u - CW / 2, v - CH / 2, cam), p10 = project(u + CW / 2, v - CH / 2, cam), p01 = project(u - CW / 2, v + CH / 2, cam);
  const wall = [(p10[0] - p00[0]) / CW, (p10[1] - p00[1]) / CW, (p01[0] - p00[0]) / CH, (p01[1] - p00[1]) / CH, p00[0], p00[1]];
  const { cx, cy, k } = BUSCO_POSE, fixed = [k, 0, 0, k, cx - (CW * k) / 2, cy - (CH * k) / 2];
  const L = spring(t - B(EV.caeB) - 0.04, 2.3, 0.72);
  return wall.map((w, i) => lerp(w, fixed[i], L));
}
const buscoPoint = (t, lx, ly) => { const m = buscoAffine(t); return [m[0] * lx + m[2] * ly + m[4], m[1] * lx + m[3] * ly + m[5]]; };

// ---------- el punto en la apertura ----------
const R_DOT = 44;
function dotOpening(t) {
  const c = 0.05;
  if (VAR === 'A') {
    const T = EV.saltosA.map(B), L = T.map((tt, i) => { const s = cardScreen(cardNear(HOP_PTS[i][0], HOP_PTS[i][1], tt), tt); return [s[0], s[1]]; });
    const t0 = B(1.75), S0 = [1180, 260], L4 = [70, 1560], tf = B(EV.congela);
    if (t < t0) return null;
    const segs = [[t0, T[0], S0, L[0], 260], [T[0], T[1], L[0], L[1], 230], [T[1], T[2], L[1], L[2], 230], [T[2], B(4.5), L[2], L4, 230]];
    const tt = Math.min(t, tf);
    for (const [a, b, P, Q, h] of segs) if (tt <= b || b === B(4.5)) {
      const u = clamp((tt - a) / (b - a));
      const p = arc(u, P, Q, h);
      return { x: p[0], y: p[1], r: R_DOT, impact: T.find(x => Math.abs(t - x) < c / 2 + 0.03 && t < tf) ?? null };
    }
  } else {
    const tb = B(EV.caeB), t0 = B(2.3);
    if (t < t0) return null;
    const s = buscoPoint(Math.min(t, B(EV.congela)), CW / 2, 228);
    if (t < tb) { const u = (t - t0) / (tb - t0), sb = buscoPoint(tb, CW / 2, 228); return { x: sb[0], y: lerp(-80, sb[1], E.inQuad(u)), r: R_DOT, impact: null }; }
    return { x: s[0], y: s[1], r: R_DOT, impact: t - tb < 0.08 ? tb : null };
  }
}

// ---------- tarjeta ----------
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
function drawFront(ctx, info, stampU, dim) {
  ctx.fillStyle = CARD; ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.fill();
  drawFacade(ctx, info, 16, 16, CW - 32, 238);
  text(ctx, info.head, 22, 296, 26, 700, ivo(0.82));
  mono(ctx, info.price, 22, 340, 30, ivo(0.95), 'left', 600);
  ctx.fillStyle = ivo(0.16); ctx.beginPath(); rrect(ctx, 22, 362, 220, 12, 6); rrect(ctx, 22, 386, 160, 12, 6); ctx.fill();
  mono(ctx, info.meta, 22, 420, 20, ivo(0.55));
  if (stampU !== null) {
    ctx.fillStyle = `rgba(14,34,25,${0.5 * dim})`; ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.fill();
    // el sello cae: grande → tamaño final con un pequeño rebote
    let sc, alpha;
    if (stampU < 0) { const k = 1 + stampU / 0.06; sc = lerp(1.8, 1, E.inQuad(k)); alpha = k; }
    else { sc = 1 + 0.06 * wobble(stampU, 9, 0.05); alpha = 1; }
    ctx.save(); ctx.translate(CW / 2, 138); ctx.rotate(-0.21); ctx.scale(sc, sc);
    ctx.globalAlpha = alpha * (1 - 0.5 * ramp(stampU, 0.3, 0.7));
    const L = cachedLayout(info.stampText, 800, 40), wBox = L.width + 44;
    ctx.strokeStyle = IVORY; ctx.lineWidth = 7; ctx.beginPath(); rrect(ctx, -wBox / 2, -38, wBox, 76, 12); ctx.stroke();
    ctx.fillStyle = IVORY; for (const it of L.items) fillGlyph(ctx, it, -L.width / 2, 14, 40);
    ctx.restore(); ctx.globalAlpha = 1;
  }
}
function drawBack(ctx, busco, fade) {
  ctx.fillStyle = IVORY; ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.fill();
  if (fade > 0) { ctx.strokeStyle = ink(0.1 * fade); ctx.lineWidth = 2; ctx.beginPath(); rrect(ctx, 1, 1, CW - 2, CH - 2, 22); ctx.stroke(); }
  if (busco) {
    text(ctx, 'BUSCO', 28, 168, 84, 800, INK);
    ctx.fillStyle = ink(0.13); ctx.beginPath();
    rrect(ctx, 28, 270, 270, 18, 9); rrect(ctx, 28, 316, 220, 18, 9); rrect(ctx, 28, 362, 170, 18, 9); ctx.fill();
  }
}

function sceneWall(ctx, t) {
  const cam = wallCam(t);
  const tOnda = B(EV.onda), origin = waveOrigin();
  // fondo: oscuro, y la onda lo vuelve marfil desde el punto
  ctx.fillStyle = DEEP; ctx.fillRect(0, 0, W, H);
  const Rw = (t - tOnda) * 5000 - 250;
  if (Rw > 0) { ctx.fillStyle = IVORY; ctx.beginPath(); ctx.arc(origin[0], origin[1], Rw, 0, TAU); ctx.fill(); }
  const st = stamps(), busco = VAR === 'B' ? buscoCard() : null;
  const list = [];
  const rr = Math.ceil((cam.sc + 3400) / PY);
  for (let c = -3; c <= 3; c++) for (let r = Math.floor((cam.sc - 3400) / PY); r <= rr; r++) {
    const [u, v] = cardUV(c, r, cam);
    const pc = project(u, v, cam);
    if (pc[0] < -700 || pc[0] > W + 700 || pc[1] < -700 || pc[1] > H + 700) continue;
    list.push({ c, r, u, v, pc });
  }
  list.sort((a, b) => b.pc[2] - a.pc[2]);
  for (const k of list) {
    const p00 = project(k.u - CW / 2, k.v - CH / 2, cam), p10 = project(k.u + CW / 2, k.v - CH / 2, cam), p01 = project(k.u - CW / 2, k.v + CH / 2, cam);
    const isBusco = busco && busco.c === k.c && busco.r === k.r;
    if (isBusco && t > B(EV.caeB) - 0.5) continue;
    // volteo: la onda sale del punto; la tarjeta «BUSCO» se voltea antes, con «tú»
    const d = Math.hypot(k.pc[0] - origin[0], k.pc[1] - origin[1]);
    const ts = isBusco ? B(EV.caeB) + 0.06 : tOnda + d / 5000;
    const th = Math.PI * E.inOutCubic(ramp(t, ts, ts + 0.3));
    const cos = Math.cos(th);
    const back = cos < 0;
    if (back && !isBusco && t > ts + 0.3 + 0.35) continue; // reverso marfil sobre fondo marfil: ya no se ve
    ctx.save();
    ctx.setTransform((p10[0] - p00[0]) / CW, (p10[1] - p00[1]) / CW, (p01[0] - p00[0]) / CH, (p01[1] - p00[1]) / CH, p00[0], p00[1]);
    ctx.translate(CW / 2, CH / 2); ctx.scale(Math.abs(cos) || 0.001, 1 + 0.07 * Math.sin(th)); ctx.translate(-CW / 2, -CH / 2);
    if (back) {
      const fade = isBusco ? 1 - ramp(t, B(4.6), B(5.1)) : 1 - ramp(t, ts + 0.3, ts + 0.65);
      ctx.globalAlpha = isBusco ? 1 : 1;
      drawBack(ctx, isBusco && t < B(5.2), fade);
    } else {
      const s = st.get(k.c + ',' + k.r);
      const su = s ? t - s.t : null;
      drawFront(ctx, cardInfo(k.c, k.r), su !== null && su > -0.06 ? su : null, s ? clamp((t - s.t) / 0.05) : 0);
    }
    ctx.restore();
  }
  // velo bajo el titular: el muro pasa a ser textura mientras se lee
  const veil = 0.5 * E.inOutCubic(ramp(t, 0.08, 0.4));
  if (veil > 0 && t < B(EV.onda) + 0.6) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H);
    if (Rw > 0) ctx.arc(origin[0], origin[1], Math.max(0, Rw), 0, TAU, true);
    ctx.clip('evenodd');
    // más denso detrás del titular, más liviano arriba y abajo: el muro sigue contando su historia en los bordes
    const { base, size } = hookMetrics(), y0 = base[0] - size, y1 = base[2] + size * 0.3;
    const g = ctx.createLinearGradient(0, y0 - 420, 0, y1 + 420);
    g.addColorStop(0, `rgba(14,34,25,${veil * 0.55})`); g.addColorStop(0.28, `rgba(14,34,25,${veil * 1.5})`);
    g.addColorStop(0.72, `rgba(14,34,25,${veil * 1.5})`); g.addColorStop(1, `rgba(14,34,25,${veil * 0.55})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  if (busco && t > B(EV.caeB) - 0.5) drawBusco(ctx, t);
  drawHookHeadline(ctx, t, origin, tOnda);
}
function drawBusco(ctx, t) {
  const m = buscoAffine(t), ts = B(EV.caeB) + 0.06;
  const th = Math.PI * E.inOutCubic(ramp(t, ts, ts + 0.3)), cos = Math.cos(th);
  const gone = ramp(t, B(4.35), B(4.85)); // al pasar la onda se funde con el marfil
  if (gone >= 1) return;
  ctx.save();
  ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
  ctx.translate(CW / 2, CH / 2); ctx.scale(Math.abs(cos) || 0.001, 1 + 0.07 * Math.sin(th)); ctx.translate(-CW / 2, -CH / 2);
  if (cos >= 0) drawFront(ctx, cardInfo(buscoCard().c, buscoCard().r), null, 0);
  else {
    ctx.fillStyle = IVORY; ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.fill();
    ctx.save(); ctx.beginPath(); rrect(ctx, 0, 0, CW, CH, 22); ctx.clip();
    const dy = E.inCubic(gone) * 260;
    text(ctx, 'BUSCO', 28, 168 + dy, 84, 800, INK);
    ctx.fillStyle = ink(0.13 * (1 - gone)); ctx.beginPath();
    rrect(ctx, 28, 290 + dy, 270, 18, 9); rrect(ctx, 28, 336 + dy, 220, 18, 9); rrect(ctx, 28, 382 + dy, 170, 18, 9); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
function waveOrigin() {
  if (VAR === 'B') return buscoPoint(B(EV.congela), CW / 2, CH / 2);
  const p = dotOpening(B(EV.congela));
  return [p.x, p.y];
}

// ---------- titular del gancho (marfil sobre el muro) ----------
let HOOK = null;
function hookMetrics() {
  if (HOOK) return HOOK;
  const all = [...APERTURA.A[0].texto, ...APERTURA.B[0].texto];
  const widest = Math.max(...all.map(s => layout(s, 800, 1000).width / 1000));
  const size = Math.min(150, Math.floor(900 / widest));
  HOOK = { size, x: 86, base: [780, 780 + size * 1.04, 780 + size * 2.08] };
  return HOOK;
}
function drawHookHeadline(ctx, t, origin, tOnda) {
  const lines = APERTURA[VAR][0].texto;
  const when = VAR === 'A' ? [0.25, 1, 2] : [0.25, 1.5, 3];
  const { size, x, base } = hookMetrics();
  lines.forEach((str, li) => {
    const t0 = B(when[li]) - 0.08;
    if (t < t0) return;
    const L = layout(str, i => lerp(380, 800, E.outCubic(ramp(t, t0 + 0.012 * i, t0 + 0.012 * i + 0.22))), size);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, base[li] - size * 1.1, W, size * 1.38); ctx.clip();
    ctx.fillStyle = IVORY;
    L.items.forEach((it, i) => {
      const rise = (1 - spring(t - t0 - 0.014 * i, 3.2, 0.62)) * size * 1.15;
      // la onda del giro también voltea las letras
      const gx = x + it.cx, d = Math.hypot(gx - origin[0], base[li] - size * 0.35 - origin[1]);
      const th = Math.PI * E.inOutCubic(ramp(t, tOnda + d / 5000, tOnda + d / 5000 + 0.26));
      if (th >= Math.PI / 2) return;
      fillGlyph(ctx, it, x, base[li], size, { dy: rise, sx: Math.cos(th) });
    });
    ctx.restore();
  });
}

// ======================================================================
// TITULAR «Publica lo que buscas.» — sube, recibe el punto en la «i» y viaja a la cabecera
// ======================================================================
const WORDS = ['Publıca', 'lo', 'que', 'buscas.'];
let TIT = null;
function titMetrics() {
  if (TIT) return TIT;
  const big = Math.min(176, Math.floor(900 / Math.max(...['Publica', 'lo que', 'buscas.'].map(s => layout(s, 800, 1000).width / 1000))));
  const head = Math.min(92, Math.floor(900 / (layout('Publica lo que buscas.', 760, 1000).width / 1000)));
  const b0 = 790, lh = big * 1.04, space = layout(' ', 800, big).width;
  const lo = layout('lo', 800, big).width;
  const bigPose = [[86, b0], [86, b0 + lh], [86 + lo + space, b0 + lh], [86, b0 + 2 * lh]];
  const headPose = []; let hx = 90;
  for (const w of WORDS) { headPose.push([hx, 410]); hx += layout(w, 760, head).width + layout(' ', 760, head).width; }
  // la tilde real de Outfit (para que el punto ocupe exactamente su lugar)
  const gi = shape('i', 800), gd = shape('ı', 800);
  const pts = gi.pts; let sx = 0, sy = 0, n = 0, ymin = 0;
  for (let k = 0; k < pts.length; k += 2) if (pts[k + 1] < gd.ymin - 30) { sx += pts[k]; sy += pts[k + 1]; n++; ymin = Math.min(ymin, pts[k + 1]); }
  const tilde = { cx: sx / n, cy: sy / n, r: sy / n - ymin }; // en em*1000, relativos al origen del glifo
  TIT = { big, head, bigPose, headPose, tilde, gi, gd };
  return TIT;
}
function titPose(t, w) {
  const m = titMetrics();
  const s = spring(t - (B(7.45) + 0.03 * w), 3.0, 0.72);
  const [bx, by] = m.bigPose[w], [hx, hy] = m.headPose[w];
  return { x: lerp(bx, hx, s), y: lerp(by, hy, s), size: lerp(m.big, m.head, s), wght: lerp(800, 760, s) };
}
// peso por letra: onda que sale de la «i» cuando cae el punto
const wordWeight = (t, w, base) => i => {
  const d = w === 0 ? Math.abs(i - 4) : 4 + i;
  return base - 380 * bump(t, B(EV.tilde) + 0.03 * d, B(EV.tilde) + 0.03 * d + 0.4, 0.22);
};
// posición de la tilde de la «i» de «Publica» en pantalla
function tildeAt(t) {
  const m = titMetrics(), p = titPose(t, 0);
  const L = layout('Publı', wordWeight(t, 0, p.wght), p.size);
  const it = L.items[4];
  const sq = istemSquash(t);
  const k = p.size / 1000;
  return { x: p.x + it.x + m.tilde.cx * k, y: p.y + (m.tilde.cy * k) * sq, r: m.tilde.r * k };
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
  const rollOut = ramp(t, B(EV.rotulos[0]) - 0.12, B(EV.rotulos[0]) - 0.0);
  if (rollOut >= 1) return;
  ctx.save();
  if (rollOut > 0 || t > B(8)) { ctx.beginPath(); ctx.rect(0, 410 - m.head * 1.05, W, m.head * 1.4); if (t < B(9)) ctx.rect(0, 0, W, H); ctx.clip(); }
  WORDS.forEach((word, w) => {
    const p = titPose(t, w);
    const line = w === 0 ? 0 : w === 3 ? 2 : 1;
    const L = layout(word, wordWeight(t, w, p.wght), p.size);
    ctx.fillStyle = INK;
    L.items.forEach((it, i) => {
      const rise = (1 - spring(t - t0 - 0.05 * line - 0.012 * i, 3.0, 0.6)) * p.size * 1.12;
      const sy = w === 0 && i === 4 ? istemSquash(t) : 1;
      ctx.save();
      if (t < B(7)) { ctx.beginPath(); ctx.rect(0, p.y - p.size * 1.1, W, p.size * 1.36); ctx.clip(); }
      fillGlyph(ctx, it, p.x, p.y - rollOut * m.head * 1.3, p.size, { dy: rise, sy });
      ctx.restore();
    });
    // la «i» recupera su tilde de tinta cuando el punto se va
    if (w === 0 && t > B(EV.salto)) {
      const td = tildeAt(t), k = spring(t - B(EV.salto) - 0.05, 3, 0.5);
      ctx.fillStyle = INK; blob(ctx, td.x, td.y - rollOut * m.head * 1.3, td.r * k);
    }
  });
  ctx.restore();
}

// ======================================================================
// MARCO, FORMULARIO REAL Y CABECERA (beats 8–20)
// ======================================================================
const FR = { x: 90, y: 470, w: 900, h: 770 }, FC = [FR.x + FR.w / 2, FR.y + FR.h / 2];
function frameState(t) {
  // abre: el punto se estira (ancho antes que alto) y luego el verde se abre
  const r = R_DOT;
  let w = lerp(2 * r, FR.w, spring(t - B(EV.marco) - 0.05, 1.9, 0.64));
  let h = lerp(2 * r, FR.h, spring(t - B(EV.marco) - 0.13, 1.9, 0.62));
  let open = E.outCubic(ramp(t, B(EV.abre), B(EV.abre) + 0.5));
  // se estrecha sobre el botón «Publicar solicitud»
  h = lerp(h, BOTON_H, E.inOutCubic(ramp(t, B(EV.boton) - 0.3, B(EV.boton) + 0.02)));
  // recoge: el contenido se cierra, el marco se encoge con anticipación y vuelve a ser el punto
  const tc = B(EV.recoge);
  if (t > tc - 0.25) {
    open *= 1 - E.inCubic(ramp(t, tc - 0.25, tc));
    const k = E.inBack(ramp(t, tc, tc + 0.28));
    w = lerp(w, 2 * r, k); h = lerp(h, 2 * r, k);
  }
  return { w, h, rad: Math.min(Math.min(w, h) / 2, lerp(r, 40, ramp(Math.min(w, h), 2 * r, 300))), open };
}
// ---------- el formulario real (capturas de producto) ----------
// Coordenadas de «página» en px de las capturas de 800 × 500: las cinco se apilan según su desplazamiento medido.
const PAGE = { x0: 218, x1: 582, cx: 400, h: 1287, bg: '#F7F8FC' };
const OFF = [0, 0, 264, 357, 787];                     // desplazamiento de cada captura en la página
const LLENO = [[1, 0, 357], [3, 357, 812], [4, 812, 1287]]; // [captura, desde, hasta]: el formulario lleno, sin costuras visibles
const TARJETAS = [[126, 215], [233, 330], [347, 433], [450, 725]]; // ¿Qué buscas? · Ubicación · Presupuesto · Características
const VACIO = [[0, 118, 225], [0, 225, 340], [0, 340, 443], [2, 443, 735]]; // la misma tarjeta, vacía
const BOTON_Y = 1250, BOTON_H = 210;
function camForm(t) {
  // la cámara se adelanta un poco al beat para que el encuadre llegue con la cabecera
  let cy = 160;
  const keys = [[B(EV.rotulos[0]), 170.5], [B(EV.rotulos[1]), 281.5], [B(EV.rotulos[2]), 390], [B(EV.rotulos[3]), 587.5], [B(EV.boton), BOTON_Y]];
  keys[4][0] = B(EV.boton) + 0.15; // primero se estrecha la ventana, después baja
  for (const [tb, y] of keys) cy = lerp(cy, y, spring(t - tb + 0.12, 2.7, 0.82));
  return cy;
}
// acercamiento: la página completa al abrir, las tarjetas un poco más cerca, el botón mucho más cerca
function kForm(t) {
  let k = 900 / (PAGE.x1 - PAGE.x0);
  k = lerp(k, 900 / 332, spring(t - B(EV.rotulos[1]) + 0.12, 2.7, 0.82)); // se acerca cuando el título ya salió de cuadro
  k = lerp(k, 4.0, spring(t - B(EV.boton) - 0.03, 2.7, 0.82));
  return k;
}
function drawCap(ctx, i, y0, y1, map) {
  const im = CAPS[i]; if (!im) return;
  const sf = im.naturalWidth / 800;           // admite originales en mayor resolución
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
    const u = E.inOutCubic(ramp(t, B(EV.rellena[n]), B(EV.rellena[n]) + 0.32));
    if (u >= 1 || b < vy0 || a > vy1) return;
    const [rx] = map(lerp(223, 577, u), 0);
    ctx.save(); ctx.beginPath(); ctx.rect(rx, y, x + w - rx, h); ctx.clip();
    drawCap(ctx, i, Math.max(a, vy0), Math.min(b, vy1), map);
    ctx.restore();
  });
  // foco: la tarjeta que nombra la cabecera queda iluminada; el resto se atenúa
  const idx = rotuloIndex(t);
  const dim = 0.6 * ramp(t, B(EV.rotulos[0]) - 0.1, B(EV.rotulos[0]) + 0.15) * (1 - ramp(t, B(EV.boton) - 0.1, B(EV.boton) + 0.1));
  if (dim > 0.01 && idx >= 0) {
    let [a, b] = TARJETAS[idx];
    if (idx > 0) { const [pa, pb] = TARJETAS[idx - 1], s2 = spring(t - B(EV.rotulos[idx]) + 0.12, 2.7, 0.82); a = lerp(pa, a, s2); b = lerp(pb, b, s2); }
    const [fx0, fy0] = map(221, a - 3), [fx1, fy1] = map(579, b + 3);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); rrect(ctx, fx0, fy0, fx1 - fx0, fy1 - fy0, 10 * k); ctx.clip('evenodd');
    ctx.fillStyle = `rgba(247,248,252,${dim})`; ctx.fillRect(x, y, w, h); ctx.restore();
  }
}
const rotuloIndex = t => { let k = -1; EV.rotulos.forEach((b, i) => { if (t >= B(b) - 0.06) k = i; }); return t >= B(EV.rotulosFuera) ? -1 : k; };
function drawFrame(ctx, t) {
  if (t < B(EV.marco) || t > B(EV.recoge) + 0.3) return null;
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
function drawRotulos(ctx, t) {
  const m = titMetrics(), size = 96, base = 410;
  ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.0, W, size * 1.32); ctx.clip();
  EV.rotulos.forEach((b, i) => {
    const tin = B(b), tout = i < EV.rotulos.length - 1 ? B(EV.rotulos[i + 1]) : B(EV.rotulosFuera);
    if (t < tin - 0.12 || t > tout + 0.1) return;
    const dyIn = (1 - spring(t - tin + 0.1, 3.6, 0.66)) * size * 1.25;
    const dyOut = -E.inCubic(ramp(t, tout - 0.12, tout)) * size * 1.25;
    text(ctx, COMUN[2].texto[i], 90, base + dyIn + dyOut, size, 760, INK);
  });
  ctx.restore();
  void m;
}

// ---------- el punto después de la apertura ----------
const LOGO_S = 0.76, LOGO_CONTENT = { x0: 72, y0: 73, x1: 1135, y1: 357 }, HEAD_L = { x: 319.5, y: 108.5, r: 36 };
const LOGO_X = CX - ((LOGO_CONTENT.x0 + LOGO_CONTENT.x1) / 2) * LOGO_S, LOGO_Y = 690 - LOGO_CONTENT.y0 * LOGO_S;
const ISO_DX = CX - (LOGO_X + ((LOGO_CONTENT.x0 + 393) / 2) * LOGO_S); // isotipo centrado mientras no está el nombre
const HEAD_SCREEN = [LOGO_X + HEAD_L.x * LOGO_S + ISO_DX, LOGO_Y + HEAD_L.y * LOGO_S, HEAD_L.r * LOGO_S];
const isoShift = t => ISO_DX * (1 - spring(t - B(EV.nombre) + 0.05, 2.4, 0.78));
function dotMain(t) {
  // apertura → caída a la tilde
  const tFree = B(4.75), tT = B(EV.tilde);
  if (t < tFree) {
    const p = dotOpening(t);
    return p && { ...p, sx: 1, sy: 1 };
  }
  const td = tildeAt(Math.max(t, tT));
  if (t < tT) {
    const p0 = dotOpening(B(EV.congela)), u = (t - tFree) / (tT - tFree);
    const r = lerp(R_DOT, td.r, E.inCubic(u));
    // cae con gravedad hacia la tilde, con un pequeño impulso hacia arriba al soltarse
    // salto balístico: siempre llega a la «i» bajando, venga de arriba (B) o de abajo (A)
    const h = Math.max(150, (p0.y - td.y) / 4 + 220);
    const [x, y] = arc(u, [p0.x, p0.y], [td.x, td.y], h);
    return { x, y, r, sx: 1, sy: 1, stretch: true };
  }
  const tS = B(EV.salto), tM = B(EV.marco);
  if (t < tS) { const imp = t - tT; const a = imp < 0.07 ? 0.45 * Math.sin((Math.PI * imp) / 0.07) : 0; return { x: td.x, y: td.y + td.r * a, r: td.r, sx: 1 + a, sy: 1 - a }; }
  if (t < tM) {
    const u = (t - tS) / (tM - tS), src = tildeAt(tS);
    const p = arc(E.inOutCubic(u) * 0.3 + u * 0.7, [src.x, src.y], FC, 160);
    return { x: p[0], y: p[1], r: lerp(td.r, R_DOT, E.outCubic(u)), sx: 1, sy: 1, stretch: true };
  }
  const tR = B(EV.recoge) + 0.28, tV = B(EV.vuelo[0]), tI = B(EV.isotipo);
  if (t < tR) return null; // es el marco
  if (t < tI) {
    const u = clamp((t - Math.max(tR, tV)) / (tI - Math.max(tR, tV)));
    const p = arc(E.inOutCubic(u), FC, [HEAD_SCREEN[0], HEAD_SCREEN[1]], 260);
    return { x: p[0], y: p[1], r: lerp(R_DOT, HEAD_SCREEN[2], E.inOutCubic(u)), sx: 1, sy: 1, stretch: true };
  }
  const imp = t - tI;
  const a = imp < 0.07 ? 0.4 * Math.sin((Math.PI * imp) / 0.07) : 0;
  return { x: HEAD_SCREEN[0], y: HEAD_SCREEN[1] + HEAD_SCREEN[2] * a, r: HEAD_SCREEN[2], sx: 1 + a, sy: 1 - a, fade: 1 - ramp(t, tI + 0.12, tI + 0.2) };
}
function drawDot(ctx, t) {
  const p = dotMain(t);
  if (!p) return;
  let { x, y, r, sx = 1, sy = 1 } = p, rot = 0;
  if (p.stretch || (t < B(4) && !p.impact)) { // estiramiento según la velocidad
    const h = 1 / 240, a = dotMain(t - h), b = dotMain(t + h);
    if (a && b) {
      const vx = (b.x - a.x) / (2 * h), vy = (b.y - a.y) / (2 * h), sp = Math.hypot(vx, vy);
      const par = 1 + Math.min(0.6, sp / 3200); sx = par; sy = 1 / Math.sqrt(par); rot = Math.atan2(vy, vx);
    }
  }
  if (p.impact) { const u = clamp((t - p.impact + 0.035) / 0.07); const a = 0.45 * Math.sin(Math.PI * u); sx = 1 + a; sy = 1 - a; rot = 0; y += r * a; }
  ctx.globalAlpha = p.fade ?? 1;
  const rim = 1 - ramp(t, B(EV.onda), B(EV.onda) + 0.3); // sobre el muro oscuro, un aro marfil lo separa
  if (rim > 0 && t > 0) { ctx.fillStyle = ivo(rim); blob(ctx, x, y, r + 5, sx, sy, rot); }
  ctx.fillStyle = LEAF; blob(ctx, x, y, r, sx, sy, rot);
  ctx.globalAlpha = 1;
}

// ======================================================================
// CIERRE: logo original (sin deformar, escala uniforme ≤ 100 %) + CTA
// ======================================================================
const SPLIT = 425; // en el PNG: a la izquierda el isotipo, a la derecha el nombre
function drawClose(ctx, t) {
  const tI = B(EV.isotipo);
  if (t < tI || !LOGO) return;
  const push = 1 + 0.02 * E.outCubic(ramp(t, tI, B(32)));
  ctx.save();
  ctx.translate(CX, 940); ctx.scale(push, push); ctx.translate(-CX, -940);
  const w = 1208 * LOGO_S, h = 431 * LOGO_S;
  // el logo se mueve como una sola pieza: centrado (solo isotipo) → a su lugar cuando sube el nombre
  const off = t < B(EV.nombre) - 0.05 ? ISO_DX : isoShift(t);
  const R = lerp(HEAD_SCREEN[2], 380, E.outCubic(ramp(t, tI + 0.02, tI + 0.6)));
  ctx.save(); ctx.translate(off, 0);
  ctx.beginPath(); ctx.arc(HEAD_SCREEN[0] - ISO_DX, HEAD_SCREEN[1], R, 0, TAU); ctx.clip(); // se revela desde la cabeza clara
  ctx.beginPath(); ctx.rect(0, 0, LOGO_X + SPLIT * LOGO_S, H); ctx.clip();
  ctx.drawImage(LOGO, LOGO_X, LOGO_Y, w, h); ctx.restore();
  // nombre: sube desde su propia línea base mientras el logo se acomoda
  const tN = B(EV.nombre);
  if (t > tN) {
    const dy = (1 - spring(t - tN - 0.06, 2.6, 0.72)) * 80;
    ctx.save(); ctx.translate(off, 0); ctx.beginPath();
    ctx.rect(LOGO_X + SPLIT * LOGO_S, LOGO_Y + (LOGO_CONTENT.y0 - 6) * LOGO_S, w, (LOGO_CONTENT.y1 - LOGO_CONTENT.y0 + 12) * LOGO_S); ctx.clip();
    ctx.drawImage(LOGO, LOGO_X, LOGO_Y + dy, w, h); ctx.restore();
  }
  // botón CTA
  const tc = B(EV.cta);
  if (t > tc) {
    const bw = 840 * spring(t - tc, 2.3, 0.72), bh = 132 * Math.min(1, spring(t - tc, 3.2, 0.8)), by = 1040;
    ctx.fillStyle = INK; ctx.beginPath(); rrect(ctx, CX - bw / 2, by - bh / 2, bw, bh, bh / 2); ctx.fill();
    const label = ctaTexto(), size = 52;
    const L = cachedLayout(label, 600, size), arrowW = 56, total = L.width + 26 + arrowW;
    const x0 = CX - total / 2, base = by + size * 0.36;
    const tu = spring(t - tc - 0.22, 3, 0.7);
    ctx.save(); ctx.beginPath(); rrect(ctx, CX - bw / 2, by - bh / 2, bw, bh, bh / 2); ctx.clip();
    ctx.fillStyle = IVORY;
    for (const it of L.items) fillGlyph(ctx, it, x0, base + (1 - tu) * 90, size);
    // flecha: empuja hacia la derecha en los beats del final
    const nudge = EV.empujes.reduce((s, b) => s + 14 * bump(t, B(b), B(b) + 0.36, 0.3), 0);
    text(ctx, '→', x0 + L.width + 26 + nudge, base + (1 - tu) * 90, size, 600, LEAF);
    // «gratis»: marcado como pendiente mientras no se confirme
    if (PENDIENTE.gratis === 'pendiente') {
      const gi = label.indexOf('gratis');
      const a = L.items[gi], b = L.items[gi + 5];
      ctx.setLineDash([8, 7]); ctx.strokeStyle = LEAF; ctx.lineWidth = 3;
      ctx.beginPath(); rrect(ctx, x0 + a.x - 8, base - size * 0.82 + (1 - tu) * 90, b.x + b.w - a.x + 16, size * 1.08, 10); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
    if (PENDIENTE.gratis === 'pendiente' && t > tc + 0.3) mono(ctx, '«gratis» · pendiente de confirmar', CX, by + bh / 2 + 54, 26, ink(0.62), 'center', 600);
  }
  ctx.restore();
}

// ======================================================================
function revisionOverlay(ctx, t) {
  ctx.save();
  ctx.setLineDash([14, 10]); ctx.strokeStyle = 'rgba(226,61,40,0.9)'; ctx.lineWidth = 3;
  ctx.strokeRect(SEGURA.x0, SEGURA.y0, SEGURA.x1 - SEGURA.x0, SEGURA.y1 - SEGURA.y0); ctx.setLineDash([]);
  const all = [...APERTURA[VAR], ...COMUN];
  const sc = all.find(s => t >= B(s.b0) && t < B(s.b1)) || all[all.length - 1];
  ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0, 0, W, 150);
  mono(ctx, `v1 · ${VAR} · ${t.toFixed(2).replace('.', ',')} s · beat ${((t - BT[0]) / (BT[1] - BT[0])).toFixed(2)}`, 40, 62, 34, '#fff', 'left', 600);
  mono(ctx, `${sc.id} · ${sc.nombre}`, 40, 115, 32, '#c8f0b0');
  ctx.restore();
}

export function draw(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  const wallOn = t < B(5.6);
  if (wallOn) sceneWall(ctx, t);
  else { ctx.fillStyle = IVORY; ctx.fillRect(0, 0, W, H); }
  const [kx, ky] = shake(t, [[B(0), 16], [B(EV.tilde), 5], [B(EV.marco), 6], [B(EV.isotipo), 6]]);
  ctx.save(); ctx.translate(kx, ky);
  const dotUnder = t > B(EV.salto) && t < B(EV.marco); // mientras las palabras suben, el punto pasa por detrás
  if (dotUnder) drawDot(ctx, t);
  drawTitular(ctx, t);
  drawFrame(ctx, t);
  if (t > B(EV.rotulos[0]) - 0.15 && t < B(EV.rotulosFuera) + 0.2) drawRotulos(ctx, t);
  drawClose(ctx, t);
  if (!dotUnder) drawDot(ctx, t);
  ctx.restore();
  if (REV) revisionOverlay(ctx, t);
}
