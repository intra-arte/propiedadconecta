#!/usr/bin/env node
/*
 * Renders a time-driven page (window.draw(t)) frame by frame into an MP4.
 *
 *   node video/render.mjs                 → video/out/propiedad-conecta-15s.mp4 (+ soundtrack if
 *                                           video/music/soundtrack.wav exists) + contact sheet
 *   node video/render.mjs --stills 1,6.5  → video/out/stills/t_<s>.png only
 *
 * Other films: --page <html> --out <dir> --name <file> --duration <s> --music <wav> [--gl for WebGL pages]
 *   node video/render.mjs --page video/explicativo/index.html --out video/explicativo/out \
 *     --name propiedad-conecta-explicativo-32s --duration 32 --music video/explicativo/music/soundtrack.wav
 *
 * --from <s> --to <s>: render only that span into <name>.part.mp4 (no soundtrack, no contact sheet), to re-shoot
 *   one passage and splice it back in.
 *
 * Needs Playwright (Chromium) and ffmpeg. Run `python3 video/prep.py` first.
 */
import { createRequire } from 'node:module';
import { spawn, execFileSync, execSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const PAGE = path.resolve(ROOT, arg('--page', 'video/index.html'));
const OUT = path.resolve(ROOT, arg('--out', 'video/out'));
const FPS = 60, DURATION = Number(arg('--duration', 15)), W = 1920, H = 1080;
const NAME = arg('--name', 'propiedad-conecta-15s');
const MUSIC = path.resolve(ROOT, arg('--music', 'video/music/soundtrack.wav'));
const FROM = Number(arg('--from', 0)), TO = Number(arg('--to', DURATION)), PART = process.argv.includes('--from') || process.argv.includes('--to');

function playwright() {
  try { return require('playwright'); } catch {
    return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
  }
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok(server)));
}

async function main() {
  const stillsArg = process.argv.indexOf('--stills');
  const stills = stillsArg > 0 ? process.argv[stillsArg + 1].split(',').map(Number) : null;
  if (!fs.existsSync(path.join(path.dirname(PAGE), 'assets', 'meta.json'))) throw new Error('Run the prep.py next to the page first');
  fs.mkdirSync(OUT, { recursive: true });

  const server = await serve();
  const { chromium } = playwright();
  // --gl: software WebGL (SwiftShader) for Three.js pages
  const browser = await chromium.launch(process.argv.includes('--gl') ? { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {});
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('console', m => m.type() === 'error' && console.error('page:', m.text()));
  page.on('pageerror', e => { console.error('page error:', e.message); process.exitCode = 1; });
  await page.goto(`http://127.0.0.1:${server.address().port}/${path.relative(ROOT, PAGE).split(path.sep).join('/')}?render=1`);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
  const stage = page.locator('#stage');

  if (stills) {
    const dir = path.join(OUT, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of stills) {
      await page.evaluate(x => window.draw(x), t);
      await stage.screenshot({ path: path.join(dir, `t_${t.toFixed(2)}.png`) });
    }
    console.log(`  ${stills.length} stills → ${path.relative(ROOT, dir)}`);
  } else {
    const file = path.join(OUT, PART ? `${NAME}.part.mp4` : `${NAME}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-tune', 'animation', '-x264-params', 'aq-mode=3',
      '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((ok, bad) => ff.on('close', c => (c === 0 ? ok() : bad(new Error('ffmpeg exited ' + c)))));
    const frames = Math.round(FPS * TO), first = Math.round(FPS * FROM);
    const t0 = Date.now();
    for (let i = first; i < frames; i++) {
      await page.evaluate(x => window.draw(x), i / FPS);
      const png = await stage.screenshot({ type: 'png' });
      if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 60 === 0) process.stdout.write(`\r  frame ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end();
    await done;
    console.log(`\n  wrote ${path.relative(ROOT, file)}`);
    if (PART) { await browser.close(); server.close(); return; }
    // Soundtrack (video/music/compose.py): mux it in when it exists.
    const music = MUSIC;
    if (fs.existsSync(music)) {
      const tmp = file.replace(/\.mp4$/, '.tmp.mp4');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-i', music, '-map', '0:v', '-map', '1:a',
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart', tmp]);
      fs.renameSync(tmp, file);
      console.log('  muxed soundtrack');
    }
    // Contact sheet: one frame every 0.5 s.
    const sheet = path.join(OUT, `${NAME}-contact-sheet.jpg`);
    const rows = Math.ceil(DURATION * 2 / 6);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-vf', `fps=2,scale=384:-1,tile=6x${rows}:padding=4:color=0x222222`, '-frames:v', '1', '-q:v', '3', sheet]);
    console.log(`  wrote ${path.relative(ROOT, sheet)}`);
  }
  await browser.close();
  server.close();
}

main().catch(e => { console.error(e); process.exit(1); });
