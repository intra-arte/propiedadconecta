// Controles automáticos sobre un video EXPORTADO (no sobre la vista previa del navegador).
// node control.mjs salida/propiedad-conecta-v1-A.mp4 A
// Mide: formato, duración, sonoridad integrada y pico real, sincronía del punto con los beats
// (rastreando el verde del punto fotograma a fotograma), y proporción del logo en el último fotograma.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { EV, SEGURA } from './src/linea-de-tiempo.js';

const file = process.argv[2], V = process.argv[3] || 'A';
const out = [];
const log = s => { out.push(s); console.log(s); };
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]).toString());
const v = probe.streams.find(s => s.codec_type === 'video'), a = probe.streams.find(s => s.codec_type === 'audio');
const fps = v.r_frame_rate.split('/').reduce((x, y) => x / y);
const coma = (n, d = 2) => Number(n).toFixed(d).replace('.', ',');
log(`# Control automático · versión ${V}`);
log('');
log(`Archivo: \`${file.split('/').pop()}\` · ${(probe.format.size / 1048576).toFixed(1).replace('.', ',')} MB`);
log('');
log('| Comprobación | Resultado | Esperado | Estado |');
log('|---|---|---|---|');
const row = (k, r, e, ok) => log(`| ${k} | ${r} | ${e} | ${ok ? 'OK' : '**REVISAR**'} |`);
row('Resolución', `${v.width} × ${v.height}`, '1080 × 1920', v.width === 1080 && v.height === 1920);
row('Códec / píxel', `${v.codec_name} · ${v.pix_fmt}`, 'h264 · yuv420p', v.codec_name === 'h264' && v.pix_fmt === 'yuv420p');
row('Fotogramas por segundo', coma(fps, 0), '30', Math.abs(fps - 30) < 0.01);
row('Duración', `${coma(+probe.format.duration, 3)} s`, '16,000 s', Math.abs(probe.format.duration - 16) < 0.05);
row('Audio', a ? `${a.codec_name} · ${a.sample_rate} Hz · ${a.channels} canales` : 'sin audio', 'aac · 48000 Hz · 2', !!a);
const eb = execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString() + '';
const ebr = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${file}" -af ebur128=peak=true -f null - 2>&1 | tail -14`]).toString();
const I = +ebr.match(/I:\s+(-?[\d.]+) LUFS/)[1], TP = +ebr.match(/Peak:\s+(-?[\d.]+) dBFS/)[1];
row('Sonoridad integrada', `${coma(I, 1)} LUFS`, '−14 LUFS ±1 (provisional: falta la voz)', Math.abs(I + 14) <= 1);
row('Pico real', `${coma(TP, 1)} dBTP`, '≤ −1 dBTP', TP <= -1);
void eb;

// --- sincronía: el punto (verde #4C9F2D) rastreado en el video
const W2 = 270, H2 = 480;
const rgb = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${W2}:${H2}:flags=area`, '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 });
const fsz = W2 * H2 * 3, nf = rgb.length / fsz, cy = [];
for (let f = 0; f < nf; f++) {
  let sy = 0, c = 0; const base = f * fsz;
  for (let i = 0; i < W2 * H2; i++) { const r = rgb[base + i * 3], g = rgb[base + i * 3 + 1], b = rgb[base + i * 3 + 2]; if (g > 125 && r < 125 && b < 85 && g - r > 50) { sy += Math.floor(i / W2); c++; } }
  cy.push(c > 3 && c < 2500 ? sy / c : NaN);
}
const beats = JSON.parse(readFileSync(new URL('./beats.json', import.meta.url))).beats, P = beats[1] - beats[0];
const B = b => beats[0] + b * P;
const lows = [];
for (let f = 2; f < nf - 2; f++) if (cy[f] >= cy[f - 1] && cy[f] > cy[f + 1] - 0.01 && cy[f] >= cy[f - 2] && cy[f] >= cy[f + 2] && cy[f] - Math.min(cy[f - 2], cy[f + 2]) > 0.25) lows.push(f / fps);
const esperados = V === 'A' ? [['salto 1 (sello)', EV.saltosA[0]], ['salto 2 (sello)', EV.saltosA[1]], ['salto 3 (sello)', EV.saltosA[2]], ['punto de la «i»', EV.tilde]] : [['cae en «BUSCO»', EV.caeB], ['punto de la «i»', EV.tilde]];
log('');
log(`## Sincronía del punto (rastreado en el video, ${coma(fps, 0)} fps: un fotograma = ${coma(1000 / fps, 1)} ms)`);
log('');
log('| Impacto | Beat | Esperado (s) | Medido (s) | Desvío |');
log('|---|---|---|---|---|');
for (const [name, b] of esperados) {
  const te = B(b), near = lows.reduce((best, t) => (Math.abs(t - te) < Math.abs(best - te) ? t : best), Infinity);
  const d = (near - te) * 1000;
  log(`| ${name} | ${coma(b)} | ${coma(te, 3)} | ${Number.isFinite(near) ? coma(near, 3) : '—'} | ${Number.isFinite(near) ? `${d >= 0 ? '+' : ''}${d.toFixed(0)} ms ${Math.abs(d) <= 1000 / fps + 1 ? '(OK)' : '(**REVISAR**)'}` : 'no detectado'} |`);
}

// --- logo en el último fotograma: proporción y posición
const last = execFileSync('ffmpeg', ['-v', 'error', '-sseof', '-0.1', '-i', file, '-frames:v', '1', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 26 });
let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
for (let y = 560; y < 960; y++) for (let x = 0; x < 1080; x++) {
  const i = (y * 1080 + x) * 3, r = last[i], g = last[i + 1], b = last[i + 2];
  if (r + g + b < 600) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
}
const wq = x1 - x0 + 1, hq = y1 - y0 + 1, ratio = wq / hq, orig = 1064 / 285;
log('');
log('## Logo en el último fotograma (archivo original `marca/logo-horizontal-transparente.png`)');
log('');
log(`- Contenido medido: ${wq} × ${hq} px, proporción ${coma(ratio, 3)}; en el archivo original 1064 × 285 px, proporción ${coma(orig, 3)} → desvío ${coma(Math.abs(ratio / orig - 1) * 100, 2)} % ${Math.abs(ratio / orig - 1) < 0.01 ? '(OK: sin deformación)' : '(**REVISAR**)'}.`);
log(`- Escala ${coma((wq / 1064) * 100, 1)} % del original (debe ser ≤ 100 %: ${wq <= 1064 ? 'OK' : '**REVISAR**'}).`);
log(`- Posición x ${x0}–${x1}, y ${y0}–${y1}; zona segura x ${SEGURA.x0}–${SEGURA.x1}, y ${SEGURA.y0}–${SEGURA.y1}: ${x0 >= SEGURA.x0 && x1 <= SEGURA.x1 && y0 >= SEGURA.y0 && y1 <= SEGURA.y1 ? 'OK' : '**REVISAR**'}.`);
writeFileSync(new URL(`./salida/control-${V}.md`, import.meta.url), out.join('\n') + '\n');
