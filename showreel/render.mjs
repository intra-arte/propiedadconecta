// node render.mjs                 full film -> out/showreel.mp4 (60 fps, 6-sample motion blur, H.264 CRF 16)
// node render.mjs --sheet         one frame per beat -> out/sheet.png (+ phone-size copy)
// node render.mjs --at 1.2,3.4    stills -> out/at-<t>.png
// options: --fps 60 --samples 6 --workers 4 --from 0 --to 15 --offset 0.08 (sheet sample point after each beat)
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import { extname, join } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const flag = k => args.includes('--' + k);
const FPS = +opt('fps', 60), SAMPLES = +opt('samples', 6), WORKERS = +opt('workers', 4), DUR = 15;
await mkdir(join(ROOT, 'out'), { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' });
    res.end(await readFile(p));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/index.html`;

async function worker() {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('page error:', e.message); process.exitCode = 1; });
  await page.goto(url);
  await page.evaluate(() => window.ready);
  return {
    async frame(t, samples) {
      await page.evaluate(([t, s]) => window.seek(t, s), [t, samples]);
      return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    },
    close: () => browser.close(),
  };
}

async function renderTimes(times, samples, onFrame) {
  const ws = await Promise.all(Array.from({ length: Math.min(WORKERS, times.length) }, worker));
  let next = 0;
  await Promise.all(ws.map(async w => {
    while (next < times.length) { const i = next++; await onFrame(i, await w.frame(times[i], samples)); }
  }));
  await Promise.all(ws.map(w => w.close()));
}

const beats = JSON.parse(await readFile(join(ROOT, 'beats.json'), 'utf8')).beats;

if (flag('sheet')) {
  const off = +opt('offset', 0.08), from = +opt('from', 0), to = +opt('to', 32), step = +opt('step', 1);
  const times = [];
  for (let b = from; b < to; b += step) times.push(+(beats[0] + b * (beats[1] - beats[0]) + off).toFixed(4));
  const files = [];
  await renderTimes(times, +opt('samples', 1), async (i, png) => { const f = join(ROOT, 'out', `sheet-${String(i).padStart(2, '0')}.png`); await writeFile(f, png); files[i] = f; });
  const labels = times.map((t, i) => ['-label', `beat ${(from + i * step).toFixed(2)}  t=${t.toFixed(2)}s`]).flat();
  const out = join(ROOT, 'out', opt('name', 'sheet') + '.png');
  execFileSync('montage', [...files.map((f, i) => [labels[i * 2], labels[i * 2 + 1], f]).flat(), '-tile', '4x', '-geometry', '480x270+6+6', '-background', '#222', '-fill', '#ddd', '-pointsize', '15', out]);
  // the phone check: same sheet at roughly a phone's rendered width per frame
  execFileSync('montage', [...files, '-tile', '8x', '-geometry', '240x135+3+3', '-background', '#222', out.replace('.png', '-phone.png')]);
  console.log('wrote', out);
} else if (opt('at')) {
  const times = opt('at').split(',').map(Number);
  await renderTimes(times, +opt('samples', 1), async (i, png) => writeFile(join(ROOT, 'out', `at-${times[i].toFixed(3)}.png`), png));
  console.log('wrote', times.length, 'stills');
} else {
  const from = +opt('from', 0), to = +opt('to', DUR);
  const n = Math.round((to - from) * FPS), times = Array.from({ length: n }, (_, i) => from + i / FPS);
  const out = join(ROOT, 'out', opt('out', 'showreel.mp4'));
  const ff = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-ss', String(from), '-t', String(to - from), '-i', join(ROOT, 'out', 'score.wav'),
    '-map', '0:v', '-map', '1:a',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-tune', 'animation', '-pix_fmt', 'yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', '-shortest', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const pending = new Map();
  let written = 0, t0 = Date.now();
  const flush = async () => {
    while (pending.has(written)) {
      const buf = pending.get(written); pending.delete(written); written++;
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (written % 60 === 0) process.stdout.write(`\r${written}/${n} frames  ${((Date.now() - t0) / written).toFixed(0)} ms/frame `);
    }
  };
  let chain = Promise.resolve();
  await renderTimes(times, SAMPLES, async (i, png) => { pending.set(i, png); chain = chain.then(flush); await chain; });
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log(`\nwrote ${out}`);
}
server.close();
