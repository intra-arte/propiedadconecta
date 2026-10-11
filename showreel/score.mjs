// Synthesizes the whole score + SFX from the shared cue sheet -> out/score.wav
// 48 kHz stereo, normalized to -14 LUFS integrated, true peak <= -1 dBTP.
import { writeFileSync, mkdirSync } from 'node:fs';
import { BPM, CUE, DURATION } from './src/cues.js';
import { mulberry32, SHOWCASE, clamp } from './src/lib.js';

const SR = 48000;
const N = Math.round(DURATION * SR);
const BEAT = 60 / BPM;
const B = b => b * BEAT;
const TAU = Math.PI * 2;
const rnd = mulberry32(20261011);
const noise = () => rnd() * 2 - 1;
const hz = m => 440 * 2 ** ((m - 69) / 12); // midi -> Hz
const NOTE = { A1: 33, E1: 28, F1: 29, G1: 31, A2: 45, C3: 48, E3: 52, F3: 53, G3: 55, A3: 57, B3: 59, C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, Gs4: 68, A4: 69, B4: 71, C5: 72, D5: 74, E5: 76, G5: 79, A5: 81, C6: 84, D6: 86, E6: 88 };

// ---------- buses ----------
const bus = () => [new Float32Array(N), new Float32Array(N)];
const drums = bus(), low = bus(), music = bus(), sfx = bus(), send = bus();

function place(dst, t0, sig, gain = 1, pan = 0, sendAmt = 0) {
  const [L, R] = Array.isArray(sig) ? sig : [sig, sig];
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2, gr = Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const s0 = Math.round(t0 * SR);
  for (let i = 0; i < L.length; i++) {
    const j = s0 + i;
    if (j < 0 || j >= N) continue;
    const l = L[i] * gain * gl, r = R[i] * gain * gr;
    dst[0][j] += l; dst[1][j] += r;
    if (sendAmt) { send[0][j] += l * sendAmt; send[1][j] += r * sendAmt; }
  }
}

