// Motor de audio (node): osciladores, filtros, voces, reverb, limitador y sonoridad BS.1770-4.
// Adaptado del showreel; las voces de este archivo son la identidad sonora de Propiedad Conecta.
import { mulberry32, clamp } from './lib.js';

export const SR = 48000;
export const TAU = Math.PI * 2;
const rnd = mulberry32(20261012);
export const noise = () => rnd() * 2 - 1;
export const hz = m => 440 * 2 ** ((m - 69) / 12);
export const buf = sec => new Float32Array(Math.max(1, Math.round(sec * SR)));

export class Biquad {
  constructor(type, f, q = 0.707) { this.type = type; this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set(f, q); }
  set(f, q = this.q) {
    this.q = q;
    const w = (TAU * Math.min(Math.max(f, 10), SR * 0.45)) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
    let b0, b1, b2;
    if (this.type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (this.type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = a; b1 = 0; b2 = -a; }
    const a0 = 1 + a;
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = (-2 * c) / a0; this.a2 = (1 - a) / a0;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

// ---------- voces ----------
// La moneda: dos parciales metálicos inarmónicos que se apagan rápido, más un golpe de ruido muy corto.
export function moneda(f = 2350, len = 0.5) {
  const x = buf(len), hp = new Biquad('hp', 1800);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR, e = Math.exp(-t / 0.09), e2 = Math.exp(-t / 0.035);
    x[i] = 0.55 * Math.sin(TAU * f * t) * e + 0.35 * Math.sin(TAU * f * 1.507 * t + 1) * e2 + 0.18 * Math.sin(TAU * f * 2.73 * t) * e2
      + (t < 0.004 ? hp.run(noise()) * (1 - t / 0.004) * 0.6 : 0);
  }
  return x;
}
// El «punto»: marimba de vidrio (FM 1:2 con un parcial de campana que se apaga rápido).
export function punto(m, len = 1.2, bright = 1) {
  const o = buf(len), f = hz(m);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, idx = bright * 2.4 * Math.exp(-t / 0.05);
    const body = Math.sin(TAU * f * t + Math.sin(TAU * f * 2 * t) * idx) * Math.exp(-t / 0.42);
    const glass = Math.sin(TAU * f * 4.02 * t) * 0.22 * Math.exp(-t / 0.08);
    o[i] = (body + glass) * Math.min(1, t / 0.002) * 0.55;
  }
  return o;
}
// pulso apagado del primer acto (tensión): onda cuadrada filtrada, muy corta
export function pulso(m, len = 0.12) {
  const o = buf(len), lp = new Biquad('lp', 1800, 1.4), f = hz(m);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph = (ph + f / SR) % 1;
    lp.set(300 + 2600 * Math.exp(-t / 0.025), 1.4);
    o[i] = lp.run(ph < 0.5 ? 1 : -1) * Math.exp(-t / 0.05) * Math.min(1, t / 0.001) * 0.6;
  }
  return o;
}
// piano eléctrico FM (cálido) para los acordes de marca
export function ep(midis, dur = 1, rel = 0.5, bright = 1) {
  const len = dur + rel, L = buf(len), R = buf(len);
  midis.forEach((m, n) => {
    const f = hz(m), det = 1 + (n % 2 ? 0.0012 : -0.0012), pan = (n / Math.max(1, midis.length - 1)) * 2 - 1;
    const gl = Math.cos(((pan * 0.6 + 1) * Math.PI) / 4) * Math.SQRT2, gr = Math.sin(((pan * 0.6 + 1) * Math.PI) / 4) * Math.SQRT2;
    for (let i = 0; i < L.length; i++) {
      const t = i / SR, idx = bright * 1.6 * Math.exp(-t / 0.25) + 0.25;
      const env = Math.min(1, t / 0.004) * Math.exp(-t / 1.6) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
      const v = (Math.sin(TAU * f * det * t + Math.sin(TAU * f * t) * idx) + 0.12 * Math.sin(TAU * f * 3 * t) * Math.exp(-t / 0.1)) * env;
      L[i] += v * gl; R[i] += v * gr;
    }
  });
  const g = 0.32 / Math.sqrt(midis.length);
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
  return [L, R];
}
// colchón suave (sierras desafinadas muy filtradas)
export function pad(midis, dur, att = 0.25, rel = 0.6, cut = 1400) {
  const len = dur + rel, L = buf(len), R = buf(len), lpL = new Biquad('lp', cut, 0.7), lpR = new Biquad('lp', cut, 0.7);
  const osc = [];
  for (const m of midis) for (let v = 0; v < 4; v++) osc.push({ f: hz(m) * (1 + 0.006 * (v - 1.5)), ph: rnd(), side: v % 2 });
  const g = 0.5 / Math.sqrt(osc.length);
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    let l = 0, r = 0;
    for (const s of osc) { s.ph += s.f / SR; if (s.ph >= 1) s.ph -= 1; const v = 2 * s.ph - 1; if (s.side) r += v; else l += v; }
    const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
    L[i] = lpL.run(l) * env * g; R[i] = lpR.run(r) * env * g;
  }
  return [L, R];
}
export function bajo(m, dur, peak = 700) {
  const o = buf(dur + 0.04), lp = new Biquad('lp', 400, 0.9), f = hz(m);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph = (ph + f / SR) % 1;
    if ((i & 15) === 0) lp.set(120 + peak * Math.exp(-t / 0.09), 0.9);
    const env = Math.min(1, t / 0.004) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.04) : 1);
    o[i] = (lp.run(2 * ph - 1) * 0.45 + Math.sin(TAU * ph) * 0.8) * env;
  }
  return o;
}
export function bombo(len = 0.4, punch = 1) {
  const o = buf(len), hp = new Biquad('hp', 2000);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, f = 48 + 95 * punch * Math.exp(-t / 0.03);
    ph += (TAU * f) / SR;
    o[i] = Math.tanh(1.6 * Math.sin(ph) * Math.min(1, t / 0.0015) * Math.exp(-t / 0.22)) * 0.85 + hp.run(noise()) * Math.exp(-t / 0.0018) * 0.18;
  }
  return o;
}
export function aro() { // golpe de aro/clap suave
  const o = buf(0.22), bp = new Biquad('bp', 1900, 1.2), bp2 = new Biquad('bp', 820, 4);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, n = noise();
    o[i] = (bp.run(n) * Math.exp(-t / 0.03) * 2.2 + bp2.run(n) * Math.exp(-t / 0.012) * 3) * Math.min(1, t / 0.0006);
  }
  return o;
}
export function maraca(acc = 1) {
  const o = buf(0.07), hp = new Biquad('hp', 6500), bp = new Biquad('bp', 9000, 1.5);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, n = hp.run(noise());
    o[i] = (n + bp.run(n) * 0.6) * Math.min(1, t / (0.004 / acc)) * Math.exp(-t / 0.022);
  }
  return o;
}
// SFX del sello: golpe grave + cachetada de papel + crujido
export function sello(weight = 1) {
  const o = buf(0.35), bp = new Biquad('bp', 1400, 1.0), hp = new Biquad('hp', 3500);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, f = 62 + 110 * Math.exp(-t / 0.018);
    ph += (TAU * f) / SR;
    const thump = Math.sin(ph) * Math.exp(-t / 0.07) * weight;
    const slap = bp.run(noise()) * Math.exp(-t / 0.014) * 2.6;
    const crack = hp.run(noise()) * Math.exp(-t / 0.035) * 0.35;
    o[i] = (thump + slap + crack) * Math.min(1, t / 0.0005);
  }
  return o;
}
// clic de una tarjeta que se voltea
export function clic(f = 4200) {
  const o = buf(0.03), bp = new Biquad('bp', f, 2.5);
  for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = bp.run(noise()) * Math.exp(-t / 0.004) * 2.4 + Math.sin(TAU * f * 0.5 * t) * Math.exp(-t / 0.006) * 0.25; }
  return o;
}
// freno de cinta: todo se detiene
export function freno(m = 47, len = 0.32) {
  const o = buf(len), lp = new Biquad('lp', 3000, 1);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, u = t / len, f = hz(m) * 2 ** (-2.6 * u * u);
    ph = (ph + f / SR) % 1;
    lp.set(3200 * (1 - u) + 120, 1);
    o[i] = lp.run(2 * ph - 1 + noise() * 0.15) * (1 - u) ** 1.5 * 0.7;
  }
  return o;
}
export function barrido(dur, f0, f1, q = 1.6, forma = 'campana') {
  const o = buf(dur), bp = new Biquad('bp', f0, q);
  for (let i = 0; i < o.length; i++) {
    const u = i / o.length;
    if ((i & 15) === 0) bp.set(f0 * (f1 / f0) ** u, q);
    const env = forma === 'sube' ? u ** 2.2 : forma === 'cae' ? (1 - u) ** 1.6 * Math.min(1, u * 40) : Math.sin(Math.PI * u) ** 1.5;
    o[i] = bp.run(noise()) * env * 2.2;
  }
  return o;
}
export function subida(dur, f0 = 250, f1 = 6000) {
  const o = buf(dur), hp = new Biquad('hp', f0, 1.1);
  for (let i = 0; i < o.length; i++) {
    const u = i / o.length;
    if ((i & 15) === 0) hp.set(f0 * (f1 / f0) ** u, 1.1);
    o[i] = hp.run(noise()) * u ** 2.4 * Math.min(1, (o.length - i) / 240);
  }
  return o;
}
export function inverso(dur) { // platillo invertido
  const L = buf(dur), R = buf(dur), a = new Biquad('hp', 4000), b = new Biquad('hp', 4000);
  for (let i = 0; i < L.length; i++) { const u = i / L.length, env = u ** 3 * Math.min(1, (L.length - i) / 80); L[i] = a.run(noise()) * env; R[i] = b.run(noise()) * env; }
  return [L, R];
}
export function grave(len = 1.2, f0 = 70, f1 = 38) {
  const o = buf(len);
  let ph = 0;
  for (let i = 0; i < o.length; i++) { const t = i / SR, f = f1 + (f0 - f1) * Math.exp(-t / 0.15); ph += (TAU * f) / SR; o[i] = Math.sin(ph) * Math.min(1, t / 0.004) * Math.exp(-t / (len * 0.38)); }
  return o;
}
export function campana(m, len = 1.6) {
  const o = buf(len), f = hz(m);
  for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = Math.sin(TAU * f * t + Math.sin(TAU * f * 3.5 * t) * 1.8 * Math.exp(-t / 0.3)) * Math.exp(-t / 0.6) * Math.min(1, t / 0.002) * 0.4; }
  return o;
}

