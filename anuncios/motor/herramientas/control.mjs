// Controles automáticos sobre un video EXPORTADO (no sobre la vista previa del navegador).
// node motor/herramientas/control.mjs --anuncio <carpeta> salida/<archivo>-A.mp4 A
// Mide: formato, duración, sonoridad integrada y pico real, sincronía del punto con los beats
// (rastreando el verde del punto fotograma a fotograma), la voz (que cada frase esté en el audio
// exportado y en su sitio, y cuánto se separa de la música) y la proporción del logo en el último fotograma.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ruta, G, sueltos, DIR } from './comun.mjs';
import { SEGURA, LOGO } from '../nucleo/marca.js';
import { readWav } from '../nucleo/dsp.mjs';

const file = resolve(DIR, sueltos[0]), V = sueltos[1] || 'A';
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
row('Duración', `${coma(+probe.format.duration, 3)} s`, `${coma(G.DURACION, 3)} s`, Math.abs(probe.format.duration - G.DURACION) < 0.05);
row('Audio', a ? `${a.codec_name} · ${a.sample_rate} Hz · ${a.channels} canales` : 'sin audio', 'aac · 48000 Hz · 2', !!a);
const eb = execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] }).toString() + '';
const ebr = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${file}" -af ebur128=peak=true -f null - 2>&1 | tail -14`]).toString();
const I = +ebr.match(/I:\s+(-?[\d.]+) LUFS/)[1], TP = +ebr.match(/Peak:\s+(-?[\d.]+) dBFS/)[1];
row('Sonoridad integrada', `${coma(I, 1)} LUFS`, '−14 LUFS ±1', Math.abs(I + 14) <= 1);
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
const beats = JSON.parse(readFileSync(ruta('beats.json'))).beats, P = beats[1] - beats[0];
const B = b => beats[0] + b * P;
const lows = [];
for (let f = 2; f < nf - 2; f++) if (cy[f] >= cy[f - 1] && cy[f] > cy[f + 1] - 0.01 && cy[f] >= cy[f - 2] && cy[f] >= cy[f + 2] && cy[f] - Math.min(cy[f - 2], cy[f + 2]) > 0.25) lows.push(f / fps);
const esperados = G.CONTROL.impactos[V];
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

// --- voz: cada frase se busca en el audio del MP4 correlacionándola con el stem de voz
const coloc = ruta('locucion', 'colocacion.json'), stem = ruta('salida', `stem-voz-${V}.wav`), mez = ruta('salida', `mezcla-${V}.json`);
if (existsSync(coloc) && existsSync(stem) && existsSync(mez)) {
  const lineas = JSON.parse(readFileSync(coloc))[V], info = JSON.parse(readFileSync(mez));
  const DEC = 4, SRD = 48000 / DEC; // la correlación se hace a 12 kHz: precisión de 0,08 ms
  const dec = x => { const o = new Float32Array(Math.floor(x.length / DEC)); for (let i = 0; i < o.length; i++) { let s = 0; for (let k = 0; k < DEC; k++) s += x[i * DEC + k]; o[i] = s / DEC; } return o; };
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  const audio = dec(new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length)));
  const [vl, vr] = readWav(readFileSync(stem)), voz = dec(vl.map((v, i) => (v + vr[i]) / 2));
  log('');
  log('## Voz (buscada en el audio exportado)');
  log('');
  log(`Cada frase del stem de voz se correlaciona con el audio del MP4 en ±60 ms. «Imagen» es el evento al que se ancla. «Voz/música»: sonoridad de la voz menos la de música + SFX en el tramo de la frase (objetivo ${info.vmrObjetivo} dB).`);
  log('');
  log('| Línea | Frase | Inicio (s) | Desfase medido en el MP4 | Correlación | Frente a la imagen | Voz/música |');
  log('|---|---|---|---|---|---|---|');
  for (const l of lineas) {
    if (l.pendiente) { log(`| ${l.id} | ${l.texto} | ${coma(l.inicio)} | **falta la toma** | — | — | — |`); continue; }
    for (const f of l.frases) {
      const a = Math.round((f.inicio - 0.03) * SRD), b = Math.round((f.fin + 0.1) * SRD), M = Math.round(0.06 * SRD);
      let best = -2, lag = 0;
      for (let d = -M; d <= M; d++) {
        let sxy = 0, sxx = 0, syy = 0;
        for (let i = a; i < b; i++) { const x = voz[i], y = audio[i + d] || 0; sxy += x * y; sxx += x * x; syy += y * y; }
        const r = sxy / Math.sqrt(sxx * syy + 1e-20);
        if (r > best) { best = r; lag = d; }
      }
      const ms = (lag / SRD) * 1000, pf = info.porFrase.find(p => Math.abs(p.t0 - f.inicio) < 0.01);
      log(`| ${l.id} | ${f.texto} | ${coma(f.inicio, 3)} | ${ms >= 0 ? '+' : ''}${coma(ms, 1)} ms ${Math.abs(ms) <= 1 && best > 0.5 ? '(OK)' : '(**REVISAR**)'} | ${coma(best, 2)} | ${f.imagen !== undefined ? `${f.inicio - f.imagen >= 0 ? '+' : '−'}${coma(Math.abs(f.inicio - f.imagen), 2)} s` : '—'} | ${pf ? `${coma(pf.vmr, 1)} dB ${pf.vmr >= info.vmrObjetivo - 1 ? '(OK)' : '(**REVISAR**)'}` : '—'} |`);
    }
  }
  log('');
  log(`Mezcla: la voz queda en conjunto ${coma(info.vmrGlobal, 1)} dB por encima de la música; el limitador de la mezcla recorta como máximo ${coma(info.limitadorMaxDb, 1)} dB.`);
}

// --- logo en el último fotograma: proporción y posición
const last = execFileSync('ffmpeg', ['-v', 'error', '-sseof', '-0.1', '-i', file, '-frames:v', '1', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 26 });
let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
for (let y = 560; y < 960; y++) for (let x = 0; x < 1080; x++) {
  const i = (y * 1080 + x) * 3, r = last[i], g = last[i + 1], b = last[i + 2];
  if (r + g + b < 600) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
}
const LW = LOGO.contenido.x1 - LOGO.contenido.x0 + 1, LH = LOGO.contenido.y1 - LOGO.contenido.y0 + 1;
const wq = x1 - x0 + 1, hq = y1 - y0 + 1, ratio = wq / hq, orig = LW / LH;
log('');
log('## Logo en el último fotograma (archivo original `marca/logo-horizontal-transparente.png`)');
log('');
log(`- Contenido medido: ${wq} × ${hq} px, proporción ${coma(ratio, 3)}; en el archivo original ${LW} × ${LH} px, proporción ${coma(orig, 3)} → desvío ${coma(Math.abs(ratio / orig - 1) * 100, 2)} % ${Math.abs(ratio / orig - 1) < 0.01 ? '(OK: sin deformación)' : '(**REVISAR**)'}.`);
log(`- Escala ${coma((wq / LW) * 100, 1)} % del original (debe ser ≤ 100 %: ${wq <= LW ? 'OK' : '**REVISAR**'}).`);
log(`- Posición x ${x0}–${x1}, y ${y0}–${y1}; zona segura x ${SEGURA.x0}–${SEGURA.x1}, y ${SEGURA.y0}–${SEGURA.y1}: ${x0 >= SEGURA.x0 && x1 <= SEGURA.x1 && y0 >= SEGURA.y0 && y1 <= SEGURA.y1 ? 'OK' : '**REVISAR**'}.`);
writeFileSync(ruta('salida', `control-${V}.md`), out.join('\n') + '\n');