class Biquad {
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
const buf = sec => new Float32Array(Math.round(sec * SR));

// ---------- voices ----------
function kick(len = 0.5, tone = 1) {
  const o = buf(len), hp = new Biquad('hp', 1800);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const f = 44 + 140 * tone * Math.exp(-t / 0.028) + 60 * Math.exp(-t / 0.005);
    ph += (TAU * f) / SR;
    const env = Math.min(1, t / 0.0012) * Math.exp(-t / (0.3 * len / 0.5));
    o[i] = Math.tanh(2 * Math.sin(ph) * env) * 0.85 + hp.run(noise()) * Math.exp(-t / 0.0022) * 0.35;
  }
  return o;
}
function clap(pitch = 1) {
  const o = buf(0.4), bp = new Biquad('bp', 1350 * pitch, 0.8), hp = new Biquad('hp', 600);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    let env = 0;
    for (let k = 0; k < 3; k++) if (t >= k * 0.0105) env += Math.exp(-(t - k * 0.0105) / 0.004) * 0.75;
    if (t >= 0.021) env += Math.exp(-(t - 0.021) / 0.12) * 0.55;
    o[i] = hp.run(bp.run(noise())) * env * 3.2;
  }
  return o;
}
function hat(open = false) {
  const o = buf(open ? 0.35 : 0.08), h1 = new Biquad('hp', 7200), h2 = new Biquad('hp', 7200), bp = new Biquad('bp', 10500, 1.5);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, n = h2.run(h1.run(noise()));
    o[i] = (n + bp.run(n) * 0.8) * Math.exp(-t / (open ? 0.11 : 0.02)) * Math.min(1, t / 0.0005);
  }
  return o;
}
function crash(len = 1.8, bright = 1) {
  const L = buf(len), R = buf(len), hl = new Biquad('hp', 3000 * bright), hr = new Biquad('hp', 3000 * bright);
  for (let i = 0; i < L.length; i++) {
    const t = i / SR, env = Math.min(1, t / 0.002) * (0.6 * Math.exp(-t / 0.08) + 0.4 * Math.exp(-t / (len * 0.3)));
    L[i] = hl.run(noise()) * env; R[i] = hr.run(noise()) * env;
  }
  return [L, R];
}
function boom(len = 1.4, f0 = 72, f1 = 34) {
  const o = buf(len);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, f = f1 + (f0 - f1) * Math.exp(-t / 0.18);
    ph += (TAU * f) / SR;
    o[i] = Math.sin(ph) * Math.min(1, t / 0.003) * Math.exp(-t / (len * 0.4));
  }
  return o;
}
function bassNote(m, dur, peak = 900) {
  const o = buf(dur + 0.03), lp = new Biquad('lp', 400, 1.1), f = hz(m);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph = (ph + f / SR) % 1;
    lp.set(140 + peak * Math.exp(-t / 0.07), 1.1);
    const saw = 2 * ph - 1, sub = Math.sin(TAU * ph);
    const env = Math.min(1, t / 0.003) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.03) : 1);
    o[i] = (lp.run(saw) * 0.55 + sub * 0.75) * env;
  }
  return o;
}
// supersaw chord, stereo; opts: dur, cut, cutEnd, decay, release, attack
function saws(midis, o = {}) {
  const { dur = 0.25, cut = 6000, cutEnd = 700, decay = 0.12, release = 0.12, attack = 0.004, voices = 7, detune = 0.011 } = o;
  const len = dur + release, L = buf(len), R = buf(len);
  const lpL = new Biquad('lp', cut, 0.9), lpR = new Biquad('lp', cut, 0.9);
  const osc = [];
  for (const m of midis) for (let v = 0; v < voices; v++) {
    const d = 1 + detune * ((v / (voices - 1)) * 2 - 1);
    osc.push({ f: hz(m) * d, ph: rnd(), side: v % 2 ? 1 : 0, amp: v === (voices >> 1) ? 1 : 0.7 });
  }
  const norm = 1 / Math.sqrt(osc.length);
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    let l = 0, r = 0;
    for (const s of osc) {
      s.ph += s.f / SR; if (s.ph >= 1) s.ph -= 1;
      const v = (2 * s.ph - 1) * s.amp;
      if (s.side) r += v; else l += v;
    }
    if ((i & 31) === 0) { const c = cutEnd + (cut - cutEnd) * Math.exp(-t / decay); lpL.set(c, 0.9); lpR.set(c, 0.9); }
    const env = Math.min(1, t / attack) * (t > dur ? Math.max(0, 1 - (t - dur) / release) : 1);
    L[i] = lpL.run(l) * norm * env; R[i] = lpR.run(r) * norm * env;
  }
  return [L, R];
}
// FM pluck: the dot's voice
function pluck(m, len = 1.0, bright = 1) {
  const o = buf(len), f = hz(m);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, idx = bright * 3.4 * Math.exp(-t / 0.04);
    const car = Math.sin(TAU * f * t + Math.sin(TAU * f * 2 * t) * idx);
    const body = Math.sin(TAU * f * t) * Math.exp(-t / 0.5) * 0.4;
    o[i] = (car * Math.exp(-t / 0.22) + body) * Math.min(1, t / 0.0015) * 0.6;
  }
  return o;
}
function sweep(dur, f0, f1, q = 2, shape = 'bell') {
  const o = buf(dur), bp = new Biquad('bp', f0, q);
  for (let i = 0; i < o.length; i++) {
    const u = i / o.length;
    if ((i & 15) === 0) bp.set(f0 * (f1 / f0) ** u, q);
    const env = shape === 'rise' ? u ** 2.4 : shape === 'fall' ? (1 - u) ** 1.5 * Math.min(1, u * 40) : Math.sin(Math.PI * u) ** 1.6;
    o[i] = bp.run(noise()) * env * 2.2;
  }
  return o;
}
function riser(dur, f0 = 300, f1 = 7000) {
  const o = buf(dur), hp = new Biquad('hp', f0, 1.2);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const u = i / o.length, t = i / SR;
    if ((i & 15) === 0) hp.set(f0 * (f1 / f0) ** u, 1.2);
    ph += (TAU * (180 * 2 ** (u * 2))) / SR;
    o[i] = (hp.run(noise()) * 0.8 + Math.sin(ph) * 0.12 * u) * u ** 2.2 * Math.min(1, (o.length - i) / 200);
    void t;
  }
  return o;
}
function revCymbal(dur) {
  const L = buf(dur), R = buf(dur), a = new Biquad('hp', 4500), b = new Biquad('hp', 4500);
  for (let i = 0; i < L.length; i++) {
    const u = i / L.length, env = u ** 3 * Math.min(1, (L.length - i) / 60);
    L[i] = a.run(noise()) * env; R[i] = b.run(noise()) * env;
  }
  return [L, R];
}
function gloop(f = 300, len = 0.12) {
  const o = buf(len);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, fr = f * (1 + 2.2 * (1 - Math.exp(-t / 0.03)));
    ph += (TAU * fr) / SR;
    o[i] = Math.sin(ph) * Math.min(1, t / 0.002) * Math.exp(-t / 0.045);
  }
  return o;
}
function tick(f = 3200) {
  const o = buf(0.05), bp = new Biquad('bp', f, 3);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = bp.run(noise()) * Math.exp(-t / 0.003) * 2.5 + Math.sin(TAU * f * 0.75 * t) * Math.exp(-t / 0.01) * 0.35;
  }
  return o;
}
function boing(f = 210) {
  const o = buf(0.5);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, fr = f * (1 + 0.22 * Math.sin(TAU * 13 * t) * Math.exp(-t / 0.18)) * (1 + 0.5 * Math.exp(-t / 0.02));
    ph += (TAU * fr) / SR;
    o[i] = Math.sin(ph) * Math.min(1, t / 0.002) * Math.exp(-t / 0.16);
  }
  return o;
}
// pitch glide that literally plays an ease: f = base * 2^(value)
function glide(fn, dur, base) {
  const o = buf(dur + 0.06);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, u = clamp(t / dur), v = fn(u);
    ph += (TAU * base * 2 ** v) / SR;
    const env = Math.min(1, t / 0.008) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.06) : 1);
    o[i] = (Math.sin(ph) + 0.18 * Math.sin(3 * ph) + 0.08 * Math.sin(2 * ph)) * env * 0.5;
  }
  return o;
}

