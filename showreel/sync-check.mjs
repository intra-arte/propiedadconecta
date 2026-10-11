// Sound-sync check: measures visual change per frame of a rendered video and
// reports how close the big visual events land to the measured beat grid.
// node sync-check.mjs out/preview.mp4
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'out/preview.mp4';
const beats = JSON.parse(readFileSync(new URL('./beats.json', import.meta.url))).beats;
const fps = +execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', file]).toString().trim().split('/').reduce((a, b) => a / b);
const w = 96, h = 54;
const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${w}:${h}:flags=area,format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 28 });
const n = raw.length / (w * h);
const diff = [0];
for (let f = 1; f < n; f++) { let s = 0; for (let i = 0; i < w * h; i++) s += Math.abs(raw[f * w * h + i] - raw[(f - 1) * w * h + i]); diff.push(s / (w * h)); }

// visual events = local maxima well above the running median
const med = diff.map((_, i) => { const win = diff.slice(Math.max(0, i - 15), i + 16).sort((a, b) => a - b); return win[win.length >> 1]; });
const events = [];
for (let i = 1; i < n - 1; i++) if (diff[i] > diff[i - 1] && diff[i] >= diff[i + 1] && diff[i] > 3 * med[i] + 1.5) events.push({ t: i / fps, v: diff[i] });
const P = beats[1] - beats[0];
const off = events.map(e => { const b = (e.t - beats[0]) / P, q = Math.round(b * 4) / 4; return { ...e, beat: q, ms: (e.t - (beats[0] + q * P)) * 1000 }; });
const tol = 1000 / fps + 1; // one frame
const onGrid = off.filter(e => Math.abs(e.ms) <= tol);
const big = [...off].sort((a, b) => b.v - a.v).slice(0, 16);
console.log(`${n} frames @ ${fps} fps · ${events.length} visual events · ${onGrid.length} within one frame of the 16th grid (${Math.round((100 * onGrid.length) / events.length)}%)`);
console.log('largest events:');
for (const e of big.sort((a, b) => a.t - b.t)) console.log(`  t=${e.t.toFixed(3)}s  beat ${e.beat.toFixed(2).padStart(5)}  ${e.ms >= 0 ? '+' : ''}${e.ms.toFixed(0).padStart(3)} ms  Δ=${e.v.toFixed(1)}`);
// which downbeats/beats have no visual event near them?
const silent = [];
for (let b = 0; b < 32; b++) if (!off.some(e => Math.abs(e.t - (beats[0] + b * P)) <= 0.06)) silent.push(b);
console.log('beats with no visual event within 60 ms:', silent.join(' ') || 'none');

// Dot tracking: the accent dot's lowest points (impacts) vs the cue sheet.
// Only meaningful where the dot is the sole accent object (bar 1–2 and the end card).
const rgb = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=480:270:flags=area`, '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 });
const W2 = 480, H2 = 270, fsz = W2 * H2 * 3, nf = rgb.length / fsz;
const cy = [];
for (let f = 0; f < nf; f++) {
  let sy = 0, c = 0, base = f * fsz;
  for (let i = 0; i < W2 * H2; i++) { const r = rgb[base + i * 3], g = rgb[base + i * 3 + 1], b = rgb[base + i * 3 + 2]; if (r > 200 && g > 40 && g < 120 && b < 80) { sy += Math.floor(i / W2); c++; } }
  cy.push(c > 4 && c < 9000 ? sy / c : NaN);
}
const { CUE } = await import('./src/cues.js');
const expected = [...CUE.bounces, CUE.tittle, CUE.grid, ...CUE.endBounces];
const lows = [];
for (let f = 2; f < nf - 2; f++) if (cy[f] >= cy[f - 1] && cy[f] > cy[f + 1] - 0.01 && cy[f] >= cy[f - 2] && cy[f] >= cy[f + 2] && (cy[f] - Math.min(cy[f - 2], cy[f + 2])) > 0.3) lows.push(f / fps);
console.log('dot impacts (lowest points) vs cue sheet:');
for (const b of expected) {
  const te = beats[0] + b * P;
  const near = lows.reduce((best, t) => (Math.abs(t - te) < Math.abs(best - te) ? t : best), Infinity);
  console.log(`  beat ${String(b).padEnd(6)} expected ${te.toFixed(3)}s  measured ${Number.isFinite(near) ? near.toFixed(3) + 's  ' + ((near - te) * 1000).toFixed(0).padStart(4) + ' ms' : 'none'}`);
}
