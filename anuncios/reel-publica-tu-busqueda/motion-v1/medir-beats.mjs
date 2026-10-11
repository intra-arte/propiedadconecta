// Mide la cuadrícula de beats sobre la partitura renderizada (no sobre el BPM nominal):
// detección de ataques en graves → refinamiento al sample → ajuste por mínimos cuadrados.
// Escribe beats.json, del que la película toma el tiempo de cada golpe.
// Uso: node medir-beats.mjs [A|B]  (A escribe beats.json; B solo verifica que coincida)
import { readFileSync, writeFileSync } from 'node:fs';

const VAR = process.argv[2] || 'A';
const wav = readFileSync(new URL(`./salida/musica-${VAR}.wav`, import.meta.url));
const SR = wav.readUInt32LE(24), ch = wav.readUInt16LE(22), bits = wav.readUInt16LE(34);
let off = 12; while (wav.toString('ascii', off, off + 4) !== 'data') off += 8 + wav.readUInt32LE(off + 4);
const dataLen = wav.readUInt32LE(off + 4), bps = bits / 8, N = dataLen / (bps * ch);
const x = new Float32Array(N);
for (let i = 0; i < N; i++) { let s = 0; for (let c = 0; c < ch; c++) s += wav.readIntLE(off + 8 + (i * ch + c) * bps, bps) / 2 ** (bits - 1); x[i] = s / ch; }

// 4th-order lowpass @150 Hz (two RBJ biquads) isolates kicks / thuds
function lp(sig, f) {
  const w = (2 * Math.PI * f) / SR, c = Math.cos(w), a = Math.sin(w) / (2 * 0.707), a0 = 1 + a;
  const b0 = (1 - c) / 2 / a0, b1 = (1 - c) / a0, a1 = (-2 * c) / a0, a2 = (1 - a) / a0;
  const o = new Float32Array(sig.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < sig.length; i++) { const y = b0 * sig[i] + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = sig[i]; y2 = y1; y1 = y; o[i] = y; }
  return o;
}
const low = lp(lp(x, 150), 150);
const hop = Math.round(0.004 * SR), win = Math.round(0.012 * SR);
const env = [];
for (let s = 0; s + win < N; s += hop) { let e = 0; for (let i = s; i < s + win; i++) e += low[i] * low[i]; env.push(Math.log10(1e-9 + e / win)); }
// rise over ~12 ms in log energy; fixed threshold (a jump of ~4 dB) so loud and quiet sections both count
const flux = env.map((v, i) => (i > 2 ? Math.max(0, v - env[i - 3]) : 0));
const thr = 0.4;
const onsets = [];
for (let i = 2; i < flux.length - 2; i++) {
  if (flux[i] < thr || flux[i] < flux[i - 1] || flux[i] < flux[i + 1]) continue;
  // refine: first sample where |low| reaches 25% of the local peak
  const s0 = Math.max(0, (i - 4) * hop), s1 = Math.min(N, (i + 8) * hop);
  let pk = 0; for (let j = s0; j < s1; j++) pk = Math.max(pk, Math.abs(low[j]));
  let j = s0; while (j < s1 && Math.abs(low[j]) < 0.25 * pk) j++;
  const t = j / SR;
  if (!onsets.length || t - onsets[onsets.length - 1].t > 0.08) onsets.push({ t, s: flux[i] });
}

// coarse period from inter-onset intervals, then least-squares fit t = t0 + n*P
const iois = []; for (let i = 1; i < onsets.length; i++) { const d = onsets[i].t - onsets[i - 1].t; if (d > 0.35 && d < 0.6) iois.push(d); }
iois.sort((a, b) => a - b);
let P = iois[iois.length >> 1], t0 = onsets[0].t;
for (let it = 0; it < 4; it++) {
  const pts = onsets.map(o => ({ n: (o.t - t0) / P, t: o.t })).filter(p => Math.abs(p.n - Math.round(p.n * 4) / 4) < 0.08).map(p => ({ n: Math.round(p.n * 4) / 4, t: p.t }));
  const m = pts.length, sn = pts.reduce((a, p) => a + p.n, 0), st = pts.reduce((a, p) => a + p.t, 0);
  const snn = pts.reduce((a, p) => a + p.n * p.n, 0), snt = pts.reduce((a, p) => a + p.n * p.t, 0);
  P = (m * snt - sn * st) / (m * snn - sn * sn); t0 = (st - P * sn) / m;
}
// residual over onsets that sit on the 16th-note grid (within 15 ms); the rest are off-grid SFX / tails
const resid = onsets.map(o => { const n = Math.round(((o.t - t0) / P) * 4) / 4; return (o.t - (t0 + n * P)) * 1000; }).filter(r => Math.abs(r) < 15);
const rms = Math.sqrt(resid.reduce((a, r) => a + r * r, 0) / resid.length);
// the onset detector fires on the attack, a fixed latency after the true start; t0 absorbs it
const beats = Array.from({ length: 33 }, (_, n) => +(t0 + n * P).toFixed(5));
if (VAR !== 'A') {
  const ref = JSON.parse(readFileSync(new URL('./beats.json', import.meta.url))).beats;
  const dmax = Math.max(...beats.map((b, i) => Math.abs(b - ref[i]))) * 1000;
  console.log(`${VAR}: ${onsets.length} ataques · bpm ${(60 / P).toFixed(3)} · desvío máximo frente a beats.json ${dmax.toFixed(2)} ms`);
  process.exit(0);
}
writeFileSync(new URL('./beats.json', import.meta.url), JSON.stringify({ bpm: +(60 / P).toFixed(3), period: +P.toFixed(6), offset: +t0.toFixed(5), residualMs: +rms.toFixed(2), onGrid: resid.length, onsets: onsets.map(o => +o.t.toFixed(4)), beats }, null, 1) + '\n');
console.log(`A: ${onsets.length} ataques (${resid.length} en la cuadrícula) · bpm ${(60 / P).toFixed(3)} · desfase ${(t0 * 1000).toFixed(1)} ms · residuo rms ${rms.toFixed(2)} ms`);