// ---------- mezcla ----------
export function fft(re, im, inv) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (TAU / len) * (inv ? 1 : -1), wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const a = i + j, b = a + len / 2, xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
  if (inv) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}
export function convolve(x, ir) {
  let n = 1; while (n < x.length + ir.length) n <<= 1;
  const ar = new Float64Array(n), ai = new Float64Array(n), br = new Float64Array(n), bi = new Float64Array(n);
  ar.set(x); br.set(ir); fft(ar, ai, false); fft(br, bi, false);
  for (let i = 0; i < n; i++) { const r = ar[i] * br[i] - ai[i] * bi[i]; ai[i] = ar[i] * bi[i] + ai[i] * br[i]; ar[i] = r; }
  fft(ar, ai, true);
  return Float32Array.from(ar.subarray(0, x.length));
}
export function room(seconds = 1.5, decay = 0.38) {
  const irLen = Math.round(seconds * SR), pre = Math.round(0.012 * SR);
  return [0, 1].map(() => {
    const ir = new Float32Array(irLen), lp = new Biquad('lp', 6500);
    for (let i = pre; i < irLen; i++) { const t = (i - pre) / SR; if ((i & 63) === 0) lp.set(6500 * Math.exp(-t / 0.45) + 800); ir[i] = lp.run(noise()) * Math.exp(-t / decay); }
    let e = 0; for (const v of ir) e += v * v; const g = 1 / Math.sqrt(e);
    for (let i = 0; i < irLen; i++) ir[i] *= g;
    return ir;
  });
}
const kpond = x => { // ponderación K de BS.1770 a 48 kHz
  const s1 = { b: [1.53512485958697, -2.69169618940638, 1.19839281085285], a: [-1.69065929318241, 0.73248077421585] };
  const s2 = { b: [1, -2, 1], a: [-1.99004745483398, 0.99007225036621] };
  const run = (inp, f) => { const o = new Float64Array(inp.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < inp.length; i++) { const y = f.b[0] * inp[i] + f.b[1] * x1 + f.b[2] * x2 - f.a[0] * y1 - f.a[1] * y2; x2 = x1; x1 = inp[i]; y2 = y1; y1 = y; o[i] = y; } return o; };
  return run(run(x, s1), s2);
};
// sonoridad (ponderada K, sin compuertas) solo dentro de los tramos [t0, t1] en segundos
export function sonoridadTramos([L, R], tramos) {
  const kl = kpond(L), kr = kpond(R);
  let e = 0, n = 0;
  for (const [t0, t1] of tramos) for (let i = Math.max(0, Math.round(t0 * SR)); i < Math.min(L.length, Math.round(t1 * SR)); i++) { e += kl[i] * kl[i] + kr[i] * kr[i]; n++; }
  return -0.691 + 10 * Math.log10(e / n + 1e-12);
}
export function lufs([L, R]) {
  const N = L.length;
  const kl = kpond(L), kr = kpond(R), blk = Math.round(0.4 * SR), hop = Math.round(0.1 * SR), z = [];
  for (let s = 0; s + blk <= N; s += hop) { let e = 0; for (let i = s; i < s + blk; i++) e += kl[i] * kl[i] + kr[i] * kr[i]; z.push(e / blk); }
  const Lk = v => -0.691 + 10 * Math.log10(v);
  const abs = z.filter(v => Lk(v) > -70), rel = Lk(abs.reduce((a, b) => a + b, 0) / abs.length) - 10;
  const g = abs.filter(v => Lk(v) > rel);
  return Lk(g.reduce((a, b) => a + b, 0) / g.length);
}
export function limit([L, R], ceilDb) {
  const N = L.length, ceil = 10 ** (ceilDb / 20), W = Math.round(0.004 * SR), rel = 1 - Math.exp(-1 / (0.07 * SR));
  const req = new Float32Array(N);
  for (let i = 0; i < N; i++) { const p = Math.max(Math.abs(L[i]), Math.abs(R[i])); req[i] = p > ceil ? ceil / p : 1; }
  const gm = new Float32Array(N);
  for (let i = 0; i < N; i++) { let m = 1; for (let j = i; j < Math.min(N, i + W); j++) if (req[j] < m) m = req[j]; gm[i] = m; }
  let acc = 0, prev = 1;
  for (let i = 0; i < N; i++) { acc += gm[i]; if (i >= W) acc -= gm[i - W]; const g = Math.min(acc / Math.min(i + 1, W), prev + (1 - prev) * rel); prev = g; L[i] *= g; R[i] *= g; }
}
export function readWav(bytes) { // PCM entero → [L, R] en Float32 (mono → dos canales iguales)
  const ch = bytes.readUInt16LE(22), bits = bytes.readUInt16LE(34), bps = bits / 8;
  let off = 12; while (bytes.toString('ascii', off, off + 4) !== 'data') off += 8 + bytes.readUInt32LE(off + 4);
  const N = bytes.readUInt32LE(off + 4) / (bps * ch), out = [new Float32Array(N), new Float32Array(N)];
  for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) out[c][i] = bytes.readIntLE(off + 8 + (i * ch + Math.min(c, ch - 1)) * bps, bps) / 2 ** (bits - 1);
  return out;
}
export function writeWav(path, [L, R]) {
  const N = L.length, bytes = Buffer.alloc(44 + N * 6);
  bytes.write('RIFF', 0); bytes.writeUInt32LE(36 + N * 6, 4); bytes.write('WAVE', 8); bytes.write('fmt ', 12);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(2, 22); bytes.writeUInt32LE(SR, 24);
  bytes.writeUInt32LE(SR * 6, 28); bytes.writeUInt16LE(6, 32); bytes.writeUInt16LE(24, 34); bytes.write('data', 36); bytes.writeUInt32LE(N * 6, 40);
  for (let i = 0; i < N; i++) { bytes.writeIntLE(Math.round(clamp(L[i], -1, 1) * 8388607), 44 + i * 6, 3); bytes.writeIntLE(Math.round(clamp(R[i], -1, 1) * 8388607), 47 + i * 6, 3); }
  return bytes;
}
