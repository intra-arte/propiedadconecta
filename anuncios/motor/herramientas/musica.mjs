// Música del anuncio: la partitura del anuncio (partitura.mjs) sobre los buses del motor, la música que
// baja bajo cada frase de la locución (tiempos reales de locucion/colocacion.json, que escribe voz.mjs)
// y la voz mezclada delante, a una distancia fija de la música.
// Escribe salida/musica-{A,B}.wav (sin voz: de aquí se miden los beats), salida/mezcla-{A,B}.wav
// (con voz: la que lleva el video), los stems a la escala de la mezcla y salida/mezcla-{A,B}.json.
// Uso: node motor/herramientas/musica.mjs --anuncio <carpeta> [A|B]   (sin variante genera las dos)
import { writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { ruta, G, sueltos } from './comun.mjs';
import { mulberry32 } from '../nucleo/lib.js';
import * as D from '../nucleo/dsp.mjs';

const { BPM, DURACION, EV, lineasVoz } = G;
const { componer } = await import(pathToFileURL(ruta('partitura.mjs')).href);

const { SR } = D;
const VMR = 10;      // dB: la voz, medida en sus propios tramos, queda 10 dB por encima de música + SFX
const DUCK = -5;     // dB que baja la música bajo cada frase (el ritmo y los SFX bajan el 60 % de eso)
const N = Math.round(DURACION * SR), BEAT = 60 / BPM, B = b => b * BEAT;
// notas MIDI por nombre (la partitura las recibe como M)
const M = { B1: 35, D2: 38, G1: 31, A1: 33, B2: 47, D3: 50, Fs3: 54, G3: 55, A3: 57, B3: 59, Cs4: 61, D4: 62, E4: 64, Fs4: 66, G4: 67, A4: 69, B4: 71, Cs5: 73, D5: 74, E5: 76, Fs5: 78, A5: 81, B5: 83, D6: 86, A2: 45, Cs3: 49, E3: 52 };

function render(VAR) {
  const bus = () => [new Float32Array(N), new Float32Array(N)];
  const musica = bus(), ritmo = bus(), sfx = bus(), envio = bus();
  const place = (dst, t0, sig, gain = 1, pan = 0, send = 0) => {
    const [L, R] = Array.isArray(sig) ? sig : [sig, sig];
    const gl = Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2, gr = Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
    const s0 = Math.round(t0 * SR);
    for (let i = 0; i < L.length; i++) {
      const j = s0 + i; if (j < 0 || j >= N) continue;
      const l = L[i] * gain * gl, r = R[i] * gain * gr;
      dst[0][j] += l; dst[1][j] += r;
      if (send) { envio[0][j] += l * send; envio[1][j] += r * send; }
    }
  };
  const rnd = mulberry32(VAR === 'A' ? 11 : 22);

  componer({ VAR, place, B, D, M, EV, rnd, musica, ritmo, sfx });

  // ---------- la música cede ante la voz ----------
  // Tramos reales de cada frase; una línea sin toma usa su hueco planeado, así la música ya es la
  // definitiva. Sin colocacion.json (voz.mjs no corrió), los huecos planeados de la línea de tiempo.
  const coloc = ruta('locucion', 'colocacion.json');
  const tramos = existsSync(coloc)
    ? JSON.parse(readFileSync(coloc))[VAR].flatMap(l => (l.pendiente ? [[l.inicio, l.fin]] : l.frases.map(f => [f.inicio, f.fin])))
    : lineasVoz(VAR).map(l => [l.inicio, l.fin]);
  const duck = new Float32Array(N).fill(1);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let g = 0;
    for (const [t0, t1] of tramos) { const a = Math.min(1, Math.max(0, (t - (t0 - 0.08)) / 0.08)), r = Math.min(1, Math.max(0, ((t1 + 0.25) - t) / 0.25)); g = Math.max(g, Math.min(a, r)); }
    duck[i] = 1 - g * (1 - 10 ** (DUCK / 20));
  }
  // la música baja entera; el ritmo y los SFX, un 60 % de eso (siguen marcando los golpes)
  for (const b of [musica, ritmo, sfx]) for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) b[c][i] *= b === musica ? duck[i] : 1 - (1 - duck[i]) * 0.6;

  // ---------- reverb, suma, sonoridad ----------
  const ir = D.room(1.5, 0.38);
  const verb = [0, 1].map(c => D.convolve(envio[c], ir[c]));
  const mix = [new Float32Array(N), new Float32Array(N)], stM = [new Float32Array(N), new Float32Array(N)], stS = [new Float32Array(N), new Float32Array(N)];
  for (let c = 0; c < 2; c++) {
    const h1 = new D.Biquad('hp', 30), h2 = new D.Biquad('hp', 30);
    for (let i = 0; i < N; i++) {
      stM[c][i] = musica[c][i] * 0.9 + ritmo[c][i] + verb[c][i] * 0.4;
      stS[c][i] = sfx[c][i] * 0.85;
      mix[c][i] = Math.tanh(h2.run(h1.run(stM[c][i] + stS[c][i])) * 0.5) / 0.5;
    }
  }
  const fin = new Float32Array(N).map((_, i) => { const t = i / SR; return t > DURACION - 0.4 ? Math.max(0, (DURACION - t) / 0.4) ** 1.5 : 1; });
  for (let i = 0; i < N; i++) { mix[0][i] *= fin[i]; mix[1][i] *= fin[i]; }
  const cama = mix.map(ch => ch.slice()); // música + SFX antes de normalizar: la base de la mezcla con voz
  const gainDb = (x, db) => { const g = 10 ** (db / 20); for (const ch of x) for (let i = 0; i < N; i++) ch[i] *= g; };
  const pico = x => { let p = 0; for (const ch of x) for (const v of ch) p = Math.max(p, Math.abs(v)); return 20 * Math.log10(p); };
  const normalizar = x => { let total = 0; for (let pass = 0; pass < 4; pass++) { const d = -14 - D.lufs(x); total += d; gainDb(x, d); D.limit(x, -2.4); } return total; };
  const out = new URL(pathToFileURL(ruta('salida')).href + '/');
  mkdirSync(out, { recursive: true });
  const totalSinVoz = normalizar(mix);
  writeFileSync(new URL(`musica-${VAR}.wav`, out), D.writeWav(null, mix));
  console.log(`musica-${VAR}.wav   ${D.lufs(mix).toFixed(2)} LUFS  pico ${pico(mix).toFixed(2)} dBFS  (sin voz)`);

  // ---------- mezcla con la voz ----------
  const vozWav = new URL(`voz-${VAR}.wav`, out);
  if (!existsSync(vozWav)) { console.log('  sin salida/voz-' + VAR + '.wav: corre «node voz.mjs» para la mezcla con voz'); return; }
  const voz = D.readWav(readFileSync(vozWav));
  const conVoz = tramos.filter(([t0, t1]) => D.sonoridadTramos(voz, [[t0, t1]]) > -60);
  if (!conVoz.length) { // todavía no hay ninguna toma: el video lleva la música sin voz y los stems van a su escala
    for (const f of [`mezcla-${VAR}.wav`, `mezcla-${VAR}.json`, `stem-voz-${VAR}.wav`]) rmSync(new URL(f, out), { force: true });
    for (const x of [stM, stS]) gainDb(x, totalSinVoz);
    writeFileSync(new URL(`stem-musica-${VAR}.wav`, out), D.writeWav(null, stM));
    writeFileSync(new URL(`stem-sfx-${VAR}.wav`, out), D.writeWav(null, stS));
    console.log(`  sin tomas de voz todavía: el video usa musica-${VAR}.wav (la música ya deja los huecos de la voz)`);
    return;
  }
  const gV = VMR - (D.sonoridadTramos(voz, conVoz) - D.sonoridadTramos(cama, conVoz));
  gainDb(voz, gV);
  // ganancia por frase, como un fader: cada frase se acerca al objetivo (entre −2 y +3 dB),
  // con la transición en el silencio entre frases
  const ajuste = conVoz.map(tr => Math.min(3, Math.max(-2, VMR - (D.sonoridadTramos(voz, [tr]) - D.sonoridadTramos(cama, [tr])))));
  const puntos = conVoz.flatMap(([t0, t1], k) => [[t0 - 0.05, ajuste[k]], [t1 + 0.12, ajuste[k]]]);
  for (let i = 0, p = 0; i < N; i++) {
    const t = i / SR;
    while (p < puntos.length - 1 && puntos[p + 1][0] <= t) p++;
    const [ta, da] = puntos[p], [tb, db] = puntos[Math.min(p + 1, puntos.length - 1)];
    const d = t <= ta || tb === ta ? da : t >= tb ? db : da + ((db - da) * (t - ta)) / (tb - ta);
    const g = 10 ** (d / 20); voz[0][i] *= g; voz[1][i] *= g;
  }
  const mez = [0, 1].map(c => cama[c].map((v, i) => v + voz[c][i] * fin[i]));
  const picoCrudo = pico(mez), total = normalizar(mez); // cuánto recorta el limitador, como máximo
  for (const x of [stM, stS, voz, cama]) gainDb(x, total);
  writeFileSync(new URL(`mezcla-${VAR}.wav`, out), D.writeWav(null, mez));
  writeFileSync(new URL(`stem-musica-${VAR}.wav`, out), D.writeWav(null, stM));
  writeFileSync(new URL(`stem-sfx-${VAR}.wav`, out), D.writeWav(null, stS));
  writeFileSync(new URL(`stem-voz-${VAR}.wav`, out), D.writeWav(null, voz));
  // la voz frente a música + SFX, frase por frase, ya con la ganancia de cada una
  const porFrase = conVoz.map(([t0, t1], k) => ({ t0, t1, ajusteDb: +ajuste[k].toFixed(1), vmr: +(D.sonoridadTramos(voz, [[t0, t1]]) - D.sonoridadTramos(cama, [[t0, t1]])).toFixed(1) }));
  const info = { lufs: +D.lufs(mez).toFixed(2), picoDbfs: +pico(mez).toFixed(2), limitadorMaxDb: +Math.max(0, picoCrudo + total + 2.4).toFixed(1), gananciaVozDb: +(gV + total).toFixed(2), vmrObjetivo: VMR, vmrGlobal: +(D.sonoridadTramos(voz, conVoz) - D.sonoridadTramos(cama, conVoz)).toFixed(1), porFrase };
  writeFileSync(new URL(`mezcla-${VAR}.json`, out), JSON.stringify(info, null, 1) + '\n');
  console.log(`mezcla-${VAR}.wav   ${info.lufs.toFixed(2)} LUFS  pico ${info.picoDbfs.toFixed(2)} dBFS  voz sobre música ${info.vmrGlobal} dB (mín. por frase ${Math.min(...porFrase.map(p => p.vmr))} dB)`);
}

const arg = sueltos[0];
for (const v of arg ? [arg] : ['A', 'B']) render(v);
