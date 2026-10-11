// Partitura y SFX sintetizados desde la línea de tiempo → salida/musica-{A,B}.wav (+ stems)
// Identidad: primer acto tenso en si menor (pulso apagado, sellos); el giro abre a re mayor.
// El «punto» tiene su voz (marimba de vidrio) y firma la marca con el motivo re–la–fa#.
// La locución está pendiente: la música ya baja 5 dB bajo cada línea para dejarle sitio.
// Uso: node musica.mjs [A|B]   (sin argumento genera las dos)
import { writeFileSync, mkdirSync } from 'node:fs';
import { BPM, DURACION, EV, lineasVoz } from './src/linea-de-tiempo.js';
import { mulberry32 } from './src/lib.js';
import * as D from './src/dsp.mjs';

const { SR } = D;
const N = Math.round(DURACION * SR), BEAT = 60 / BPM, B = b => b * BEAT;
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

  // ---------- acto 1 (0–2 s): el muro ----------
  const osti = [M.B2, M.Fs3, M.D3, M.Fs3];
  for (let s = 0; s < 16; s++) place(musica, B(s * 0.5), D.pulso(osti[s % 4] + (s >= 8 ? 0 : 0)), 0.26 + 0.12 * (s / 16) + (s % 4 === 0 ? 0.08 : 0), s % 2 ? 0.3 : -0.3, 0.12);
  place(musica, 0, D.pad([M.B1 + 12, M.Fs3 - 12], B(4) - 0.05, 0.9, 0.04, 600), 0.5);
  for (let s = 0; s < 32; s++) place(ritmo, B(s * 0.25), D.maraca(), 0.05 + 0.07 * (s / 32), 0.3);
  place(sfx, B(EV.sello0), D.sello(1.4), 0.9, 0, 0.15);
  place(ritmo, B(EV.sello0), D.grave(0.9, 85, 40), 0.55);
  place(sfx, 0.02, D.barrido(0.9, 2600, 280, 1.4, 'campana'), 0.4, 0, 0.25);
  EV.cascada.forEach((b, i) => place(sfx, B(b), D.sello(0.8), 0.42 - i * 0.025, (i % 2 ? 0.5 : -0.5) * (0.4 + 0.1 * i), 0.15));
  place(sfx, B(2), D.subida(B(2) - 0.02), 0.32, 0, 0.2);
  if (VAR === 'A') {
    [M.Fs4, M.A4, M.B4].forEach((m, i) => { place(musica, B(EV.saltosA[i]), D.punto(m, 0.8, 1.1), 0.5, -0.3 + i * 0.3, 0.3); place(sfx, B(EV.saltosA[i]), D.sello(0.9), 0.5, -0.3 + i * 0.3, 0.15); });
    place(sfx, B(1.75), D.barrido(B(0.75), 500, 3500, 2, 'sube'), 0.25, 0.6, 0.2);
  } else {
    place(sfx, B(2.3), D.barrido(B(0.7), 400, 3200, 2, 'sube'), 0.3, 0, 0.2);
    place(musica, B(EV.caeB), D.punto(M.B4, 0.9, 1.1), 0.55, 0, 0.3);
    place(sfx, B(EV.caeB) + 0.05, D.barrido(0.28, 1400, 6500, 2.5, 'campana'), 0.4, 0.2, 0.2);
    place(sfx, B(EV.caeB) + 0.05, D.clic(3600), 0.5, 0.1, 0.2);
  }
  // ---------- giro (2–3 s): todo se detiene y el muro se da vuelta ----------
  place(sfx, B(EV.congela), D.freno(M.B2 + 12, 0.3), 0.55, 0, 0.1);
  for (let k = 0; k < 30; k++) place(sfx, B(EV.onda) + 0.48 * (k / 29) ** 1.3, D.clic(3000 + rnd() * 3500), 0.3 * (1 - k / 40), rnd() * 1.6 - 0.8, 0.35);
  place(sfx, B(EV.onda), D.barrido(0.5, 900, 5000, 1.2, 'campana'), 0.22, 0, 0.3);
  place(musica, B(EV.titular), D.ep([M.D3, M.A3, M.E4, M.Fs4, M.A4], 1.4, 0.8), 0.9, 0, 0.45);
  place(musica, B(EV.titular), D.pad([M.D3, M.Fs3, M.A3], B(4.6), 0.3, 0.4, 1200), 0.35, 0, 0.3);
  place(ritmo, B(EV.titular), D.bombo(0.4, 0.8), 0.55);
  place(musica, B(EV.tilde), D.punto(M.D5, 1.2, 1.2), 0.62, -0.1, 0.4);
  // ---------- titular y marco (3–4,6 s) ----------
  for (let b = 6; b < 9; b += 0.5) place(ritmo, B(b), D.maraca(), 0.1, 0.25);
  [6, 7].forEach(b => place(ritmo, B(b), D.bombo(0.35, 0.7), 0.4));
  place(musica, B(EV.salto), D.punto(M.A5, 0.7, 0.9), 0.42, 0.2, 0.4);
  place(sfx, B(EV.salto), D.barrido(B(0.5), 600, 3000, 2, 'sube'), 0.2, 0, 0.2);
  place(ritmo, B(EV.marco), D.grave(0.8, 95, 45), 0.45);
  place(sfx, B(EV.marco), D.barrido(0.4, 300, 2600, 1.4, 'campana'), 0.35, 0, 0.25);
  [M.D5, M.Fs5, M.A5, M.D6].forEach((m, i) => place(musica, B(EV.abre) + i * B(0.125), D.punto(m, 0.5, 0.7), 0.22, -0.4 + i * 0.27, 0.45));
  // ---------- producto (4,6–9,9 s): pulso estable bajo la locución ----------
  const chords = [[8, [M.D3, M.Fs3, M.A3, M.E4], M.D2], [12, [M.B2, M.D3, M.Fs3, M.A3], M.B1 + 12], [16, [M.G3 - 12, M.B2, M.D3, M.Fs3], M.G1 + 12], [18, [M.A2, M.Cs3, M.E3, M.A3], M.A1 + 12]];
  chords.forEach(([b, ch, root], i) => {
    const len = (chords[i + 1] ? chords[i + 1][0] : 20) - b;
    place(musica, B(b), D.pad(ch.map(m => m + 12), B(len) - 0.05, 0.2, 0.3, 1300), 0.32, 0, 0.3);
    for (let q = 0.5; q < len; q += 1) if (b + q >= 9) place(musica, B(b + q), D.bajo(root, B(0.35)), 0.4);
  });
  for (let b = 9; b < 19.5; b++) { place(ritmo, B(b), D.bombo(0.35, 0.75), 0.42); if (b % 2) place(ritmo, B(b), D.aro(), 0.22, 0.1, 0.15); }
  for (let b = 9; b < 19.5; b += 0.25) place(ritmo, B(b), D.maraca(b % 1 === 0.5 ? 1.3 : 1), b % 1 === 0.5 ? 0.11 : 0.06, -0.25);
  [M.D5, M.Fs5, M.A5, M.B5].forEach((m, i) => {
    const b = EV.rotulos[i];
    place(musica, B(b), D.punto(m, 0.6, 0.9), 0.3, 0.25, 0.4);
    place(sfx, B(b) - 0.05, D.barrido(0.16, 900, 3800, 2.4, 'campana'), 0.16, 0, 0.1);
  });
  // ---------- puente (9,9–11 s): el marco se recoge y el punto vuela al isotipo ----------
  place(sfx, B(EV.recoge) - 0.2, D.inverso(0.45), 0.4);
  place(sfx, B(EV.recoge), D.barrido(0.3, 3000, 400, 1.6, 'cae'), 0.3, 0, 0.2);
  place(sfx, B(EV.vuelo[0]), D.barrido(B(EV.vuelo[1] - EV.vuelo[0]), 500, 2600, 1.4, 'campana'), 0.3, -0.3, 0.3);
  place(musica, B(20), D.pad([M.A2 + 12, M.Cs4, M.E4], B(2) - 0.05, 0.4, 0.15, 1600), 0.3, 0, 0.3);
  place(sfx, B(21), D.subida(B(1)), 0.22, 0, 0.2);
  // ---------- cierre (11–16 s): firma sonora re–la–fa# ----------
  place(musica, B(EV.isotipo), D.punto(M.D5, 1.4, 1.2), 0.62, -0.15, 0.45);
  place(musica, B(EV.isotipo), D.ep([M.D3, M.A3, M.Cs4, M.E4, M.Fs4], 2.6, 1.4), 0.85, 0, 0.5);
  place(musica, B(EV.isotipo), D.pad([M.D3, M.Fs3, M.A3, M.E4], B(32 - EV.isotipo) - 0.6, 0.5, 0.5, 1500), 0.34, 0, 0.35);
  place(ritmo, B(EV.isotipo), D.grave(1.1, 75, 38), 0.45);
  place(ritmo, B(EV.isotipo), D.bombo(0.4, 0.8), 0.5);
  place(musica, B(EV.cta), D.punto(M.A5, 1.2, 1.0), 0.48, 0.15, 0.45);
  place(musica, B(EV.cta), D.bajo(M.D2, B(0.6)), 0.4);
  for (let b = 23; b < 28; b++) { place(ritmo, B(b), D.bombo(0.3, 0.6), 0.3); place(ritmo, B(b + 0.5), D.maraca(), 0.07, 0.25); if (b % 2) place(ritmo, B(b), D.aro(), 0.14, 0.1, 0.15); }
  for (let b = 23; b < 28; b++) place(musica, B(b + 0.5), D.bajo(M.D2, B(0.3)), 0.3);
  place(musica, B(EV.nombre), D.punto(M.Fs5, 1.6, 1.0), 0.5, 0.05, 0.5);
  place(musica, B(EV.nombre), D.campana(M.A5), 0.25, -0.2, 0.5);
  EV.empujes.forEach(b => place(sfx, B(b), D.clic(2600), 0.16, 0.3, 0.3));

  // ---------- la música cede ante la voz (pendiente) ----------
  const voz = lineasVoz(VAR);
  const duck = new Float32Array(N).fill(1);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let g = 0;
    for (const l of voz) { const a = Math.min(1, Math.max(0, (t - (l.inicio - 0.08)) / 0.08)), r = Math.min(1, Math.max(0, ((l.fin + 0.25) - t) / 0.25)); g = Math.max(g, Math.min(a, r)); }
    duck[i] = 1 - g * (1 - 10 ** (-5 / 20));
  }
  for (const b of [musica, ritmo]) for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) b[c][i] *= b === ritmo ? 1 - (1 - duck[i]) * 0.6 : duck[i];

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
  for (let i = 0; i < N; i++) { const t = i / SR, g = t > DURACION - 0.4 ? Math.max(0, (DURACION - t) / 0.4) ** 1.5 : 1; mix[0][i] *= g; mix[1][i] *= g; }
  const gainDb = (x, db) => { const g = 10 ** (db / 20); for (const ch of x) for (let i = 0; i < N; i++) ch[i] *= g; };
  let total = 0;
  for (let pass = 0; pass < 4; pass++) { const d = -14 - D.lufs(mix); total += d; gainDb(mix, d); D.limit(mix, -2.4); }
  gainDb(stM, total); gainDb(stS, total);
  const out = new URL('./salida/', import.meta.url);
  mkdirSync(out, { recursive: true });
  writeFileSync(new URL(`musica-${VAR}.wav`, out), D.writeWav(null, mix));
  writeFileSync(new URL(`stem-musica-${VAR}.wav`, out), D.writeWav(null, stM));
  writeFileSync(new URL(`stem-sfx-${VAR}.wav`, out), D.writeWav(null, stS));
  let pk = 0; for (const ch of mix) for (const v of ch) pk = Math.max(pk, Math.abs(v));
  console.log(`musica-${VAR}.wav  ${DURACION}s  ${D.lufs(mix).toFixed(2)} LUFS (provisional: sin voz)  pico ${(20 * Math.log10(pk)).toFixed(2)} dBFS`);
}

const arg = process.argv[2];
for (const v of arg ? [arg] : ['A', 'B']) render(v);
