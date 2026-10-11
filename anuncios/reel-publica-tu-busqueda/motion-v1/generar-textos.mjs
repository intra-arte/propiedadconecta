// Genera desde src/linea-de-tiempo.js (y la cuadrícula medida en beats.json):
//   guion-tecnico.md · subtitulos/v1-A.srt · subtitulos/v1-B.srt · locucion/guion-locucion-v1.txt
// Todo dentro de motion-v1/: los archivos del v0 no se tocan.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { BPM, DURACION, PENDIENTE, APERTURA, COMUN, EV, LOCUCION, SEGURA, lineasVoz, ctaTexto } from './src/linea-de-tiempo.js';

const here = p => new URL(p, import.meta.url);
const beats = JSON.parse(readFileSync(here('./beats.json'))).beats, P = beats[1] - beats[0];
const S = b => Math.min(DURACION, Math.max(0, beats[0] + b * P)); // beat → segundos, con la cuadrícula medida
const coma = (n, d = 2) => Number(n).toFixed(d).replace('.', ',');

// sílabas: mismo criterio que el generador del v0
const VOCALES = 'aeiouáéíóúü', DEBILES = 'iuü';
function silabasPalabra(p) {
  p = p.replace(/qu(?=[eiéí])/g, 'q').replace(/gu(?=[eiéí])/g, 'g');
  if (p === 'y') return 1;
  p = p.replace(/y$/, 'i');
  let n = 0, previa = '';
  for (const c of p) { if (VOCALES.includes(c)) { if (!(previa && (DEBILES.includes(c) || DEBILES.includes(previa)))) n++; previa = c; } else previa = ''; }
  return Math.max(n, 1);
}
const palabras = t => t.toLowerCase().replace(/[^a-záéíóúüñ\s]/g, ' ').split(/\s+/).filter(Boolean);
const silabas = t => palabras(t).reduce((s, p) => s + silabasPalabra(p), 0);
const ritmo = l => { const sil = silabas(l.texto), dur = l.fin - l.inicio, sps = sil / dur; return { sil, dur, sps, juicio: sps <= LOCUCION.ritmo.natural ? 'natural' : sps <= LOCUCION.ritmo.agil ? 'ágil' : 'ACELERADO' }; };

const escenas = v => [...APERTURA[v], ...COMUN];
const pend = Object.entries(PENDIENTE).filter(([, e]) => e === 'pendiente').map(([k]) => k);

// ---------- guion técnico ----------
let md = `# Guion técnico — v1 de motion

Generado desde [src/linea-de-tiempo.js](src/linea-de-tiempo.js) con \`node generar-textos.mjs\`. **No editar a mano.**

**${coma(DURACION, 1)} s** · ${BPM} BPM (1 beat = 0,5 s, 32 beats = 8 compases) · 1080 × 1920 · 30 fps · tiempos en segundos según la cuadrícula **medida** (\`beats.json\`: ${coma(60 / P, 2)} BPM, desfase ${coma(beats[0] * 1000, 1)} ms).
Zona segura para texto y logo: x ${SEGURA.x0}–${SEGURA.x1}, y ${SEGURA.y0}–${SEGURA.y1} (la misma del v0).

**Pendiente de confirmar:** ${pend.map(p => ({ gratis: '«gratis» en el CTA', capturas: 'capturas del formulario (escena P)', voz: 'grabación de la voz', rotulos: 'rótulos del formulario' })[p]).join(' · ')}.

A y B comparten todo desde el beat 6 (${coma(S(6))} s). Solo cambia la apertura.
`;
for (const v of ['A', 'B']) {
  md += `\n## Versión ${v}${v === 'A' ? ' — directa' : ' — curiosidad'}\n\n| Escena | Beats | Inicio (s) | Fin (s) | Texto en pantalla | Qué pasa |\n|---|---|---|---|---|---|\n`;
  for (const e of escenas(v)) {
    if (v === 'B' && !e.id.startsWith('B') && e.b0 < 6) continue;
    const txt = e.reservado ? e.texto.map(t => `«${t}»`).join(' → ') + ' *(rótulos por confirmar)*' : e.texto.length ? '«' + e.texto.join(' ').replace('Publica gratis tu búsqueda', ctaTexto()) + '»' : '—';
    md += `| ${e.id} · ${e.nombre} | ${coma(e.b0)}–${coma(e.b1)} | ${coma(S(e.b0))} | ${coma(S(e.b1))} | ${txt} | ${e.visual} |\n`;
  }
}
md += `\n## Eventos de imagen y sonido (beat → segundo)\n\n| Evento | Beat | Segundo | Imagen | Sonido |\n|---|---|---|---|---|\n`;
const evRows = [
  ['Primer sello', EV.sello0, '«YA SE ARRENDÓ» cae sobre el anuncio en el primer fotograma', 'golpe de sello + grave'],
  ['Sellos en cascada', EV.cascada.map(coma).join(' · '), 'otros anuncios quedan sellados', 'sellos más livianos, abiertos en estéreo'],
  ['A: el punto persigue', EV.saltosA.map(coma).join(' · '), 'cada anuncio que toca el punto queda «NO DISPONIBLE»', 'marimba fa#–la–si + sello'],
  ['B: el punto cae', EV.caeB, 'la tarjeta se voltea a «BUSCO» y se despega del muro', 'marimba si + latigazo de volteo'],
  ['Congela', EV.congela, 'todo se detiene', 'freno de cinta, silencio'],
  ['Onda', EV.onda, 'los anuncios se voltean desde el punto; el fondo pasa a marfil', 'cascada de clics de papel'],
  ['Titular', EV.titular, '«Publica lo que buscas.» sube', 'acorde re mayor (piano FM) + bombo suave'],
  ['Tilde', EV.tilde, 'el punto cae como punto de la «i»; onda de peso en la palabra', 'marimba re (la voz del punto)'],
  ['Salto', EV.salto, 'el punto deja la «i»; las palabras van a la cabecera', 'marimba la'],
  ['Marco', EV.marco, 'el punto se estira hasta ser el marco', 'grave + barrido'],
  ['Abre', EV.abre, 'el verde se abre: espacio reservado del formulario', 'arpegio re–fa#–la–re'],
  ['Rótulos', EV.rotulos.map(coma).join(' · '), 'la cabecera rueda: tipo · ubicación · presupuesto · características', 'marimba re–fa#–la–si'],
  ['Recoge', EV.recoge, 'el marco se recoge en el punto', 'platillo invertido + barrido'],
  ['Vuelo', `${coma(EV.vuelo[0])}–${coma(EV.vuelo[1])}`, 'el punto vuela hasta la cabeza clara del isotipo', 'barrido + subida'],
  ['Isotipo', EV.isotipo, 'aterriza; el isotipo original se revela desde la cabeza', 'firma sonora: re + acorde re mayor 9'],
  ['CTA', EV.cta, 'sube el botón', 'firma sonora: la'],
  ['Nombre', EV.nombre, 'el logo se acomoda y sube el nombre', 'firma sonora: fa# + campana'],
  ['Empujes', EV.empujes.map(coma).join(' · '), 'la flecha del botón empuja', 'clic suave'],
];
for (const [n, b, img, snd] of evRows) md += `| ${n} | ${typeof b === 'number' ? coma(b) : b} | ${typeof b === 'number' ? coma(S(b)) : '—'} | ${img} | ${snd} |\n`;
for (const v of ['A', 'B']) {
  md += `\n## Locución ${v} (pendiente de grabar)\n\nRitmo: «natural» ≤ ${coma(LOCUCION.ritmo.natural, 1)} sílabas/s · «ágil» ≤ ${coma(LOCUCION.ritmo.agil, 1)}.\n\n| Línea | Inicio (s) | Fin (s) | Texto | Sílabas | Síl./s | Ritmo |\n|---|---|---|---|---|---|---|\n`;
  for (const l of lineasVoz(v)) { const r = ritmo(l); md += `| ${l.id} | ${coma(l.inicio)} | ${coma(l.fin)} | ${l.texto} | ${r.sil} | ${coma(r.sps, 1)} | ${r.juicio} |\n`; }
  const fin = Math.max(...lineasVoz(v).map(l => l.fin));
  md += `\nLa voz termina en ${coma(fin)} s: quedan ${coma(DURACION - fin, 1)} s de cierre sin voz con el logo y el CTA completos.\n`;
}
md += `\nToda la locución aparece también como texto en pantalla (titulares, cabecera o botón). Los subtítulos \`.srt\` son para la plataforma; no se queman.\n`;
writeFileSync(here('./guion-tecnico.md'), md);