// ---------- arrangement ----------
const kickTimes = [];
const K = (b, g = 1, len = 0.5) => { place(drums, B(b), kick(len), g); kickTimes.push(B(b)); };

// bar 1: launch + halving bounce rhythm + riser
K(CUE.launch, 1.0);
place(low, B(CUE.launch), boom(1.2, 80, 36), 0.7);
place(sfx, B(CUE.launch), sweep(0.18, 500, 5000, 2.5, 'fall'), 0.45, -0.5, 0.2);
const bouncePitch = [NOTE.A4, NOTE.C5, NOTE.E5, NOTE.G5];
CUE.bounces.forEach((b, i) => {
  place(drums, B(b), kick(0.18, 0.6), 0.5 - i * 0.06);
  place(music, B(b), pluck(bouncePitch[i], 0.9, 1.1), 0.55, -0.45 + i * 0.12, 0.35);
});
for (let s = 0; s < 16; s++) place(drums, B(s * 0.25), hat(), 0.05 + 0.1 * (s / 16) * (s % 2 ? 0.6 : 1), 0.25);
place(sfx, B(2), riser(B(2)), 0.35, 0, 0.2);
place(sfx, B(3.25), revCymbal(B(0.75)), 0.45);

// drums bars 2-7
for (let b = 4; b < 28; b++) {
  if (b >= 24) continue; // slams handled below
  K(b, b % 4 === 0 ? 1.0 : 0.92);
  if (b % 2 === 1 && b !== 15) place(drums, B(b), clap(), 0.45, 0, 0.12);
  if (b !== 15) place(drums, B(b + 0.5), hat(b >= 16 && b < 20 && b % 2 === 1), 0.24, 0.2);
  if (b >= 16 && b < 24) for (const q of [0.25, 0.75]) place(drums, B(b + q), hat(), 0.09, -0.25);
}
place(sfx, B(15), riser(B(1)), 0.4, 0, 0.25);
place(sfx, B(15.0), revCymbal(B(1)), 0.6);
for (const [b, g] of [[4, 0.55], [8, 0.3], [12, 0.35], [16, 0.7], [24, 0.35]]) place(drums, B(b), crash(1.8), g, 0, 0.3);

