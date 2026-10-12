#!/usr/bin/env node
/*
 * Renders the style frames of «Monedas al aire»: video/monedas/frames.html?f=1..6
 * → video/monedas/style-frames/sf0N.png. Needs Playwright (Chromium with SwiftShader WebGL).
 *   node video/monedas/frames.mjs          (all)
 *   node video/monedas/frames.mjs 2 4      (some)
 */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const OUT = path.join(DIR, 'style-frames');
const { chromium } = (() => { try { return require('playwright'); } catch { return require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); } })();
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const which = process.argv.slice(2).map(Number);
for (const f of which.length ? which : [1, 2, 3, 4, 5, 6]) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error(`f${f} error:`, e.message));
  page.on('console', m => m.type() === 'error' && console.error(`f${f} console:`, m.text()));
  const t0 = Date.now();
  await page.goto(`http://127.0.0.1:${server.address().port}/video/monedas/frames.html?f=${f}`);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
  await page.locator('#stage').screenshot({ path: path.join(OUT, `sf0${f}.png`) });
  console.log(`  sf0${f}.png (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  await page.close();
}
await browser.close();
server.close();