// ---------- subtítulos ----------
const tc = s => { const ms = Math.round(s * 1000), p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
mkdirSync(here('./subtitulos/'), { recursive: true });
for (const v of ['A', 'B']) writeFileSync(here(`./subtitulos/v1-${v}.srt`), lineasVoz(v).map((l, i) => `${i + 1}\n${tc(l.inicio)} --> ${tc(l.fin)}\n${l.texto}\n`).join('\n'));

// ---------- guion de locución ----------
let loc = `PROPIEDAD CONECTA — «Publica lo que buscas» — Locución de la v1 de motion (${coma(DURACION, 1)} s)
Generado desde motion-v1/src/linea-de-tiempo.js con «node generar-textos.mjs». No editar a mano.

ESTADO: PENDIENTE DE GRABAR. El video final no tiene voz todavía; la música ya baja 5 dB
bajo cada línea para dejarle sitio. Al grabar, dejar cada toma dentro de su intervalo.

${LOCUCION.voz}
Ritmo: hasta ${coma(LOCUCION.ritmo.natural, 1)} sílabas por segundo suena tranquilo; más de ${coma(LOCUCION.ritmo.agil, 1)} se oye apurado.
${PENDIENTE.gratis === 'pendiente' ? '\n«gratis» está PENDIENTE DE CONFIRMAR: grabar L4 en las dos variantes («Publica gratis tu búsqueda.» y «Publica tu búsqueda.»).\n' : ''}`;
for (const v of ['A', 'B']) {
  loc += `\n==============================================================\nVERSIÓN ${v} ${v === 'A' ? '(directa)' : '(curiosidad) — solo cambia la primera línea'}\n==============================================================\n\n`;
  for (const l of lineasVoz(v)) { if (v === 'B' && !l.id.startsWith('LB') && l.id !== 'L2' && false) continue; const r = ritmo(l); loc += `[${coma(l.inicio)}–${coma(l.fin)}]  ${l.texto}\n               (${l.direccion} · ${r.sil} sílabas en ${coma(r.dur)} s = ${coma(r.sps, 1)} síl./s, ${r.juicio})\n\n`; }
}
mkdirSync(here('./locucion/'), { recursive: true });
writeFileSync(here('./locucion/guion-locucion-v1.txt'), loc);
console.log('escritos guion-tecnico.md, subtitulos/v1-A.srt, subtitulos/v1-B.srt, locucion/guion-locucion-v1.txt');