// bass
const bassBar = (bar, m, pattern) => { for (const q of pattern) place(low, B(bar * 4 + q), bassNote(m, B(0.22)), 0.5); };
const off8 = [0.5, 1.5, 2.5, 3.5];
const roll = []; for (let q = 0; q < 4; q += 0.25) if (q % 1 !== 0) roll.push(q);
place(low, B(4), bassNote(NOTE.A1, B(0.4), 1400), 0.55);
bassBar(1, NOTE.A1, off8);
bassBar(2, NOTE.F1, off8);
bassBar(3, NOTE.G1, [0.5, 1.5, 2.5, 3.0]);
place(low, B(16), boom(1.6, 90, 38), 0.8);
bassBar(4, NOTE.A1, roll);
bassBar(5, NOTE.F1, roll.filter(q => q < 3.5));

// pads (ducked later by sidechain)
const pad = (b, len, chord, g) => place(music, B(b), saws(chord, { dur: B(len), attack: 0.06, cut: 1500, cutEnd: 1100, decay: 1, release: 0.25, voices: 5 }), g, 0, 0.4);
pad(8, 4, [NOTE.F3, NOTE.A3, NOTE.C4, NOTE.E4], 0.14);
pad(12, 3.5, [NOTE.G3, NOTE.B3, NOTE.D4, NOTE.A4], 0.16);
pad(16, 4, [NOTE.A3, NOTE.C4, NOTE.E4, NOTE.B4], 0.2);
pad(20, 4, [NOTE.F3, NOTE.A3, NOTE.C4, NOTE.E4], 0.15);

// stabs
const AM = [NOTE.A3, NOTE.C4, NOTE.E4, NOTE.A4], FM = [NOTE.F3, NOTE.A3, NOTE.C4, NOTE.F4], GM = [NOTE.G3, NOTE.B3, NOTE.D4, NOTE.G4], EM = [NOTE.E3, NOTE.Gs4 - 12, NOTE.B3, NOTE.E4];
const stab = (b, ch, g = 0.32, dur = 0.16) => place(music, B(b), saws(ch, { dur, cut: 7000, cutEnd: 900, decay: 0.09 }), g, 0, 0.3);
stab(4, AM, 0.4, 0.3);
stab(8, FM, 0.22);
stab(12, GM, 0.26);
stab(16, AM, 0.45, 0.3);
for (const q of [0.75, 1.5, 2.5, 3.25]) stab(16 + q, AM, 0.26);
stab(20, FM, 0.28, 0.25);

// arps: bar 3 & 4 shimmer under the grid / 3D
const arp = (b0, notes, steps, g) => { for (let s = 0; s < steps; s++) place(music, B(b0 + s * 0.25), pluck(notes[s % notes.length], 0.5, 0.7), g, s % 2 ? 0.35 : -0.35, 0.3); };
arp(8.5, [NOTE.F4, NOTE.A4, NOTE.C5, NOTE.E5, NOTE.C5, NOTE.A4], 14, 0.13);
arp(12, [NOTE.G4, NOTE.B4, NOTE.D5, NOTE.A5, NOTE.D5, NOTE.B4], 12, 0.15);
// grid spawn: fast upward run on 32nds as the wavefront expands
[NOTE.A4, NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.A5, NOTE.C6, NOTE.D6, NOTE.E6].forEach((m, i) => place(music, B(8 + i * 0.125), pluck(m, 0.5, 1.2), 0.2 - i * 0.012, -0.6 + i * 0.15, 0.4));

