// Locución: las tomas entregadas → una pista de voz alineada a la imagen.
// Corta cada toma en frases (los originales de locucion/tomas/ no se tocan), coloca cada frase
// según su ancla en src/linea-de-tiempo.js y la procesa: paso alto a 80 Hz, el mismo nivel para
// todas las líneas, una compresión suave y un limitador de picos para que se entienda sobre la música.
// Escribe salida/voz-{A,B}.wav y locucion/colocacion.json (tiempos reales: los leen musica.mjs,
// generar-textos.mjs y control.mjs). Una línea sin toma queda como hueco con su tiempo planeado.
// Uso: node voz.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { BPM, DURACION, EV, LOCUCION, lineasVoz } from './src/linea-de-tiempo.js';
import * as D from './src/dsp.mjs';

const { SR } = D, N = Math.round(DURACION * SR);
const here = p => new URL(p, import.meta.url);
// Anclas con la cuadrícula nominal, la misma con la que musica.mjs coloca los golpes. La medida
// (beats.json) difiere en menos de 10 ms y se mide después, sobre la música que ya cede ante la voz.
const S = b => (b * 60) / BPM;
const NIVEL = -20;       // LUFS de cada línea antes de mezclar; musica.mjs fija la relación con la música
const HUECO_MIN = 0.08;  // s de silencio mínimo entre dos frases
const PRE = 0.03, COLA = 0.1, FADE_IN = 0.005, FADE_OUT = 0.06;
const coma = (n, d = 2) => Number(n).toFixed(d).replace('.', ',');

const nombreEvento = b => {
  for (const [k, v] of Object.entries(EV)) {
    if (v === b) return k;
    if (Array.isArray(v) && v.includes(b)) return `${k}[${v.indexOf(b)}]`;
  }
  return `beat ${b}`;
};
const describirAncla = a => (a.tras !== undefined ? `${coma(a.tras)} s después de la frase anterior`
  : a.b !== undefined ? `${nombreEvento(a.b)} (beat ${coma(a.b)}) ${a.s >= 0 ? '+' : '−'}${coma(Math.abs(a.s || 0))} s` : `${coma(a.s)} s`);

function decodificar(archivo) {
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', archivo, '-ac', '1', '-af', `aresample=${SR}:resampler=soxr:precision=28`, '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  return new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
}
// compresor suave (2,5:1) con el umbral en el nivel de la línea: unos 4 dB menos en las sílabas más fuertes
function comprimir(x, umbralDb, ratio = 2.5, ataque = 0.003, suelta = 0.08) {
  const a = Math.exp(-1 / (ataque * SR)), r = Math.exp(-1 / (suelta * SR));
  let env = 0, maxGr = 0;
  for (let i = 0; i < x.length; i++) {
    const v = Math.abs(x[i]);
    env = v > env ? a * env + (1 - a) * v : r * env + (1 - r) * v;
    const sobre = 20 * Math.log10(env + 1e-9) - umbralDb;
    if (sobre > 0) { const gr = sobre * (1 - 1 / ratio); x[i] *= 10 ** (-gr / 20); maxGr = Math.max(maxGr, gr); }
  }
  return maxGr;
}
const ajustarNivel = (x, objetivo) => { const g = 10 ** ((objetivo - D.lufs([x, x])) / 20); for (let i = 0; i < x.length; i++) x[i] *= g; };

// tramos de 5 ms con voz: umbral 32 dB por debajo del tramo más fuerte de la toma
function tramos(x) {
  const H = 240, db = [];
  for (let s = 0; s + H <= x.length; s += H) { let e = 0; for (let i = s; i < s + H; i++) e += x[i] * x[i]; db.push(10 * Math.log10(e / H + 1e-12)); }
  const umbral = Math.max(...db) - 32;
  return (a, b) => { // primer y último sonido (en muestras) dentro de [a, b)
    const i0 = Math.ceil(a / H), i1 = Math.floor(b / H) - 1;
    let p = i0; while (p <= i1 && db[p] <= umbral) p++;
    let q = i1; while (q >= p && db[q] <= umbral) q--;
    if (p > q) throw new Error('no hay voz en el corte');
    return [p * H, (q + 1) * H];
  };
}

