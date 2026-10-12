// Genera desde guion.js, la cuadrícula medida (beats.json) y los tiempos reales de la
// voz (locucion/colocacion.json, de voz.mjs):
//   guion-tecnico.md · subtitulos/<ARCHIVO>-{A,B}.srt · locucion/guion-locucion.txt
// Todo se escribe dentro de la carpeta del anuncio.
// Uso: node motor/herramientas/generar-textos.mjs --anuncio <carpeta>
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { ruta, G, coma } from './comun.mjs';
import { SEGURA } from '../nucleo/marca.js';

const { BPM, BEATS, DURACION, PENDIENTE, APERTURA, COMUN, LOCUCION, lineasVoz, ctaTexto, TITULO, ARCHIVO, EVENTOS } = G;

const beats = JSON.parse(readFileSync(ruta('beats.json'))).beats, P = beats[1] - beats[0];
const S = b => Math.min(DURACION, Math.max(0, beats[0] + b * P)); // beat → segundos, con la cuadrícula medida
// tiempos reales de la voz; sin colocacion.json, los huecos planeados de la línea de tiempo
const COLOC = existsSync(ruta('locucion', 'colocacion.json')) ? JSON.parse(readFileSync(ruta('locucion', 'colocacion.json'))) : null;
const voz = v => COLOC ? COLOC[v] : lineasVoz(v).map(l => ({ id: l.id, texto: l.texto, pendiente: true, inicio: l.inicio, fin: l.fin, frases: [] }));
const linea = (v, id) => lineasVoz(v).find(l => l.id === id);

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

const escenas = v => [...APERTURA[v], ...COMUN];
const faltan = [...new Map(['A', 'B'].flatMap(v => voz(v).filter(l => l.pendiente).map(l => [l.id, l]))).values()];
const pend = Object.entries(PENDIENTE).filter(([, e]) => e === 'pendiente').map(([k]) => ({ gratis: '«gratis» en el CTA', capturas: 'capturas del formulario (escena P)', voz: 'grabación de la voz', rotulos: 'rótulos del formulario' })[k])
  .concat(PENDIENTE.voz === 'parcial' ? faltan.map(l => `toma ${l.id} de la voz («${l.texto}»)`) : []);

// ---------- guion técnico ----------
let md = `# Guion técnico — ${TITULO}

Generado desde [guion.js](guion.js) con \`generar-textos.mjs\` del motor. **No editar a mano.**

**${coma(DURACION, 1)} s** · ${BPM} BPM (1 beat = ${coma(60 / BPM)} s, ${BEATS} beats = ${BEATS / 4} compases) · 1080 × 1920 · 30 fps · tiempos en segundos según la cuadrícula **medida** (\`beats.json\`: ${coma(60 / P, 2)} BPM, desfase ${coma(beats[0] * 1000, 1)} ms).
Zona segura para texto y logo: x ${SEGURA.x0}–${SEGURA.x1}, y ${SEGURA.y0}–${SEGURA.y1} (la de la marca, en \`motor/nucleo/marca.js\`).

**Pendiente:** ${pend.length ? pend.join(' · ') : 'nada'}.

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
for (const [n, b, img, snd] of EVENTOS) md += `| ${n} | ${Array.isArray(b) ? b.map(x => coma(x)).join(' · ') : coma(b)} | ${Array.isArray(b) ? '—' : coma(S(b))} | ${img} | ${snd} |\n`;
for (const v of ['A', 'B']) {
  md += `\n## Locución ${v}\n\nTiempos reales de cada frase en la mezcla (\`locucion/colocacion.json\`). «Imagen» es el segundo nominal del evento al que se ancla la frase (la cuadrícula medida difiere en menos de 10 ms). Ritmo: «natural» ≤ ${coma(LOCUCION.ritmo.natural, 1)} sílabas/s · «ágil» ≤ ${coma(LOCUCION.ritmo.agil, 1)}.\n\n| Línea | Frase | Inicio (s) | Fin (s) | Ancla | Imagen (s) | Síl./s |\n|---|---|---|---|---|---|---|\n`;
  for (const l of voz(v)) {
    if (l.pendiente) { md += `| ${l.id} | ${l.texto} **(falta la toma)** | ${coma(l.inicio)} | ${coma(l.fin)} | hueco planeado | — | — |\n`; continue; }
    for (const f of l.frases) md += `| ${l.id} | ${f.texto} | ${coma(f.inicio)} | ${coma(f.fin)} | ${f.ancla} | ${f.imagen !== undefined ? coma(f.imagen) : '—'} | ${coma(silabas(f.texto) / (f.fin - f.inicio), 1)} |\n`;
  }
  const fin = Math.max(...voz(v).map(l => l.fin));
  md += `\nLa voz termina en ${coma(fin)} s: quedan ${coma(DURACION - fin, 1)} s de cierre sin voz con el logo y el CTA completos.\n`;
}
md += `\nToda la locución aparece también como texto en pantalla (titulares, cabecera o botón). Los subtítulos \`.srt\` son para la plataforma; no se queman.\n`;
writeFileSync(ruta('guion-tecnico.md'), md);