// bar 2 type moments
place(sfx, B(CUE.erupt), sweep(0.2, 400, 4000, 2.5, 'fall'), 0.4, 0.1, 0.2);
place(music, B(CUE.tittle), pluck(NOTE.A5, 1.0, 1.2), 0.5, 0, 0.4);
place(sfx, B(CUE.tittle), boing(196), 0.22, 0, 0.2);
place(sfx, B(CUE.accordion), sweep(0.16, 3000, 500, 3, 'bell'), 0.4, -0.2, 0.15);
place(sfx, B(CUE.accordion + 0.25), sweep(0.14, 500, 3500, 3, 'bell'), 0.32, 0.2, 0.15);
place(sfx, B(CUE.hop), sweep(0.16, 600, 6000, 2.5, 'fall'), 0.4, 0, 0.2);
place(sfx, B(CUE.hop + 0.15), sweep(0.35, 2500, 200, 1.2, 'bell'), 0.5, 0, 0.2);
// bar 3/4
place(sfx, B(CUE.grid), boom(0.8, 110, 50), 0.35);
place(low, B(CUE.ripple), boom(0.5, 90, 40), 0.35);
place(sfx, B(CUE.swirl), sweep(B(1.2), 300, 2500, 1.1), 0.35, 0, 0.3);
place(sfx, B(CUE.tilt), sweep(B(1), 180, 1500, 1.1, 'rise'), 0.4, 0, 0.3);
place(sfx, B(CUE.terrain), boom(0.9, 70, 40), 0.5);
place(sfx, B(CUE.sphere), sweep(B(1.1), 400, 5000, 1.4), 0.32, 0.3, 0.35);
place(sfx, B(CUE.orbit), sweep(B(1), 2000, 600, 1.4), 0.2, -0.4, 0.35);
// bar 5 liquid
place(sfx, B(CUE.liquid), crash(1.6, 0.6), 0.25, 0, 0.2);
const gl = mulberry32(5);
for (let i = 0; i < 9; i++) place(sfx, B(16.05 + i * 0.07), gloop(260 + gl() * 500), 0.22, gl() * 1.4 - 0.7, 0.3);
for (const b of [16.75, 17.25, 17.5, 18.75, 19.25]) place(sfx, B(b), gloop(300 + gl() * 400), 0.24, gl() * 1.2 - 0.6, 0.3);
place(sfx, B(CUE.merge), gloop(120, 0.25), 0.5, 0, 0.3);
place(music, B(CUE.merge), pluck(NOTE.A3, 0.9, 0.8), 0.32, 0, 0.3);
place(sfx, B(CUE.pour), sweep(B(1), 300, 1800, 3.5, 'bell'), 0.45, 0, 0.3);
// bar 6 curve: ticks + glides that play each ease
SHOWCASE.forEach((ease, k) => {
  const b = CUE.curve + k;
  place(sfx, B(b), tick(3400), 0.45, 0.3);
  place(music, B(b) + 0.03, glide(ease.fn, 0.82 * BEAT, hz(NOTE.C5)), 0.28, 0.15, 0.35);
});
place(sfx, B(23.7), sweep(B(0.3), 500, 7000, 2, 'rise'), 0.45, 0, 0.2);
// bar 7 slams: kick + chord + hit; stutter roll into the end
const slamChords = [AM, FM, GM, EM];
CUE.slams.forEach((b, i) => {
  K(b, 1);
  stab(b, slamChords[i], 0.38, 0.2);
  place(drums, B(b), crash(0.5, 1.4), 0.22, 0, 0.1);
  place(drums, B(b + 0.5), hat(true), 0.18, 0.2);
});
place(drums, B(25), clap(), 0.45, 0, 0.12);
CUE.stutter.forEach((b, i) => { place(drums, B(b), clap(1 + i * 0.12), 0.32 + i * 0.06, 0, 0.12); if (i) stab(b, EM, 0.18 + i * 0.04, 0.08); });
place(sfx, B(27), revCymbal(B(1)), 0.6);
// bar 8 end card
K(CUE.end, 1.05, 0.6);
place(low, B(CUE.end), boom(1.8, 75, 33), 0.85);
place(low, B(CUE.end), bassNote(NOTE.A1, 1.5, 700), 0.5);
place(drums, B(CUE.end), crash(1.9, 0.9), 0.6, 0, 0.4);
place(music, B(CUE.end), saws([NOTE.A2, NOTE.E3, NOTE.A3, NOTE.C4, NOTE.E4, NOTE.B4], { dur: 1.45, cut: 4500, cutEnd: 1200, decay: 0.5, release: 0.4, attack: 0.005 }), 0.34, 0, 0.5);
place(sfx, B(CUE.end + 0.1), sweep(B(0.9), 3000, 400, 2, 'rise'), 0.22, 0, 0.2);
const endPitch = [NOTE.A5, NOTE.E5, NOTE.C5, NOTE.A4];
CUE.endBounces.forEach((b, i) => place(music, B(b), pluck(endPitch[i], 1.1, 1.0), 0.5 - i * 0.07, 0.2, 0.45));
place(sfx, B(CUE.rest), tick(2600), 0.18, 0.2, 0.3);

