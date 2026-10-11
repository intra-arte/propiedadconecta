// node render.mjs --v A                 película completa → salida/propiedad-conecta-v1-A.mp4 (30 fps, desenfoque de 10 subfotogramas,
//                                       audio de salida/mezcla-A.wav, o de musica-A.wav si todavía no hay mezcla con voz)
// node render.mjs --hoja --v A [--rev]  un fotograma por beat → salida/hoja-A.png y salida/hoja-A-movil.png (390 px por fotograma)
// node render.mjs --en 1.2,3.4 --v B    fotogramas sueltos → salida/fotograma-B-<t>.png
// opciones: --fps 30 --muestras 10 --hilos 4 --desde 0 --hasta 32 --paso 1 --desfase 0.06 --nombre hoja-A
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import { extname, join, dirname } from 'node:path';
import { DURACION } from './src/linea-de-tiempo.js';

const HERE = new URL('.', import.meta.url).pathname, ROOT = dirname(HERE.replace(/\/$/, '')); // servimos la carpeta del reel: ../marca queda accesible
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const flag = k => args.includes('--' + k);
const V = opt('v', 'A'), REV = flag('rev'), FPS = +opt('fps', 30), SAMPLES = +opt('muestras', 10), HILOS = +opt('hilos', 4);
const OUT = join(HERE, 'salida');
await mkdir(OUT, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try {
    const p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(ROOT)) throw new Error('fuera de la carpeta');
    res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' });
    res.end(await readFile(p));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/motion-v1/index.html?v=${V}${REV ? '&rev=1' : ''}`;

async function worker() {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('error en la página:', e.message); process.exitCode = 1; });
  await page.goto(url);
  await page.evaluate(() => window.ready);
  return {
    async frame(t, s) { await page.evaluate(([t, s]) => window.seek(t, s), [t, s]); return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920 } }); },
    close: () => browser.close(),
  };
}
async function renderTimes(times, samples, onFrame) {
  const ws = await Promise.all(Array.from({ length: Math.min(HILOS, times.length) }, worker));
  let next = 0;
  await Promise.all(ws.map(async w => { while (next < times.length) { const i = next++; await onFrame(i, await w.frame(times[i], samples)); } }));
  await Promise.all(ws.map(w => w.close()));
}
const beats = JSON.parse(await readFile(join(HERE, 'beats.json'), 'utf8')).beats;
const P = beats[1] - beats[0];
const coma = (n, d = 2) => n.toFixed(d).replace('.', ',');

if (flag('hoja')) {
  const off = +opt('desfase', 0.06), from = +opt('desde', 0), to = +opt('hasta', 32), step = +opt('paso', 1);
  const times = [];
  for (let b = from; b < to - 1e-9; b += step) times.push(+(beats[0] + b * P + off).toFixed(4));
  const files = [];
  await renderTimes(times, +opt('muestras', 1), async (i, png) => { const f = join(OUT, `cuadro-${String(i).padStart(2, '0')}.png`); await writeFile(f, png); files[i] = f; });
  const name = opt('nombre', `hoja-${V}${REV ? '-rev' : ''}`), out = join(OUT, name + '.png');
  const lab = times.map((t, i) => ['-label', `beat ${coma(from + i * step)} · ${coma(t)} s`]);
  execFileSync('montage', [...files.map((f, i) => [...lab[i], f]).flat(), '-tile', '8x', '-geometry', '240x427+5+5', '-background', '#1e1e1e', '-fill', '#ddd', '-pointsize', '13', out]);
  // tamaño de teléfono: 390 px de ancho por fotograma (iPhone de 6,1″)
  execFileSync('montage', [...files, '-tile', `${Math.min(6, files.length)}x`, '-geometry', '390x693+4+4', '-background', '#1e1e1e', out.replace('.png', '-movil.png')]);
  console.log('escrito', out);
} else if (opt('en')) {
  const times = opt('en').split(',').map(Number);
  await renderTimes(times, +opt('muestras', 1), async (i, png) => writeFile(join(OUT, `fotograma-${V}${REV ? '-rev' : ''}-${times[i].toFixed(3)}.png`), png));
  console.log('escritos', times.length, 'fotogramas');
} else {
  const n = Math.round(DURACION * FPS), times = Array.from({ length: n }, (_, i) => i / FPS);
  const out = join(OUT, opt('salida', `propiedad-conecta-v1-${V}${REV ? '-revision' : ''}.mp4`));
  // con voz si voz.mjs y musica.mjs ya armaron la mezcla; si no, la música sola
  const audio = [`mezcla-${V}.wav`, `musica-${V}.wav`].map(f => join(OUT, f)).find(f => existsSync(f));
  console.log('audio:', audio.split('/').pop());
  const ff = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-i', audio, '-map', '0:v', '-map', '1:a',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-tune', 'animation', '-pix_fmt', 'yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-shortest', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const pending = new Map();
  let written = 0; const t0 = Date.now();
  const flush = async () => {
    while (pending.has(written)) {
      const b = pending.get(written); pending.delete(written); written++;
      if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r));
      if (written % 60 === 0) process.stdout.write(`\r${written}/${n} fotogramas · ${((Date.now() - t0) / written).toFixed(0)} ms/fotograma `);
    }
  };
  let chain = Promise.resolve();
  await renderTimes(times, SAMPLES, async (i, png) => { pending.set(i, png); chain = chain.then(flush); await chain; });
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log(`\nescrito ${out}`);
}
server.close();