function armar(V) {
  const pista = new Float32Array(N), lineas = [];
  let ultimo = -Infinity; // último sonido colocado (s)
  for (const l of lineasVoz(V)) {
    const archivo = l.toma && here(`./${LOCUCION.tomas}${l.toma}`);
    if (!archivo || !existsSync(archivo)) {
      if (l.inicio - ultimo < HUECO_MIN) throw new Error(`${l.id}: el hueco planeado empieza ${coma(l.inicio - ultimo, 3)} s después de la frase anterior`);
      lineas.push({ id: l.id, texto: l.texto, toma: l.toma, pendiente: true, inicio: l.inicio, fin: l.fin, frases: [] });
      ultimo = l.fin;
      continue;
    }
    const x = decodificar(archivo);
    const hp = [new D.Biquad('hp', 80), new D.Biquad('hp', 80)];
    for (let i = 0; i < x.length; i++) x[i] = hp[1].run(hp[0].run(x[i]));
    ajustarNivel(x, NIVEL);
    const sonidoEn = tramos(x); // los límites de cada frase se miden antes de comprimir
    const gr = comprimir(x, NIVEL);
    ajustarNivel(x, NIVEL);
    // limitador propio de la voz: los picos quedan a 9 dB del nivel, así el limitador de la
    // mezcla casi no la toca (el resto del procesamiento no cambia la sonoridad)
    const picoAntes = 20 * Math.log10(x.reduce((m, v) => Math.max(m, Math.abs(v)), 0));
    D.limit([x, x], NIVEL + 9);
    ajustarNivel(x, NIVEL);
    const frases = (l.frases || [{ texto: l.texto, corte: [0, x.length / SR], ancla: l.ancla }]).map(f => {
      const [a, b] = [Math.round(f.corte[0] * SR), Math.min(x.length, Math.round(f.corte[1] * SR))];
      const [on, off] = sonidoEn(a, b);
      const c0 = Math.max(a, on - Math.round(PRE * SR)), c1 = Math.min(b, off + Math.round(COLA * SR));
      const inicio = f.ancla.tras !== undefined ? ultimo + f.ancla.tras : (f.ancla.b !== undefined ? S(f.ancla.b) : 0) + (f.ancla.s || 0);
      const fin = inicio + (off - on) / SR;
      if (inicio - ultimo < HUECO_MIN) throw new Error(`${l.id} «${f.texto}»: empieza ${coma(inicio - ultimo, 3)} s después de la frase anterior (mínimo ${HUECO_MIN} s)`);
      if (fin > DURACION - 0.5) throw new Error(`${l.id} «${f.texto}»: termina en ${coma(fin, 3)} s, demasiado cerca del final`);
      const s0 = Math.round(inicio * SR) - (on - c0), nIn = Math.round(FADE_IN * SR), nOut = Math.round(FADE_OUT * SR), n = c1 - c0;
      for (let i = 0; i < n; i++) {
        const j = s0 + i; if (j < 0 || j >= N) continue;
        const g = i < nIn ? 0.5 - 0.5 * Math.cos((Math.PI * i) / nIn) : i >= n - nOut ? 0.5 - 0.5 * Math.cos((Math.PI * (n - 1 - i)) / nOut) : 1;
        pista[j] += x[c0 + i] * g;
      }
      ultimo = fin;
      return {
        texto: f.texto, corte: f.corte, inicio: +inicio.toFixed(3), fin: +fin.toFixed(3),
        ancla: describirAncla(f.ancla), ...(f.ancla.b !== undefined ? { imagen: +S(f.ancla.b).toFixed(3) } : {}),
      };
    });
    lineas.push({ id: l.id, texto: l.texto, toma: l.toma, pendiente: false, inicio: frases[0].inicio, fin: frases.at(-1).fin, compresionMaxDb: +gr.toFixed(1), limitadorMaxDb: +Math.max(0, picoAntes - NIVEL - 9).toFixed(1), frases });
  }
  mkdirSync(here('./salida/'), { recursive: true });
  writeFileSync(here(`./salida/voz-${V}.wav`), D.writeWav(null, [pista, pista]));
  return lineas;
}

const colocacion = { generado: 'node voz.mjs — no editar a mano', nivelLinea: NIVEL };
for (const V of ['A', 'B']) {
  colocacion[V] = armar(V);
  console.log(`voz-${V}.wav`);
  for (const l of colocacion[V]) {
    if (l.pendiente) { console.log(`  ${l.id.padEnd(3)} PENDIENTE  hueco ${coma(l.inicio)}–${coma(l.fin)} s  «${l.texto}»`); continue; }
    for (const f of l.frases) console.log(`  ${l.id.padEnd(3)} ${coma(f.inicio, 3)}–${coma(f.fin, 3)} s  «${f.texto}»  ancla: ${f.ancla}`);
  }
}
writeFileSync(here('./locucion/colocacion.json'), JSON.stringify(colocacion, null, 1) + '\n');