// ---------- sidechain duck ----------
kickTimes.sort((a, b) => a - b);
function duck(target, depth) {
  let k = -1;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    while (k + 1 < kickTimes.length && kickTimes[k + 1] <= t) k++;
    const g = k < 0 ? 1 : 1 - depth * Math.exp(-(t - kickTimes[k]) / 0.12);
    target[0][i] *= g; target[1][i] *= g;
  }
}
duck(music, 0.55);
duck(low, 0.6);

// ---------- reverb (FFT convolution with a synthetic room) ----------
function fft(re, im, inv) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (TAU / len) * (inv ? 1 : -1), wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const a = i + j, b = a + len / 2;
        const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
  if (inv) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}
function convolve(x, ir) {
  let n = 1; while (n < x.length + ir.length) n <<= 1;
  const ar = new Float64Array(n), ai = new Float64Array(n), br = new Float64Array(n), bi = new Float64Array(n);
  ar.set(x); br.set(ir);
  fft(ar, ai, false); fft(br, bi, false);
  for (let i = 0; i < n; i++) { const r = ar[i] * br[i] - ai[i] * bi[i]; ai[i] = ar[i] * bi[i] + ai[i] * br[i]; ar[i] = r; }
  fft(ar, ai, true);
  return Float32Array.from(ar.subarray(0, x.length));
}
const irLen = Math.round(1.7 * SR), pre = Math.round(0.014 * SR);
const verb = [0, 1].map(c => {
  const ir = new Float32Array(irLen), lp = new Biquad('lp', 7000);
  for (let i = pre; i < irLen; i++) { const t = (i - pre) / SR; if ((i & 63) === 0) lp.set(7000 * Math.exp(-t / 0.5) + 900); ir[i] = lp.run(noise()) * Math.exp(-t / 0.42); }
  let e = 0; for (const v of ir) e += v * v; const g = 1 / Math.sqrt(e);
  for (let i = 0; i < irLen; i++) ir[i] *= g;
  return convolve(send[c], ir);
});

// ---------- master ----------
const mix = [new Float32Array(N), new Float32Array(N)];
for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) {
  const v = drums[c][i] * 1.0 + low[c][i] * 0.95 + music[c][i] * 0.8 + sfx[c][i] * 0.8 + verb[c][i] * 0.42;
  mix[c][i] = Math.tanh(v * 0.45) / 0.45; // gentle glue on the peaks
}
// master high-pass at 30 Hz: sub energy below that only costs headroom
for (let c = 0; c < 2; c++) { const h1 = new Biquad('hp', 30), h2 = new Biquad('hp', 30); for (let i = 0; i < N; i++) mix[c][i] = h2.run(h1.run(mix[c][i])); }
// fade the very end of the tail
for (let i = 0; i < N; i++) { const t = i / SR, g = t > DURATION - 0.35 ? Math.max(0, (DURATION - t) / 0.35) ** 1.5 : 1; mix[0][i] *= g; mix[1][i] *= g; }