// ---------- subtítulos ----------
const tc = s => { const ms = Math.round(s * 1000), p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
mkdirSync(ruta('subtitulos'), { recursive: true });
// L3 va frase por frase (cada dato con su tarjeta); las demás líneas, enteras. Cada texto se queda
// 0,3 s después de la voz, sin pisar el siguiente.
for (const v of ['A', 'B']) {
  const cues = voz(v).flatMap(l => (l.id === 'L3' && !l.pendiente ? l.frases.map(f => [f.inicio, f.fin, f.texto]) : [[l.inicio, l.fin, l.texto]]));
  writeFileSync(ruta('subtitulos', `${ARCHIVO}-${v}.srt`), cues.map(([a, b, t], i) => `${i + 1}\n${tc(a)} --> ${tc(Math.min(b + 0.3, cues[i + 1] ? cues[i + 1][0] - 0.04 : DURACION))}\n${t}\n`).join('\n'));
}

// ---------- guion de locución ----------
const lineaDe = id => linea('A', id) || linea('B', id);
const hayGrabadas = ['A', 'B'].some(v => voz(v).some(l => !l.pendiente));
const estado = !faltan.length
  ? 'ESTADO: GRABADA. Las tomas están en locucion/tomas/ (ver su LEEME).'
  : hayGrabadas
    ? `ESTADO: GRABADA, SALVO ${faltan.map(l => `${l.id} («${l.texto}»)`).join(', ')}. Las tomas están en locucion/tomas/.
El video ya lleva las grabadas; la música ya deja el hueco de lo que falta.`
    : `ESTADO: PENDIENTE DE GRABAR. El video todavía no tiene voz; la música ya baja en cada hueco.`;
let loc = `LOCUCIÓN — ${TITULO} (${coma(DURACION, 1)} s)
Generado desde guion.js y locucion/colocacion.json con generar-textos.mjs del motor. No editar a mano.

${estado}
${faltan.length ? `
PARA GRABAR ${faltan.map(l => l.id).join(', ')}: ${hayGrabadas ? 'la misma voz y el mismo tono de las otras tomas, en el mismo formato' : 'una toma por línea, mejor tres, en un cuarto silencioso'}. A ritmo natural: no hace falta clavar los tiempos.
${faltan.map(l => `  ${l.id}  «${l.texto}»  (${lineaDe(l.id).direccion}) Hueco: ${coma(l.inicio)}–${coma(l.fin)} s, ${coma(l.fin - l.inicio, 1)} s para ${silabas(l.texto)} sílabas.`).join('\n')}
` : ''}
Voz: ${LOCUCION.voz}
Ritmo: hasta ${coma(LOCUCION.ritmo.natural, 1)} sílabas por segundo suena tranquilo; más de ${coma(LOCUCION.ritmo.agil, 1)} se oye apurado.
${PENDIENTE.gratis === 'pendiente' ? '\n«gratis» está PENDIENTE DE CONFIRMAR: grabar L4 en las dos variantes («Publica gratis tu búsqueda.» y «Publica tu búsqueda.»).\n' : ''}`;
for (const v of ['A', 'B']) {
  loc += `\n==============================================================\nVERSIÓN ${v} ${v === 'A' ? '(directa)' : '(curiosidad) — solo cambia la primera línea'}\n==============================================================\n\n`;
  for (const l of voz(v)) {
    const d = linea(v, l.id).direccion;
    if (l.pendiente) { loc += `[${coma(l.inicio)}–${coma(l.fin)}]  ${l.texto}   ← FALTA LA TOMA\n               (${d})\n\n`; continue; }
    const habla = l.frases.reduce((s, f) => s + f.fin - f.inicio, 0), sps = silabas(l.texto) / habla;
    loc += `[${coma(l.inicio)}–${coma(l.fin)}]  ${l.texto}\n               (${d} · toma ${l.toma} · ${silabas(l.texto)} sílabas en ${coma(habla)} s de voz = ${coma(sps, 1)} síl./s, ${sps <= LOCUCION.ritmo.natural ? 'natural' : sps <= LOCUCION.ritmo.agil ? 'ágil' : 'ACELERADO'})\n`;
    if (l.frases.length > 1) for (const f of l.frases) loc += `                 ${coma(f.inicio)}–${coma(f.fin)}  ${f.texto}  (ancla: ${f.ancla})\n`;
    loc += '\n';
  }
}
mkdirSync(ruta('locucion'), { recursive: true });
writeFileSync(ruta('locucion', 'guion-locucion.txt'), loc);
console.log(`escritos guion-tecnico.md, subtitulos/${ARCHIVO}-{A,B}.srt, locucion/guion-locucion.txt`);