// BS.1770-4 integrated loudness
function lufs([L, R]) {
  const k = x => {
    const s1 = { b: [1.53512485958697, -2.69169618940638, 1.19839281085285], a: [-1.69065929318241, 0.73248077421585] };
    const s2 = { b: [1, -2, 1], a: [-1.99004745483398, 0.99007225036621] };
    const run = (inp, f) => { const o = new Float64Array(inp.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < inp.length; i++) { const y = f.b[0] * inp[i] + f.b[1] * x1 + f.b[2] * x2 - f.a[0] * y1 - f.a[1] * y2; x2 = x1; x1 = inp[i]; y2 = y1; y1 = y; o[i] = y; } return o; };
    return run(run(x, s1), s2);
  };
  const kl = k(L), kr = k(R), blk = Math.round(0.4 * SR), hop = Math.round(0.1 * SR), z = [];
  for (let s = 0; s + blk <= N; s += hop) { let e = 0; for (let i = s; i < s + blk; i++) e += kl[i] * kl[i] + kr[i] * kr[i]; z.push(e / blk); }
  const Lk = v => -0.691 + 10 * Math.log10(v);
  const abs = z.filter(v => Lk(v) > -70);
  const rel = Lk(abs.reduce((a, b) => a + b, 0) / abs.length) - 10;
  const g = abs.filter(v => Lk(v) > rel);
  return Lk(g.reduce((a, b) => a + b, 0) / g.length);
}
function limit([L, R], ceilDb) {
  const ceil = 10 ** (ceilDb / 20), W = Math.round(0.004 * SR), rel = 1 - Math.exp(-1 / (0.07 * SR));
  const req = new Float32Array(N);
  for (let i = 0; i < N; i++) { const p = Math.max(Math.abs(L[i]), Math.abs(R[i])); req[i] = p > ceil ? ceil / p : 1; }
  const gm = new Float32Array(N); // forward-looking window minimum
  for (let i = 0; i < N; i++) { let m = 1; for (let j = i; j < Math.min(N, i + W); j++) if (req[j] < m) m = req[j]; gm[i] = m; }
  let acc = 0, prev = 1;
  for (let i = 0; i < N; i++) {
    acc += gm[i]; if (i >= W) acc -= gm[i - W];
    const avg = acc / Math.min(i + 1, W);
    const g = Math.min(avg, prev + (1 - prev) * rel);
    prev = g; L[i] *= g; R[i] *= g;
  }
}
const gain = ([L, R], db) => { const g = 10 ** (db / 20); for (let i = 0; i < N; i++) { L[i] *= g; R[i] *= g; } };
// sample-peak ceiling leaves room for inter-sample peaks (target: true peak <= -1 dBTP after AAC)
for (let pass = 0; pass < 4; pass++) { gain(mix, -14 - lufs(mix)); limit(mix, -2.4); }
const finalLufs = lufs(mix);
let peak = 0; for (let c = 0; c < 2; c++) for (const v of mix[c]) peak = Math.max(peak, Math.abs(v));

// ---------- write 24-bit WAV ----------
mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
const bytes = Buffer.alloc(44 + N * 6);
bytes.write('RIFF', 0); bytes.writeUInt32LE(36 + N * 6, 4); bytes.write('WAVE', 8); bytes.write('fmt ', 12);
bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(2, 22); bytes.writeUInt32LE(SR, 24);
bytes.writeUInt32LE(SR * 6, 28); bytes.writeUInt16LE(6, 32); bytes.writeUInt16LE(24, 34); bytes.write('data', 36); bytes.writeUInt32LE(N * 6, 40);
for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) bytes.writeIntLE(Math.round(clamp(mix[c][i], -1, 1) * 8388607), 44 + i * 6 + c * 3, 3);
writeFileSync(new URL('./out/score.wav', import.meta.url), bytes);
console.log(`score.wav  ${DURATION}s  ${finalLufs.toFixed(2)} LUFS  peak ${(20 * Math.log10(peak)).toFixed(2)} dBFS`);
